/* Form building, reading and repopulating — all driven by the section registry.
 *
 * The DOM is the source of truth while the user is typing (no re-render on
 * keystroke, so focus and undo behave normally). gatherAll() reads it out;
 * populateAll() rebuilds it from a data object.
 */

function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    for (const k in (attrs || {})) {
        if (k === 'class') n.className = attrs[k];
        else if (k === 'text') n.textContent = attrs[k];
        else if (k !== null && attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(c => c && n.appendChild(c));
    return n;
}

function field(f, value) {
    const group = el('div', { class: 'form-group' + (f.half ? ' half' : '') });
    group.appendChild(el('label', { text: f.label }));
    const input = el('input', {
        type: f.key === 'email' ? 'email' : (f.key === 'phone' ? 'tel' : 'text'),
        class: 'field', 'data-field': f.key, placeholder: f.placeholder || '', spellcheck: 'true'
    });
    input.value = value || '';
    group.appendChild(input);
    return group;
}

function bulletRow(text) {
    const row = el('div', { class: 'bullet-entry' }, [el('span', { class: 'bullet-icon', text: '•' })]);
    const input = el('input', { type: 'text', class: 'bullet-input', 'data-field': 'bullet', spellcheck: 'true' });
    input.value = text || '';
    row.appendChild(input);
    row.appendChild(el('button', { class: 'remove-bullet-btn', type: 'button', 'data-action': 'remove-bullet', title: 'Remove', text: '×' }));
    return row;
}

/* One repeatable entry (a job, a degree, a reference, a skill group…). */
function renderEntry(sec, item) {
    const t = TYPES[sec.type];
    const entry = el('div', { class: 'entry' });

    if (sec.type === 'list') {
        const input = el('input', { type: 'text', class: 'field', 'data-field': 'item', placeholder: t.placeholder, spellcheck: 'true' });
        input.value = item || '';
        entry.classList.add('inline-entry');
        entry.appendChild(input);
        entry.appendChild(el('button', { class: 'remove-btn', type: 'button', 'data-action': 'remove-entry', title: 'Remove', text: '×' }));
        return entry;
    }

    if (sec.type === 'pairs') {
        entry.classList.add('inline-entry');
        t.fields.forEach(f => {
            const input = el('input', {
                type: 'text', class: 'field pair-' + f.key, 'data-field': f.key,
                placeholder: f.placeholder, spellcheck: 'false'
            });
            input.value = (item && item[f.key]) || '';
            entry.appendChild(input);
        });
        entry.appendChild(el('button', { class: 'remove-btn', type: 'button', 'data-action': 'remove-entry', title: 'Remove', text: '×' }));
        return entry;
    }

    const fields = fieldsFor(sec);
    let row = null;
    fields.forEach(f => {
        const g = field(f, item ? item[f.key] : '');
        if (f.half) {
            if (!row) { row = el('div', { class: 'form-row' }); entry.appendChild(row); }
            row.appendChild(g);
        } else {
            row = null;
            entry.appendChild(g);
        }
    });

    if (t.bullets) {
        const g = el('div', { class: 'form-group' }, [el('label', { text: t.bullets.label })]);
        const box = el('div', { class: 'bullets' });
        const list = (item && item.bullets && item.bullets.length) ? item.bullets : [''];
        list.forEach(b => box.appendChild(bulletRow(b)));
        g.appendChild(box);
        g.appendChild(el('button', { class: 'add-bullet-btn', type: 'button', 'data-action': 'add-bullet', text: '+ Add Bullet Point' }));
        entry.appendChild(g);
    }

    if (t.details) {
        const g = el('div', { class: 'form-group' }, [el('label', { text: t.details.label })]);
        const ta = el('textarea', { class: 'field', 'data-field': 'details', rows: '3', placeholder: t.details.placeholder, spellcheck: 'true' });
        ta.value = (item && item.details || []).join('\n');
        g.appendChild(ta);
        entry.appendChild(g);
    }

    entry.appendChild(el('button', { class: 'remove-btn remove-section', type: 'button', 'data-action': 'remove-entry', text: t.removeLabel || 'Remove' }));
    return entry;
}

function renderSection(sec, value, title) {
    const t = TYPES[sec.type];
    const node = el('section', { class: 'form-section draggable-section', 'data-section-id': sec.id, draggable: 'true' });

    const head = el('div', { class: 'section-header' }, [
        el('span', { class: 'drag-handle', title: 'Drag to reorder', text: '☰' })
    ]);
    const h2 = el('h2', { class: 'section-title', contenteditable: 'true', spellcheck: 'false', text: title || sec.title });
    head.appendChild(h2);
    head.appendChild(el('div', { class: 'section-arrows' }, [
        el('button', { class: 'arrow-btn', type: 'button', 'data-action': 'move-up', title: 'Move up', text: '▲' }),
        el('button', { class: 'arrow-btn', type: 'button', 'data-action': 'move-down', title: 'Move down', text: '▼' }),
        el('button', { class: 'arrow-btn off-btn', type: 'button', 'data-action': 'disable-section', title: 'Remove this section', text: '×' })
    ]));
    node.appendChild(head);

    if (sec.note) node.appendChild(el('p', { class: 'section-note', text: sec.note }));

    if (sec.type === 'prose') {
        const ta = el('textarea', { class: 'field', 'data-field': 'prose', rows: '4', placeholder: t.placeholder, spellcheck: 'true' });
        ta.value = value || '';
        node.appendChild(ta);
        return node;
    }

    const box = el('div', { class: 'entries' });
    let items = Array.isArray(value) ? value.slice() : [];
    if (!items.length) {
        if (sec.seed) items = sec.seed.map(l => ({ label: l, value: '' }));
        else items = [t.empty()];
    }
    if (sec.type === 'skills') {
        items = items.map(g => typeof g === 'string' ? { category: '', items: g }
            : { category: g.category || '', items: Array.isArray(g.items) ? g.items.join(', ') : (g.items || '') });
    }
    items.forEach(it => box.appendChild(renderEntry(sec, it)));
    node.appendChild(box);
    node.appendChild(el('button', { class: 'add-btn', type: 'button', 'data-action': 'add-entry', text: t.addLabel || '+ Add' }));
    return node;
}

/* ---------- reading the form back out ---------- */

function val(scope, name) {
    const n = scope.querySelector('[data-field="' + name + '"]');
    return n ? n.value.trim() : '';
}

function gatherSection(node, sec) {
    if (sec.type === 'prose') return val(node, 'prose');
    const entries = Array.from(node.querySelectorAll('.entry'));

    if (sec.type === 'list') {
        return entries.map(e => val(e, 'item')).filter(Boolean);
    }
    if (sec.type === 'pairs') {
        return entries.map(e => ({ label: val(e, 'label'), value: val(e, 'value') }))
            .filter(h => h.label && h.value);
    }
    if (sec.type === 'skills') {
        return entries.map(e => ({
            category: val(e, 'category'),
            items: val(e, 'items').split(',').map(s => s.trim()).filter(Boolean)
        })).filter(g => g.items.length);
    }

    const fields = fieldsFor(sec);
    const t = TYPES[sec.type];
    return entries.map(e => {
        const o = {};
        fields.forEach(f => { o[f.key] = val(e, f.key); });
        if (t.bullets) {
            o.bullets = Array.from(e.querySelectorAll('[data-field="bullet"]'))
                .map(i => i.value.trim()).filter(Boolean);
        }
        if (t.details) {
            o.details = val(e, 'details').split('\n').map(s => s.trim()).filter(Boolean);
        }
        return o;
    }).filter(o => fields.some(f => o[f.key]));
}

function gatherAll() {
    const data = {
        fullName: document.getElementById('fullName').value.trim(),
        address: document.getElementById('address').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        links: document.getElementById('links').value.trim()
    };
    document.querySelectorAll('.draggable-section').forEach(node => {
        const sec = SECTION_BY_ID[node.dataset.sectionId];
        if (sec) data[sec.id] = gatherSection(node, sec);
    });
    data._order = Array.from(document.querySelectorAll('.draggable-section')).map(n => n.dataset.sectionId);
    data._titles = {};
    document.querySelectorAll('.draggable-section').forEach(n => {
        const t = n.querySelector('.section-title');
        if (t) data._titles[n.dataset.sectionId] = t.textContent.trim();
    });
    data._enabled = {};
    SECTIONS.forEach(s => { data._enabled[s.id] = !!document.querySelector('[data-section-id="' + s.id + '"]'); });
    return data;
}

/* Rebuild the whole form from a data object. */
function populateAll(data) {
    data = data || {};
    ['fullName', 'address', 'phone', 'email', 'links'].forEach(k => {
        const n = document.getElementById(k);
        if (n) n.value = data[k] || '';
    });

    const titles = Object.assign({}, DEFAULT_TITLES, data._titles || {});
    const enabled = Object.assign({}, DEFAULT_ENABLED, data._enabled || {});
    let order = (data._order || DEFAULT_ORDER).filter(id => SECTION_BY_ID[id]);
    DEFAULT_ORDER.forEach(id => { if (order.indexOf(id) === -1) order.push(id); });

    // A section with imported content turns itself on, so nothing arrives invisible.
    order.forEach(id => {
        const v = data[id];
        if (v && (typeof v === 'string' ? v.trim() : v.length)) enabled[id] = true;
    });

    const host = document.getElementById('sections-host');
    host.textContent = '';
    order.forEach(id => {
        if (!enabled[id]) return;
        host.appendChild(renderSection(SECTION_BY_ID[id], data[id], titles[id]));
    });
    renderSectionToggles(enabled, titles);
}

function renderSectionToggles(enabled, titles) {
    const host = document.getElementById('section-toggles');
    if (!host) return;
    host.textContent = '';
    DEFAULT_ORDER.forEach(id => {
        const on = !!enabled[id];
        const b = el('button', {
            class: 'toggle-chip' + (on ? ' on' : ''), type: 'button',
            'data-action': 'toggle-section', 'data-target': id,
            text: (on ? '✓ ' : '+ ') + (titles[id] || DEFAULT_TITLES[id])
        });
        host.appendChild(b);
    });
}
