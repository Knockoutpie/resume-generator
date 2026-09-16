/* Word (.docx) export.
 *
 * A .docx is a zip of XML parts. We write the zip ourselves with STORED (no
 * compression) entries — a resume is a few KB, so compressing it buys nothing
 * and avoids a dependency entirely.
 *
 * The layout follows the same rules as the PDF exporter, for the same reason:
 *   - contact details in the body, never a Word header (headers are invisible
 *     to most text extractors)
 *   - no layout tables, single column
 *   - hours use a right tab stop, never a run of dot characters
 * DOCX is structured XML rather than positioned glyphs, so it is generally the
 * more reliably parsed of the two formats.
 */

const TWIP = 1440;                 // twips per inch
const PAGE_W = 12240, PAGE_H = 15840;
const MARGIN = Math.round(0.6 * TWIP);
const CONTENT_W = PAGE_W - MARGIN * 2;
const FONT = 'Calibri';

/* ---------------- zip (stored entries) ---------------- */

let CRC_TABLE = null;
function crc32(bytes) {
    if (!CRC_TABLE) {
        CRC_TABLE = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            CRC_TABLE[n] = c >>> 0;
        }
    }
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
}

function zipStore(entries) {
    const enc = new TextEncoder();
    const parts = [], central = [];
    let offset = 0;

    entries.forEach(e => {
        const name = enc.encode(e.name);
        const data = enc.encode(e.data);
        const crc = crc32(data);

        const local = new Uint8Array(30 + name.length);
        const lv = new DataView(local.buffer);
        lv.setUint32(0, 0x04034b50, true);
        lv.setUint16(4, 20, true);          // version needed
        lv.setUint16(6, 0, true);           // flags
        lv.setUint16(8, 0, true);           // method 0 = stored
        lv.setUint16(10, 0, true);          // mod time
        lv.setUint16(12, 0x21, true);       // mod date (1980-01-01)
        lv.setUint32(14, crc, true);
        lv.setUint32(18, data.length, true);
        lv.setUint32(22, data.length, true);
        lv.setUint16(26, name.length, true);
        lv.setUint16(28, 0, true);
        local.set(name, 30);
        parts.push(local, data);

        const cd = new Uint8Array(46 + name.length);
        const cv = new DataView(cd.buffer);
        cv.setUint32(0, 0x02014b50, true);
        cv.setUint16(4, 20, true);
        cv.setUint16(6, 20, true);
        cv.setUint16(8, 0, true);
        cv.setUint16(10, 0, true);
        cv.setUint16(12, 0, true);
        cv.setUint16(14, 0x21, true);
        cv.setUint32(16, crc, true);
        cv.setUint32(20, data.length, true);
        cv.setUint32(24, data.length, true);
        cv.setUint16(28, name.length, true);
        cv.setUint32(42, offset, true);
        cd.set(name, 46);
        central.push(cd);

        offset += local.length + data.length;
    });

    const cdSize = central.reduce((n, c) => n + c.length, 0);
    const end = new Uint8Array(22);
    const ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, offset, true);

    return new Blob(parts.concat(central, [end]),
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

/* ---------------- OOXML building blocks ---------------- */

function xmlEsc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function run(text, o) {
    o = o || {};
    const rPr = '<w:rPr>' +
        '<w:rFonts w:ascii="' + FONT + '" w:hAnsi="' + FONT + '"/>' +
        (o.b ? '<w:b/>' : '') + (o.i ? '<w:i/>' : '') +
        (o.color ? '<w:color w:val="' + o.color + '"/>' : '') +
        '<w:sz w:val="' + Math.round((o.size || 10) * 2) + '"/>' +
        '</w:rPr>';
    return '<w:r>' + rPr + '<w:t xml:space="preserve">' + xmlEsc(text) + '</w:t></w:r>';
}

const tabRun = () => '<w:r><w:tab/></w:r>';

/* w:pPr children must appear in schema order: pBdr, tabs, spacing, ind, jc. */
function para(runs, o) {
    o = o || {};
    let pr = '';
    if (o.border) pr += '<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="1" w:color="000000"/></w:pBdr>';
    if (o.rightTab) pr += '<w:tabs><w:tab w:val="right" w:pos="' + o.rightTab + '"/></w:tabs>';
    pr += '<w:spacing w:before="' + (o.before || 0) + '" w:after="' + (o.after || 0) + '" w:line="240" w:lineRule="auto"/>';
    if (o.indent) pr += '<w:ind w:left="' + o.indent + '"' + (o.hanging ? ' w:hanging="' + o.hanging + '"' : '') + '/>';
    if (o.align) pr += '<w:jc w:val="' + o.align + '"/>';
    return '<w:p><w:pPr>' + pr + '</w:pPr>' + runs + '</w:p>';
}

/* ---------------- document body ---------------- */

function docxBody(data) {
    const out = [];
    const title = id => (data._titles && data._titles[id]) || SECTION_BY_ID[id].title;

    const heading = t => out.push(para(run(String(t).toUpperCase(), { b: true, size: 11 }),
        { border: true, before: 150, after: 60 }));

    const bullet = t => out.push(para(run('•  ' + t, { size: 10 }),
        { indent: 320, hanging: 180, after: 20 }));

    const roleLine = (left, right) => out.push(para(
        run(left || '', { b: true, size: 10.5 }) + (right ? tabRun() + run(right, { size: 9.5 }) : ''),
        { before: 90, rightTab: CONTENT_W }));

    const labelValue = (l, v) => out.push(para(
        run(l, { size: 10 }) + tabRun() + run(v, { b: true, size: 10 }),
        { rightTab: Math.round(2.6 * TWIP) }));

    // header block — in the body, deliberately
    out.push(para(run(data.fullName || 'Your Name', { b: true, size: 19 }), { align: 'center' }));
    const contact = [data.address, data.phone, data.email, data.links].filter(Boolean);
    if (contact.length) {
        out.push(para(run(contact.join('   ·   '), { size: 10 }), { align: 'center', after: 40 }));
    }

    orderedSections(data).forEach(id => {
        const sec = SECTION_BY_ID[id];
        const v = data[id];

        if (id === 'references' && !has(v)) {
            out.push(para(run('References available upon request', { i: true, size: 10 }),
                { align: 'center', before: 140 }));
            return;
        }
        if (!has(v)) return;

        heading(title(id));
        switch (sec.type) {
            case 'prose':
                out.push(para(run(v, { size: 10 })));
                break;
            case 'skills':
                v.forEach(g => out.push(para(
                    (g.category ? run(g.category + ': ', { b: true, size: 10 }) : '') +
                    run(g.items.join(', '), { size: 10 }), { after: 20 })));
                break;
            case 'list':
                v.forEach(bullet);
                break;
            case 'pairs':
                v.forEach(h => labelValue(h.label, h.value));
                break;
            case 'entries':
                v.forEach(e => {
                    roleLine(e.company, dateRange(e.startDate, e.endDate));
                    if (e.title) out.push(para(run(e.title, { i: true, size: 10 })));
                    e.bullets.forEach(bullet);
                });
                break;
            case 'edu':
                v.forEach(e => {
                    roleLine(e.institution, e.date);
                    if (e.degree) out.push(para(run(e.degree, { i: true, size: 10 })));
                    e.details.forEach(bullet);
                });
                break;
            case 'refs':
                v.forEach(r => {
                    out.push(para(run([r.name, r.title, r.company].filter(Boolean).join(' — '),
                        { b: true, size: 10 }), { before: 80 }));
                    const c = [r.phone && 'Phone: ' + r.phone, r.email && 'Email: ' + r.email].filter(Boolean);
                    if (c.length) out.push(para(run(c.join('   |   '), { size: 10 })));
                });
                break;
        }
    });

    out.push('<w:sectPr><w:pgSz w:w="' + PAGE_W + '" w:h="' + PAGE_H + '"/>' +
        '<w:pgMar w:top="' + MARGIN + '" w:right="' + MARGIN + '" w:bottom="' + MARGIN +
        '" w:left="' + MARGIN + '" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr>');
    return out.join('');
}

const W_MAIN = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

function docxParts(data) {
    const document = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<w:document xmlns:w="' + W_MAIN + '"><w:body>' + docxBody(data) + '</w:body></w:document>';

    const styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<w:styles xmlns:w="' + W_MAIN + '"><w:docDefaults><w:rPrDefault><w:rPr>' +
        '<w:rFonts w:ascii="' + FONT + '" w:hAnsi="' + FONT + '"/><w:sz w:val="20"/>' +
        '</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr>' +
        '<w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>' +
        '</w:pPr></w:pPrDefault></w:docDefaults></w:styles>';

    const contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
        '</Types>';

    const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
        '</Relationships>';

    const docRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
        '</Relationships>';

    const core = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ' +
        'xmlns:dc="http://purl.org/dc/elements/1.1/">' +
        '<dc:title>' + xmlEsc((data.fullName || 'Resume') + ' - Resume') + '</dc:title>' +
        '<dc:creator>' + xmlEsc(data.fullName || '') + '</dc:creator>' +
        '</cp:coreProperties>';

    return [
        { name: '[Content_Types].xml', data: contentTypes },
        { name: '_rels/.rels', data: rels },
        { name: 'docProps/core.xml', data: core },
        { name: 'word/_rels/document.xml.rels', data: docRels },
        { name: 'word/styles.xml', data: styles },
        { name: 'word/document.xml', data: document }
    ];
}

function exportDOCX() {
    const data = gatherAll();
    if (!data.fullName) {
        alert('Add your name before exporting.');
        return;
    }
    try {
        const blob = zipStore(docxParts(data));
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.fullName.replace(/\s+/g, '_') + '_Resume.docx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
        alert('Could not build the Word file: ' + err.message);
    }
}
