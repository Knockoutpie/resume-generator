/* Preview and PDF rendering.
 *
 * Both walk the same ordered section list and switch on section *type*, so a new
 * section needs no changes here beyond its registry entry.
 *
 * The PDF is built to survive text extraction by an ATS or an LLM:
 *   - dot leaders are drawn as a dotted vector line, never as literal "." characters,
 *     so extraction yields "Total Hours" + "408" instead of "Total Hours......408"
 *   - the two-column block is opt-in, and falls back to one column if it would
 *     straddle a page break
 *   - every label and value is its own text run, in reading order
 */

function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text == null ? '' : String(text);
    return d.innerHTML;
}

const has = v => v && (typeof v === 'string' ? v.trim() : v.length);

function orderedSections(data) {
    return (data._order || DEFAULT_ORDER)
        .filter(id => SECTION_BY_ID[id] && data._enabled && data._enabled[id]);
}

function dateRange(a, b) {
    if (!a && !b) return '';
    return a && b ? a + ' – ' + b : (a || b);
}

/* ---------------- preview ---------------- */

function generateResume() {
    const data = gatherAll();
    const preview = document.getElementById('resume-preview');
    const twoCol = document.getElementById('twoColHours') && document.getElementById('twoColHours').checked;

    const contact = [data.address, data.phone, data.email, data.links].filter(Boolean).map(escapeHtml).join(' &nbsp;|&nbsp; ');
    let html = '<div class="resume-document"><div class="resume-header">' +
        '<div class="resume-name">' + escapeHtml(data.fullName || 'Your Name') + '</div>' +
        (contact ? '<div class="resume-contact">' + contact + '</div>' : '') + '</div>';

    const ids = orderedSections(data);
    const skipped = {};
    if (twoCol && ids.indexOf('certificates') !== -1 && ids.indexOf('hours') !== -1 &&
        has(data.certificates) && has(data.hours)) {
        skipped.hours = true;   // rendered alongside certificates instead
    }

    ids.forEach(id => {
        if (skipped[id]) return;
        const sec = SECTION_BY_ID[id];
        const title = escapeHtml((data._titles && data._titles[id]) || sec.title);
        const v = data[id];

        if (id === 'certificates' && skipped.hours) {
            html += '<div class="resume-section"><div class="two-col">' +
                '<div><h4>' + title + '</h4><hr><ul class="cert-list">' +
                v.map(c => '<li>' + escapeHtml(c) + '</li>').join('') + '</ul></div>' +
                '<div><h4>' + escapeHtml((data._titles && data._titles.hours) || SECTION_BY_ID.hours.title) + '</h4><hr>' +
                '<div class="hours-list">' + data.hours.map(h =>
                    '<div class="hours-item"><span>' + escapeHtml(h.label) + '</span>' +
                    '<span class="leader"></span><span>' + escapeHtml(h.value) + '</span></div>').join('') +
                '</div></div></div></div>';
            return;
        }

        if (id === 'references' && !has(v)) {
            html += '<div class="resume-section refs-note">References available upon request</div>';
            return;
        }
        if (!has(v)) return;

        html += '<div class="resume-section"><div class="resume-section-title">' + title + '</div>';
        switch (sec.type) {
            case 'prose':
                html += '<p class="resume-prose">' + escapeHtml(v) + '</p>';
                break;
            case 'skills':
                html += '<ul class="skill-list">' + v.map(g =>
                    '<li>' + (g.category ? '<strong>' + escapeHtml(g.category) + ':</strong> ' : '') +
                    escapeHtml(g.items.join(', ')) + '</li>').join('') + '</ul>';
                break;
            case 'list':
                html += '<ul class="cert-list">' + v.map(c => '<li>' + escapeHtml(c) + '</li>').join('') + '</ul>';
                break;
            case 'pairs':
                html += '<div class="hours-list">' + v.map(h =>
                    '<div class="hours-item"><span>' + escapeHtml(h.label) + '</span>' +
                    '<span class="leader"></span><span>' + escapeHtml(h.value) + '</span></div>').join('') + '</div>';
                break;
            case 'entries':
                html += v.map(e =>
                    '<div class="job-entry"><div class="job-header">' +
                    '<span class="strong">' + escapeHtml(e.company) + '</span>' +
                    '<span class="dates">' + escapeHtml(dateRange(e.startDate, e.endDate)) + '</span></div>' +
                    (e.title ? '<div class="job-title-display">' + escapeHtml(e.title) + '</div>' : '') +
                    (e.bullets.length ? '<ul class="bullet-list">' + e.bullets.map(b => '<li>' + escapeHtml(b) + '</li>').join('') + '</ul>' : '') +
                    '</div>').join('');
                break;
            case 'edu':
                html += v.map(e =>
                    '<div class="job-entry"><div class="job-header">' +
                    '<span class="strong">' + escapeHtml(e.institution) + '</span>' +
                    '<span class="dates">' + escapeHtml(e.date) + '</span></div>' +
                    (e.degree ? '<div class="job-title-display">' + escapeHtml(e.degree) + '</div>' : '') +
                    (e.details.length ? '<ul class="bullet-list">' + e.details.map(d => '<li>' + escapeHtml(d) + '</li>').join('') + '</ul>' : '') +
                    '</div>').join('');
                break;
            case 'refs':
                html += v.map(r =>
                    '<div class="job-entry"><span class="strong">' + escapeHtml(r.name) + '</span>' +
                    (r.title ? ' — ' + escapeHtml(r.title) : '') +
                    (r.company ? ', ' + escapeHtml(r.company) : '') +
                    ([r.phone && 'Phone: ' + r.phone, r.email && 'Email: ' + r.email].filter(Boolean).length
                        ? '<div class="ref-contact">' + [r.phone && 'Phone: ' + escapeHtml(r.phone), r.email && 'Email: ' + escapeHtml(r.email)].filter(Boolean).join(' &nbsp;|&nbsp; ') + '</div>'
                        : '') + '</div>').join('');
                break;
        }
        html += '</div>';
    });

    preview.innerHTML = html + '</div>';
}

/* ---------------- PDF ---------------- */

function exportPDF() {
    const data = gatherAll();
    if (!data.fullName) {
        alert('Add your name before exporting.');
        return;
    }
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'letter' });
        doc.setProperties({
            title: data.fullName + ' - Resume', subject: 'Resume',
            author: data.fullName, creator: 'Resume Generator'
        });
        if (doc.setLanguage) doc.setLanguage('en-US');

        const PW = 612, PH = 792, M = 46;
        const CW = PW - M * 2;
        let y = M;

        const room = n => { if (y + n > PH - M) { doc.addPage(); y = M; return true; } return false; };
        const wrap = (t, w) => doc.splitTextToSize(String(t == null ? '' : t), w);
        const font = (style, size) => { doc.setFont('times', style); doc.setFontSize(size); };

        function bullets(list, x, w) {
            font('normal', 9.5);
            list.forEach(b => {
                wrap(b, w - 12).forEach((line, i) => {
                    room(12);
                    if (i === 0) doc.text('•', x, y);
                    doc.text(line, x + 11, y);
                    y += 11.5;
                });
            });
        }

        function sectionHeader(title) {
            room(34);
            font('bold', 12);
            doc.text(String(title).toUpperCase(), M, y);
            y += 3.5;
            doc.setLineWidth(0.8);
            doc.setLineDashPattern([], 0);
            doc.line(M, y, PW - M, y);
            y += 13;
        }

        /* label ....... value, where the leader is a VECTOR line.
         * Nothing but the label and the value ever enters the text layer. */
        function leaderRow(label, value, x, w) {
            room(13);
            font('normal', 9.5);
            const lw = doc.getTextWidth(label), vw = doc.getTextWidth(value);
            doc.text(label, x, y);
            doc.text(value, x + w, y, { align: 'right' });
            const from = x + lw + 4, to = x + w - vw - 4;
            if (to > from) {
                doc.setLineWidth(0.5);
                doc.setLineDashPattern([0.6, 2.2], 0);
                doc.line(from, y - 2.5, to, y - 2.5);
                doc.setLineDashPattern([], 0);
            }
            y += 12.5;
        }

        function headed(left, right, w) {
            room(30);
            font('bold', 10.5);
            doc.text(left || '', M, y);
            if (right) { font('normal', 9.5); doc.text(right, M + (w || CW), y, { align: 'right' }); }
            y += 12.5;
        }

        // header
        font('bold', 21);
        doc.text(data.fullName, PW / 2, y, { align: 'center' });
        y += 18;
        const contact = [data.address, data.phone, data.email, data.links].filter(Boolean);
        if (contact.length) {
            font('normal', 9.5);
            wrap(contact.join('   |   '), CW).forEach(l => { doc.text(l, PW / 2, y, { align: 'center' }); y += 11; });
        }
        y += 8;

        const ids = orderedSections(data);
        const twoColOpt = document.getElementById('twoColHours') && document.getElementById('twoColHours').checked;
        const title = id => (data._titles && data._titles[id]) || SECTION_BY_ID[id].title;

        // Decide up front whether the compact two-column block fits on this page.
        let pairTwoCol = false;
        if (twoColOpt && ids.indexOf('certificates') !== -1 && ids.indexOf('hours') !== -1 &&
            has(data.certificates) && has(data.hours)) {
            const colW = CW / 2 - 12;
            font('normal', 9.5);
            let hL = 0;
            data.certificates.forEach(c => { hL += wrap(c, colW - 12).length * 11.5; });
            const hR = data.hours.length * 12.5;
            pairTwoCol = (y + 26 + Math.max(hL, hR) <= PH - M);   // no page straddle
        }

        ids.forEach(id => {
            if (pairTwoCol && id === 'hours') return;
            const sec = SECTION_BY_ID[id];
            const v = data[id];

            if (pairTwoCol && id === 'certificates') {
                const colW = CW / 2 - 12;
                const rx = M + colW + 24;
                const top = y;
                font('bold', 11);
                doc.text(title('certificates').toUpperCase(), M, y);
                doc.text(title('hours').toUpperCase(), rx, y);
                y += 3.5;
                doc.setLineWidth(0.6);
                doc.setLineDashPattern([], 0);
                doc.line(M, y, M + colW, y);
                doc.line(rx, y, rx + colW, y);
                y += 12;
                const afterHead = y;
                bullets(data.certificates, M + 2, colW);
                const leftEnd = y;
                y = afterHead;
                data.hours.forEach(h => leaderRow(h.label, h.value, rx, colW));
                y = Math.max(y, leftEnd) + 10;
                return;
            }

            if (id === 'references' && !has(v)) {
                room(24);
                y += 4;
                font('italic', 10);
                doc.text('References available upon request', PW / 2, y, { align: 'center' });
                y += 12;
                return;
            }
            if (!has(v)) return;

            sectionHeader(title(id));
            switch (sec.type) {
                case 'prose':
                    font('normal', 9.5);
                    wrap(v, CW).forEach(l => { room(12); doc.text(l, M, y); y += 11.5; });
                    y += 4;
                    break;
                case 'skills':
                    v.forEach(g => {
                        const items = g.items.join(', ');
                        if (g.category) {
                            font('bold', 9.5);
                            const label = g.category + ': ';
                            const lw = doc.getTextWidth(label);   // measured in the font it is drawn in
                            room(12);
                            doc.text(label, M, y);
                            font('normal', 9.5);
                            wrap(items, CW - lw).forEach((l, i) => {
                                if (i) room(12);
                                doc.text(l, i === 0 ? M + lw : M, y);
                                y += 11.5;
                            });
                        } else {
                            font('normal', 9.5);
                            wrap(items, CW).forEach(l => { room(12); doc.text(l, M, y); y += 11.5; });
                        }
                    });
                    y += 4;
                    break;
                case 'list':
                    bullets(v, M + 2, CW);
                    y += 4;
                    break;
                case 'pairs':
                    v.forEach(h => leaderRow(h.label, h.value, M, CW / 2));
                    y += 4;
                    break;
                case 'entries':
                    v.forEach(e => {
                        headed(e.company, dateRange(e.startDate, e.endDate));
                        if (e.title) { font('italic', 10); doc.text(e.title, M, y); y += 12; }
                        bullets(e.bullets, M + 8, CW - 8);
                        y += 6;
                    });
                    break;
                case 'edu':
                    v.forEach(e => {
                        headed(e.institution, e.date);
                        if (e.degree) { font('italic', 10); doc.text(e.degree, M, y); y += 12; }
                        bullets(e.details, M + 8, CW - 8);
                        y += 6;
                    });
                    break;
                case 'refs':
                    v.forEach(r => {
                        room(32);
                        font('bold', 10);
                        doc.text([r.name, r.title, r.company].filter(Boolean).join(' — '), M, y);
                        y += 12;
                        const c = [r.phone && 'Phone: ' + r.phone, r.email && 'Email: ' + r.email].filter(Boolean);
                        if (c.length) { font('normal', 9.5); doc.text(c.join('   |   '), M, y); y += 12; }
                        y += 3;
                    });
                    break;
            }
        });

        doc.save(data.fullName.replace(/\s+/g, '_') + '_Resume.pdf');
    } catch (err) {
        console.error(err);
        alert('Could not build the PDF: ' + err.message);
    }
}
