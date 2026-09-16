/* Wiring: storage, auto-save, events, reordering.
 *
 * Every control is handled by delegation from the form panel, so buttons keep
 * working after the form is rebuilt by an import or a section toggle. Nothing
 * here re-attaches listeners to individual inputs.
 */

const STORE_KEY = 'resumeData';

/* Writes state. Deliberately does NOT schedule another save — the old version
 * had persist and auto-save calling each other, which re-saved every 1.5s forever. */
function persist() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(gatherAll()));
    } catch (e) {
        console.warn('Could not save:', e);
    }
}

let saveTimer = null, previewTimer = null;

function triggerAutoSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        persist();
        const ind = document.getElementById('autoSaveIndicator');
        if (ind) {
            ind.classList.add('visible');
            setTimeout(() => ind.classList.remove('visible'), 1600);
        }
    }, 1200);
}

function schedulePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(generateResume, 350);
}

function loadSaved() {
    let data = null;
    try {
        const raw = localStorage.getItem(STORE_KEY);
        if (raw) data = JSON.parse(raw);
    } catch (e) {
        console.warn('Saved data was unreadable; starting fresh.', e);
    }
    populateAll(data || {});
    generateResume();
}

function saveFormData() {
    persist();
    const ind = document.getElementById('autoSaveIndicator');
    if (ind) {
        ind.classList.add('visible');
        setTimeout(() => ind.classList.remove('visible'), 1600);
    }
}

function exportFormJSON() {
    const data = gatherAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (data.fullName || 'resume').replace(/\s+/g, '_') + '_data.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function importFormJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            populateAll(JSON.parse(e.target.result));
            generateResume();
            persist();
        } catch (err) {
            alert('That file could not be read: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function clearAll() {
    if (!confirm('Clear the form and delete the saved copy in this browser? This cannot be undone.')) return;
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* private mode */ }
    populateAll({});
    generateResume();
}

/* ---------------- phone formatting ---------------- */

function formatPhoneNumber(input) {
    const d = input.value.replace(/\D/g, '').slice(0, 10);
    if (!d) { input.value = ''; return; }
    if (d.length < 4) input.value = '(' + d;
    else if (d.length < 7) input.value = '(' + d.slice(0, 3) + ') ' + d.slice(3);
    else input.value = '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
}

/* ---------------- reordering ---------------- */

function moveSection(node, dir) {
    const sib = dir < 0 ? node.previousElementSibling : node.nextElementSibling;
    if (!sib || !sib.classList.contains('draggable-section')) return;
    if (dir < 0) node.parentNode.insertBefore(node, sib);
    else node.parentNode.insertBefore(sib, node);
    persist();
    generateResume();
}

let dragged = null;

function initDragAndDrop(host) {
    host.addEventListener('dragstart', e => {
        const s = e.target.closest('.draggable-section');
        if (!s) return;
        dragged = s;
        s.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', s.dataset.sectionId); } catch (_) { }
    });
    host.addEventListener('dragend', () => {
        if (dragged) dragged.classList.remove('dragging');
        host.querySelectorAll('.drag-over').forEach(n => n.classList.remove('drag-over'));
        dragged = null;
        persist();
        generateResume();
    });
    host.addEventListener('dragover', e => {
        const s = e.target.closest('.draggable-section');
        if (!s || s === dragged) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        s.classList.add('drag-over');
    });
    host.addEventListener('dragleave', e => {
        const s = e.target.closest('.draggable-section');
        if (s) s.classList.remove('drag-over');
    });
    host.addEventListener('drop', e => {
        const s = e.target.closest('.draggable-section');
        if (!s || !dragged || s === dragged) return;
        e.preventDefault();
        s.classList.remove('drag-over');
        const all = Array.from(host.querySelectorAll('.draggable-section'));
        if (all.indexOf(dragged) < all.indexOf(s)) host.insertBefore(dragged, s.nextSibling);
        else host.insertBefore(dragged, s);
    });
}

/* ---------------- tabs ---------------- */

function showTab(name) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.toggle('active', t.id === name + '-tab'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
}

/* ---------------- init ---------------- */

document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('form-panel');
    const host = document.getElementById('sections-host');

    loadSaved();
    initDragAndDrop(host);

    panel.addEventListener('click', e => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        const section = btn.closest('.draggable-section');
        const sec = section && SECTION_BY_ID[section.dataset.sectionId];

        switch (action) {
            case 'add-entry': {
                const box = section.querySelector('.entries');
                const node = renderEntry(sec, TYPES[sec.type].empty());
                box.appendChild(node);
                const first = node.querySelector('input, textarea');
                if (first) first.focus();
                break;
            }
            case 'remove-entry': {
                const entry = btn.closest('.entry');
                const box = entry.parentNode;
                entry.remove();
                if (!box.querySelector('.entry')) box.appendChild(renderEntry(sec, TYPES[sec.type].empty()));
                break;
            }
            case 'add-bullet': {
                const box = btn.previousElementSibling;
                const row = bulletRow('');
                box.appendChild(row);
                row.querySelector('input').focus();
                break;
            }
            case 'remove-bullet': {
                const row = btn.closest('.bullet-entry');
                const box = row.parentNode;
                if (box.querySelectorAll('.bullet-entry').length > 1) row.remove();
                else row.querySelector('input').value = '';
                break;
            }
            case 'move-up': moveSection(section, -1); return;
            case 'move-down': moveSection(section, 1); return;
            case 'disable-section': {
                const data = gatherAll();
                data._enabled[section.dataset.sectionId] = false;
                populateAll(data);
                break;
            }
            case 'toggle-section': {
                const id = btn.dataset.target;
                const data = gatherAll();
                data._enabled[id] = !data._enabled[id];
                populateAll(data);
                break;
            }
            default: return;
        }
        persist();
        schedulePreview();
    });

    panel.addEventListener('input', e => {
        if (e.target.id === 'phone') formatPhoneNumber(e.target);
        triggerAutoSave();
        schedulePreview();
    });
    panel.addEventListener('change', () => { triggerAutoSave(); schedulePreview(); });

    // delegated, so it keeps working after any rebuild
    panel.addEventListener('focusout', e => {
        if (e.target.matches('.field, .bullet-input')) checkFieldSpelling(e.target);
        if (e.target.classList.contains('section-title')) { persist(); generateResume(); }
    });

    panel.addEventListener('keydown', e => {
        if (e.target.classList.contains('section-title') && e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
        if (e.target.classList.contains('bullet-input') && e.key === 'Enter') {
            e.preventDefault();
            const box = e.target.closest('.bullets');
            const row = bulletRow('');
            box.appendChild(row);
            row.querySelector('input').focus();
        }
    });

    document.querySelectorAll('.tab-btn').forEach(b => {
        b.addEventListener('click', () => showTab(b.dataset.tab));
    });
    const two = document.getElementById('twoColHours');
    if (two) two.addEventListener('change', () => { persist(); generateResume(); });
});

/* import.js calls this after rebuilding the form; delegation means there is
 * nothing to rebind, so this only refreshes the inline highlights. */
function bindSpellCheck() {
    document.querySelectorAll('.field, .bullet-input').forEach(checkFieldSpelling);
}
