/* Resume import: PDF and DOCX -> a populated form.
 *
 * Both formats are reduced to the same "line" shape before parsing:
 *   { text, cols, level, bullet, x, size, bold, hdr }
 * so the section/entry heuristics below never need to know where a line came from.
 */

/* =======================================================================
 * DOCX
 *
 * We read the .docx zip directly instead of using a text-extraction library.
 * Two reasons: contact blocks very often live in the document *header*, which
 * body-only extractors silently drop, and the paragraph styles tell us which
 * lines are headings and which are list items — signal worth keeping.
 * ===================================================================== */

async function inflateRaw(bytes) {
    if (typeof DecompressionStream === 'undefined') {
        throw new Error('This browser cannot unzip DOCX files. Try exporting your resume as a PDF instead.');
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function readZip(buffer) {
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);
    let eocd = -1;
    for (let i = bytes.length - 22; i >= 0 && i > bytes.length - 66000; i--) {
        if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('Not a valid DOCX file.');

    const count = view.getUint16(eocd + 10, true);
    let p = view.getUint32(eocd + 16, true);
    const files = {};
    const dec = new TextDecoder();

    for (let n = 0; n < count && p + 46 <= bytes.length; n++) {
        if (view.getUint32(p, true) !== 0x02014b50) break;
        const method = view.getUint16(p + 10, true);
        const compSize = view.getUint32(p + 20, true);
        const nameLen = view.getUint16(p + 28, true);
        const extraLen = view.getUint16(p + 30, true);
        const cmtLen = view.getUint16(p + 32, true);
        const localAt = view.getUint32(p + 42, true);
        const name = dec.decode(bytes.subarray(p + 46, p + 46 + nameLen));

        if (/^word\/(document|header\d*|footer\d*)\.xml$/.test(name)) {
            const lNameLen = view.getUint16(localAt + 26, true);
            const lExtraLen = view.getUint16(localAt + 28, true);
            const start = localAt + 30 + lNameLen + lExtraLen;
            const raw = bytes.subarray(start, start + compSize);
            files[name] = method === 0 ? raw : await inflateRaw(raw);
        }
        p += 46 + nameLen + extraLen + cmtLen;
    }
    return files;
}

const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

function docxParagraphs(xmlBytes, isHeader) {
    const doc = new DOMParser().parseFromString(new TextDecoder().decode(xmlBytes), 'application/xml');
    const out = [];
    const paras = doc.getElementsByTagNameNS(W_NS, 'p');
    for (let i = 0; i < paras.length; i++) {
        const p = paras[i];
        let text = '';
        const walk = node => {
            for (let c = node.firstChild; c; c = c.nextSibling) {
                if (c.nodeType !== 1) continue;
                const ln = c.localName;
                if (ln === 't') text += c.textContent;
                else if (ln === 'tab') text += '\t';
                else if (ln === 'br' || ln === 'cr') text += ' ';
                else walk(c);
            }
        };
        walk(p);
        text = text.replace(/\u00a0/g, ' ').replace(/[^\S\t]+/g, ' ').trim();
        if (!text) continue;

        const styleEl = p.getElementsByTagNameNS(W_NS, 'pStyle')[0];
        const style = styleEl ? (styleEl.getAttributeNS(W_NS, 'val') || '') : '';
        const m = /heading\s*(\d)/i.exec(style);
        const boldEl = p.getElementsByTagNameNS(W_NS, 'b')[0];
        out.push({
            text: text.replace(/\t/g, '  '),
            cols: text.split('\t'),
            level: m ? parseInt(m[1], 10) : 0,
            bullet: /list/i.test(style) || p.getElementsByTagNameNS(W_NS, 'numPr').length > 0,
            x: 0, size: 12, bold: !!boldEl || /heading/i.test(style), hdr: !!isHeader
        });
    }
    return out;
}

async function linesFromDocx(buffer) {
    const files = await readZip(buffer);
    const lines = [];
    // Headers first: that is where name/phone/email usually live.
    Object.keys(files).sort().forEach(name => {
        if (/header/.test(name)) lines.push(...docxParagraphs(files[name], true));
    });
    if (files['word/document.xml']) lines.push(...docxParagraphs(files['word/document.xml'], false));
    if (!lines.length) throw new Error('No readable text found in that DOCX.');
    return lines;
}

/* =======================================================================
 * PDF — cluster spans into visual rows, then split genuine two-column bands.
 * ===================================================================== */

// pdf.js needs its worker pointed at explicitly; version must match the library in index.html.
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const DOTS_RE = /[.\u00b7\u2022_]{3,}/g;
const MON_S = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\.?';
const DATE_TAIL_RE = new RegExp('^(?:' + MON_S + '\\s*)?\\d{2,4}\\s*(?:[-\u2013\u2014]|to)?\\s*(?:(?:' + MON_S + '\\s*)?\\d{2,4}|Present|Current|Now)?$', 'i');
const GAP_TAB = 18, GUTTER = 55, YTOL = 3;

async function linesFromPdf(buffer) {
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const out = [];
    for (let pno = 1; pno <= pdf.numPages; pno++) {
        const page = await pdf.getPage(pno);
        const content = await page.getTextContent();
        const width = page.getViewport({ scale: 1 }).width;

        const items = [];
        content.items.forEach(it => {
            if (!it.str || !it.str.trim()) return;
            const size = Math.abs(it.transform[3]) || it.height || 10;
            items.push({
                t: it.str, x0: it.transform[4], x1: it.transform[4] + (it.width || 0),
                y: it.transform[5], size: Math.round(size * 10) / 10,
                bold: /bold|black|heavy/i.test(it.fontName || '')
            });
        });
        if (!items.length) continue;

        items.sort((a, b) => (b.y - a.y) || (a.x0 - b.x0));
        const rows = [];
        items.forEach(it => {
            const last = rows[rows.length - 1];
            if (last && Math.abs(it.y - last[0].y) <= YTOL) last.push(it);
            else rows.push([it]);
        });
        rows.forEach(r => r.sort((a, b) => a.x0 - b.x0));

        out.push(...emitRows(rows, width, pno - 1));
    }
    if (!out.length) throw new Error('No selectable text in that PDF — it may be a scan.');
    return out;
}

function findColumnBands(rows, pageW) {
    const mid = pageW * 0.5;
    const rightish = [];
    rows.forEach((r, k) => {
        const right = r.filter(i => i.x0 > mid);
        if (!right.length) return;
        const left = r.filter(i => i.x1 < mid);
        if (left.length && (Math.min(...right.map(i => i.x0)) - Math.max(...left.map(i => i.x1))) <= GUTTER) return;
        const rt = right.map(i => i.t).join(' ').trim();
        if (rt.length < 5 || DATE_TAIL_RE.test(rt)) return;   // right-aligned date, not a column
        rightish.push({ k: k, y: r[0].y });
    });
    if (!rightish.length) return [];

    const clusters = [[rightish[0]]];
    for (let i = 1; i < rightish.length; i++) {
        const prev = clusters[clusters.length - 1];
        if (Math.abs(prev[prev.length - 1].y - rightish[i].y) <= 72) prev.push(rightish[i]);
        else clusters.push([rightish[i]]);
    }
    return clusters
        .map(c => [c[0].k, c[c.length - 1].k, c.length])
        .filter(b => (b[1] - b[0] + 1) >= 3 && b[2] >= 2)
        .map(b => [b[0], b[1]]);
}

function joinRow(items) {
    let s = '';
    items.forEach((it, k) => {
        if (k && it.x0 - items[k - 1].x1 > GAP_TAB) s += '\t';
        s += it.t;
    });
    s = s.replace(DOTS_RE, ' ').replace(/[ \t]*\t[ \t]*/g, '\t').replace(/[^\S\t]+/g, ' ').trim();
    return s;
}

function makeLine(items, page) {
    const s = joinRow(items);
    return {
        text: s.replace(/\t/g, '  '), cols: s.split('\t'), level: 0,
        bullet: /^\s*[\u2022\u25cf\u25cb\u25a0\u25e6\u25aa\u2023\u00b7*]/.test(items[0].t),
        x: Math.round(items[0].x0), size: Math.max(...items.map(i => i.size)),
        bold: items.some(i => i.bold), page: page, hdr: false
    };
}

function emitRows(rows, pageW, page) {
    const bands = findColumnBands(rows, pageW);
    const inBand = {};
    bands.forEach(b => { for (let k = b[0]; k <= b[1]; k++) inBand[k] = b; });
    const mid = pageW * 0.5;
    const out = [];
    let k = 0;
    while (k < rows.length) {
        const band = inBand[k];
        if (band) {
            // whole left column top-to-bottom, then the whole right column
            for (let side = 0; side < 2; side++) {
                for (let r = band[0]; r <= band[1]; r++) {
                    const sel = rows[r].filter(i => (i.x1 < mid) === (side === 0));
                    if (sel.length) out.push(makeLine(sel, page));
                }
            }
            k = band[1] + 1;
        } else {
            out.push(makeLine(rows[k], page));
            k++;
        }
    }
    return out;
}

/* =======================================================================
 * Parsing
 * ===================================================================== */

const MON = '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';
const DATE = '(?:' + MON + '\\.?\\s+\\d{4}|(?:Spring|Summer|Fall|Autumn|Winter)\\s+\\d{4}|\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}|\\d{1,2}[/-]\\d{4}|\\d{4})';
const ENDW = '(?:Present|Current|Now|Today|Ongoing)';
const SEPR = '\\s*(?:[\u2010-\u2015\\-\u2212]|to|through|until|thru)\\s*';
const RANGE_RE = new RegExp('(' + DATE + ')(?:' + SEPR + ')(' + DATE + '|' + ENDW + ')', 'i');
const ONE_RE = new RegExp('(' + DATE + ')', 'i');

const SECTION_LEX = {
    summary: ['(?:professional\\s+|career\\s+|personal\\s+)?(?:summary|objective|profile|about(?:\\s+me)?|overview)'],
    skills: ['(?:technical|core|key|relevant|related|professional|additional|other)?\\s*(?:skills|competencies|proficiencies|expertise|qualifications)(?:\\s*(?:&|and)\\s*\\w+)?'],
    experience: ['(?:work|professional|relevant|related|industry|employment|career)?\\s*(?:experience|employment|history)', 'work', 'employment\\s+history'],
    projects: ['(?:professional\\s+|personal\\s+|key\\s+|selected\\s+)?projects?'],
    education: ['education(?:al)?(?:\\s+background)?', 'academics?', 'academic\\s+background'],
    certificates: ['(?:certificates?|certifications?|licen[cs]es?|ratings?|credentials)(?:\\s*(?:&|and)\\s*(?:ratings?|certificates?|licen[cs]es?))?'],
    hours: ['(?:flight|flying|pilot)?\\s*(?:hours|time)', 'flight\\s+time', 'flight\\s+hours?'],
    training: ['(?:aviation\\s+|flight\\s+|professional\\s+)?training(?:\\s*(?:&|and)\\s*(?:education|development))?'],
    volunteer: ['(?:volunteer|community)(?:\\s+\\w+)?(?:\\s*(?:&|and)\\s*(?:community|volunteer)(?:\\s+\\w+)?)?'],
    references: ['references?']
};
const SECTION_RE = {};
Object.keys(SECTION_LEX).forEach(k => {
    SECTION_RE[k] = SECTION_LEX[k].map(p => new RegExp('^\\s*' + p + '\\s*$', 'i'));
});

const ORG_TOK = /\b(inc|llc|corp|corporation|company|co|ltd|group|airlines?|air|aviation|airways|university|college|institute|school|academy|services?|systems?|technologies|solutions|associates|partners|foundation|hospital|clinic|center|centre|department|agency|bank|labs?)\b/i;
const GEO_TOK = /,\s*[A-Z]{2}\b/;
const JOB_TOK = /\b(manager|engineer|analyst|developer|specialist|instructor|pilot|officer|director|coordinator|assistant|associate|intern|lead|supervisor|technician|captain|clerk|consultant|administrator|representative|agent|designer|architect|scientist|operator|dispatcher|attendant|cfi|cfii|mei|president|owner|founder|head|chief)\b/i;
const DEG_TOK = /\b(bachelor|master|associate|doctor|doctorate|ph\.?d|b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|m\.?b\.?a|a\.?a\.?s?|diploma|certificate|high\s+school|ged)\b/i;
const EDU_TOK = /\b(university|college|institute|school|academy|seminary)\b/i;
const BULLET_GLYPH = /^\s*[\u2022\u25cf\u25cb\u25a0\u25e6\u25aa\u2023\u2043\u00b7*]\s*/;

const stripBullet = t => t.replace(BULLET_GLYPH, '').trim();
const clean = t => t.replace(/\s+/g, ' ').replace(/^[\s,;|\u2013\u2014\-\u00b7]+|[\s,;|\u2013\u2014\-\u00b7]+$/g, '').trim();

const QUAL_SPLIT = /\s+[–—]\s+|\s+-\s+|:|\(/;

/* A heading often carries a trailing qualifier: "FLIGHT HOURS - AS OF JUNE 2026",
 * "EDUCATION (continued)". We try the qualifier-stripped form as well, but only
 * when the line is visually a heading — otherwise body prose such as
 * "Experience: 5 years of..." would silently open a new section. */
function isHeader(ln, bodySize) {
    const raw = ln.text.trim();
    if (!raw || BULLET_GLYPH.test(raw)) return null;
    const strong = ln.level > 0 || ln.bold || raw === raw.toUpperCase() || ln.size > bodySize + 0.6;

    const full = raw.replace(/:+$/, '').trim();
    const cands = [[full, false]];
    const head = raw.split(QUAL_SPLIT)[0].trim().replace(/:+$/, '').trim();
    if (head && head !== full) cands.push([head, true]);

    for (let i = 0; i < cands.length; i++) {
        const t = cands[i][0], needsStrong = cands[i][1];
        if (!t || t.length > 46 || t.split(/\s+/).length > 6) continue;
        if (t.endsWith('.') || RANGE_RE.test(t)) continue;
        if (needsStrong && !strong) continue;
        for (const sid in SECTION_RE) {
            if (SECTION_RE[sid].some(p => p.test(t))) return sid;
        }
    }
    return null;
}

function splitSections(lines) {
    const sizes = lines.map(l => l.size).sort((a, b) => a - b);
    const body = sizes.length ? sizes[Math.floor(sizes.length / 2)] : 12;
    const marks = [], seen = {};
    lines.forEach((ln, i) => {
        const sid = isHeader(ln, body);
        if (sid && !seen[sid]) { seen[sid] = 1; marks.push([i, sid]); }  // first occurrence wins
    });
    const out = {};
    const pre = marks.length ? lines.slice(0, marks[0][0]) : lines;
    marks.forEach((m, j) => {
        const end = j + 1 < marks.length ? marks[j + 1][0] : lines.length;
        out[m[1]] = lines.slice(m[0] + 1, end);
    });
    return { pre: pre, sections: out };
}

function takeDates(text) {
    let m = RANGE_RE.exec(text);
    if (m) return [m[1].trim(), m[2].trim(), text.slice(0, m.index) + ' ' + text.slice(m.index + m[0].length)];
    m = ONE_RE.exec(text);
    if (m) return [m[1].trim(), '', text.slice(0, m.index) + ' ' + text.slice(m.index + m[0].length)];
    return ['', '', text];
}

function parseEntries(lines, allowBare) {
    const ents = [];
    let cur = null;
    const blank = () => ({ heads: [], s: '', e: '', bullets: [] });

    const flush = () => {
        if (cur && (cur.heads.length || cur.bullets.length)) {
            let co = '', ti = '';
            const heads = cur.heads;
            if (heads.length) {
                let bestScore = -99, bestIdx = 0;
                heads.forEach((h, k) => {
                    const sc = (ORG_TOK.test(h) ? 2 : 0) + (GEO_TOK.test(h) ? 2 : 0) - (JOB_TOK.test(h) ? 2 : 0);
                    if (sc > bestScore) { bestScore = sc; bestIdx = k; }
                });
                co = heads[bestIdx];
                const rest = heads.filter((h, k) => k !== bestIdx);
                if (rest.length) ti = rest.find(h => JOB_TOK.test(h)) || rest[0];
                if (bestScore <= 0 && rest.length) { co = heads[0]; ti = heads[1] || ''; }
            }
            ents.push({ company: clean(co), title: clean(ti), startDate: cur.s, endDate: cur.e, bullets: cur.bullets });
        }
        cur = null;
    };

    const xs = lines.filter(l => !(l.bullet || BULLET_GLYPH.test(l.text))).map(l => l.x);
    const baseX = xs.length ? Math.min.apply(null, xs) : 0;

    lines.forEach(ln => {
        const t = ln.text;
        if (ln.bullet || BULLET_GLYPH.test(t)) {
            if (!cur) cur = blank();
            const b = stripBullet(t);
            if (b.length > 3) cur.bullets.push(b);
            return;
        }
        // an indented, glyph-less line straight after a bullet is that bullet's wrapped tail
        if (cur && cur.bullets.length && ln.x > baseX + 4 && !RANGE_RE.test(t)) {
            cur.bullets[cur.bullets.length - 1] += ' ' + clean(t);
            return;
        }
        const d = takeDates(t);
        const rest = clean(d[2]);
        if (cur && (cur.bullets.length || cur.heads.length >= 2 || (cur.s && d[0]))) flush();
        if (!cur) cur = blank();
        if (d[0] && !cur.s) { cur.s = d[0]; cur.e = d[1]; }
        if (rest) cur.heads.push(rest);
    });
    flush();
    return ents.filter(e => e.company || e.title || (allowBare && e.bullets.length));
}

const EDU_SPLIT = /\s*[–—|]\s*|\s+-\s+/;
const GPA_RE = /\(?\s*GPA[:\s]*[0-4]\.\d+\s*\)?/i;

/* "B.S., IT Management - Northern Arizona University - May 2020" carries both
 * halves on one line. Without this the institution keyword wins and the degree
 * is dropped entirely. */
function eduParts(t) {
    const parts = t.split(EDU_SPLIT).map(s => s.trim()).filter(Boolean);
    if (parts.length < 2) return null;
    const deg = parts.find(x => DEG_TOK.test(x) && !EDU_TOK.test(x)) || '';
    const edu = parts.find(x => EDU_TOK.test(x)) || '';
    return (deg && edu) ? { degree: deg, institution: edu } : null;
}

function parseEdu(lines) {
    const ents = [];
    const blank = () => ({ institution: '', degree: '', date: '', details: [] });
    let cur = blank();
    lines.forEach(ln => {
        const t = clean(stripBullet(ln.text));
        if (!t) return;
        const g = /GPA[:\s]*([0-4]\.\d+)/i.exec(t);
        const d = takeDates(t);
        const rest = clean(d[2]);

        const both = eduParts(t);
        if (both) {
            if (cur.institution || cur.degree) { ents.push(cur); cur = blank(); }
            cur.degree = clean(takeDates(both.degree)[2].replace(GPA_RE, ''));
            cur.institution = clean(takeDates(both.institution)[2].replace(GPA_RE, ''));
            if (d[0]) cur.date = (d[0] + (d[1] ? ' - ' + d[1] : '')).trim();
            if (g) cur.details.push('GPA: ' + g[1]);
            return;
        }

        const slot = EDU_TOK.test(t) ? 'institution' : (DEG_TOK.test(t) ? 'degree' : null);
        if (!slot) {
            if (cur.institution || cur.degree) {
                if (g) cur.details.push('GPA: ' + g[1]);
                else if (t.length > 4) cur.details.push(t);
            }
            return;
        }
        if (cur[slot]) { ents.push(cur); cur = blank(); }
        cur[slot] = clean(rest.replace(/\(?\s*GPA[:\s]*[0-4]\.\d+\s*\)?/i, '')) || rest;
        if (d[0] && !cur.date) cur.date = (d[0] + (d[1] ? ' - ' + d[1] : '')).trim();
        if (g && cur.details.indexOf('GPA: ' + g[1]) === -1) cur.details.push('GPA: ' + g[1]);
    });
    if (cur.institution || cur.degree) ents.push(cur);
    return ents;
}

const HOURS_RE = /^([A-Za-z][A-Za-z ()/&.'-]{1,38}?)[\s.:]*?([\d,]+(?:\.\d+)?)\s*$/;

function parseHours(lines) {
    const out = [];
    lines.forEach(ln => {
        const m = HOURS_RE.exec(clean(stripBullet(ln.text)));
        if (m) {
            const lab = clean(m[1]);
            if (lab && !DEG_TOK.test(lab)) out.push({ label: lab, value: m[2] });
        }
    });
    return out;
}

function parseSkills(lines) {
    const groups = [], flat = [];
    lines.forEach(ln => {
        const t = clean(stripBullet(ln.text));
        if (!t) return;
        const m = /^([A-Za-z][A-Za-z /&+.'-]{2,40}?)\s*:\s*(.+)$/.exec(t);
        if (m) {
            const items = m[2].split(/[,;\u2022|]/).map(clean).filter(Boolean);
            if (items.length) { groups.push({ category: clean(m[1]), items: items }); return; }
        }
        t.split(/[,;\u2022|]/).map(clean).filter(s => s.length > 1 && s.length < 60).forEach(s => flat.push(s));
    });
    if (flat.length) groups.push({ category: '', items: flat });
    return groups;
}

function parseList(lines, lo) {
    const out = [];
    lines.forEach(ln => {
        ln.text.split(/\u2022/).forEach(piece => {
            const t = clean(stripBullet(piece));
            if (t.length >= (lo || 4) && t.length <= 200) out.push(t);
        });
    });
    return out;
}

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]{2,}/;
const PHONE_RE = /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
const LINK_RE = /(?:linkedin\.com\/in\/|github\.com\/)[\w-]+/i;
const ADDR_RE = /[A-Z][a-zA-Z.' ]+,?\s*[A-Z]{2},?\s*\d{5}(?:-\d{4})?/;
const NAME_RE = /^[A-Z][A-Za-z'.-]+(?:\s+[A-Z][A-Za-z'.-]+){1,3}(?:,?\s+(?:Jr|Sr|II|III|IV)\.?)?$/;

function parseContact(lines) {
    const d = { fullName: '', address: '', phone: '', email: '', links: '' };
    const blob = lines.map(l => l.text).join('\n');
    [['email', EMAIL_RE], ['phone', PHONE_RE], ['links', LINK_RE], ['address', ADDR_RE]].forEach(p => {
        const m = p[1].exec(blob);
        if (m) d[p[0]] = m[0].trim();
    });
    for (const l of lines) {
        const t = l.text.trim();
        if (EMAIL_RE.test(t) || PHONE_RE.test(t) || LINK_RE.test(t)) continue;
        if (NAME_RE.test(t) && t.length < 40) { d.fullName = t; break; }
        if (t === t.toUpperCase() && /^[A-Z ]+$/.test(t) && t.split(/\s+/).length > 1 && t.split(/\s+/).length <= 4) {
            d.fullName = t.replace(/\w\S*/g, w => w[0] + w.slice(1).toLowerCase());
            break;
        }
    }
    return d;
}

function parseResume(lines) {
    const split = splitSections(lines);
    const sec = split.sections;
    const hdr = lines.filter(l => l.hdr);
    const d = parseContact(hdr.length ? hdr.concat(split.pre) : (split.pre.length ? split.pre : lines.slice(0, 8)));

    d.summary = (sec.summary || []).map(l => clean(l.text)).join(' ').slice(0, 1200);
    if (!d.summary && hdr.length) {
        d.summary = hdr.filter(l => l.text.length > 90).map(l => clean(l.text)).join(' ').slice(0, 1200);
    }
    d.skills = parseSkills(sec.skills || []);
    d.experience = parseEntries(sec.experience || [], false);
    d.projects = parseEntries(sec.projects || [], true);
    d.volunteer = parseEntries(sec.volunteer || [], false);
    d.education = parseEdu(sec.education || []);
    d.training = parseEdu(sec.training || []);
    d.hours = parseHours(sec.hours || []);
    d.certificates = parseList(sec.certificates || [], 5);
    d.references = [];
    return d;
}

/* =======================================================================
 * Entry point
 * ===================================================================== */

async function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const status = document.getElementById('importStatus');
    document.getElementById('fileName').textContent = file.name;
    status.className = 'import-status loading';
    status.textContent = 'Reading ' + file.name + '\u2026';

    try {
        const buffer = await file.arrayBuffer();
        let lines;
        if (/\.pdf$/i.test(file.name)) lines = await linesFromPdf(buffer);
        else if (/\.docx$/i.test(file.name)) lines = await linesFromDocx(buffer);
        else throw new Error('Unsupported file type — please use PDF or DOCX.');

        const data = parseResume(lines);
        populateAll(data);
        bindSpellCheck();
        generateResume();
        persist();

        const found = ['experience', 'education', 'training', 'volunteer', 'projects']
            .reduce((n, k) => n + (data[k] ? data[k].length : 0), 0);
        status.className = 'import-status success';
        status.textContent = 'Imported ' + found + ' entries, ' + data.certificates.length +
            ' certificates and ' + data.hours.length + ' hour rows. Check every field before exporting.';
    } catch (err) {
        console.error(err);
        status.className = 'import-status error';
        status.textContent = 'Could not import: ' + err.message;
    } finally {
        event.target.value = '';
    }
}
