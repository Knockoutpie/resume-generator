/* Section registry — the single source of truth.
 *
 * Every section is described once, here. The form builder, the data gatherer,
 * the preview renderer and the PDF exporter all read from this file, so adding
 * or changing a section means editing one entry instead of four code paths.
 */

/* Field types:
 *   prose   -> a string            (Professional Summary)
 *   skills  -> [{category, items}] (grouped skill lists)
 *   list    -> [string]            (Certificates and Ratings)
 *   pairs   -> [{label, value}]    (Flight Hours)
 *   entries -> [{company, title, startDate, endDate, bullets}]
 *   edu     -> [{institution, degree, date, details}]
 *   refs    -> [{name, title, company, phone, email}]
 */
const TYPES = {
    prose: {
        empty: () => '',
        placeholder: 'Two or three sentences on who you are and what you are aiming at.'
    },
    skills: {
        empty: () => ({ category: '', items: '' }),
        addLabel: '+ Add Skill Group',
        removeLabel: 'Remove Group',
        fields: [
            { key: 'category', label: 'Category (optional)', placeholder: 'Programming & Scripting' },
            { key: 'items', label: 'Skills (comma separated)', placeholder: 'Python, SQL, VBA, PowerShell' }
        ]
    },
    list: {
        empty: () => '',
        addLabel: '+ Add Item',
        placeholder: 'Commercial Certificate with Instrument Rating'
    },
    pairs: {
        empty: () => ({ label: '', value: '' }),
        addLabel: '+ Add Row',
        removeLabel: 'Remove',
        fields: [
            { key: 'label', label: 'Label', placeholder: 'Total Hours' },
            { key: 'value', label: 'Value', placeholder: '0' }
        ]
    },
    entries: {
        empty: () => ({ company: '', title: '', startDate: '', endDate: '', bullets: [''] }),
        addLabel: '+ Add Entry',
        removeLabel: 'Remove Entry',
        bullets: { key: 'bullets', label: 'Details', placeholder: 'Start with an action verb: Developed, Led, Reduced…' },
        fields: [
            { key: 'company', label: 'Organization', placeholder: 'Company or organization name' },
            { key: 'title', label: 'Role / Title', placeholder: 'Your role' },
            { key: 'startDate', label: 'Start Date', placeholder: 'Month Year', half: true },
            { key: 'endDate', label: 'End Date', placeholder: 'Present', half: true }
        ]
    },
    edu: {
        empty: () => ({ institution: '', degree: '', date: '', details: [] }),
        addLabel: '+ Add Entry',
        removeLabel: 'Remove Entry',
        details: { key: 'details', label: 'Additional Details (one per line)', placeholder: 'Minor, honors, GPA, coursework' },
        fields: [
            { key: 'institution', label: 'Institution', placeholder: 'University or school name' },
            { key: 'degree', label: 'Degree / Program', placeholder: 'Degree and major' },
            { key: 'date', label: 'Date', placeholder: 'Month Year' }
        ]
    },
    refs: {
        empty: () => ({ name: '', title: '', company: '', phone: '', email: '' }),
        addLabel: '+ Add Reference',
        removeLabel: 'Remove Reference',
        fields: [
            { key: 'name', label: 'Name', placeholder: 'Reference full name' },
            { key: 'title', label: 'Title / Relationship', placeholder: 'Chief Pilot, Former Supervisor…' },
            { key: 'company', label: 'Company / Organization', placeholder: 'Company name' },
            { key: 'phone', label: 'Phone', placeholder: '(555) 555-5555', half: true },
            { key: 'email', label: 'Email', placeholder: 'reference@email.com', half: true }
        ]
    }
};

/* `on` is the default for a brand-new form. Aviation sections are on by default
 * because that is this tool's primary audience; every one of them can be turned
 * off in the Sections panel, which is what makes the app usable for any resume. */
const SECTIONS = [
    { id: 'summary', title: 'Professional Summary', type: 'prose', on: false },
    { id: 'skills', title: 'Skills', type: 'skills', on: false },
    { id: 'certificates', title: 'Certificates and Ratings', type: 'list', on: true },
    { id: 'hours', title: 'Flight Hours', type: 'pairs', on: true, seed: [
        'Total Hours', 'Multi Engine', 'Pilot in Command',
        'Instrument (Simulated & Actual)', 'Cross Country', 'Night'
    ] },
    { id: 'experience', title: 'Work Experience', type: 'entries', on: true },
    { id: 'projects', title: 'Projects', type: 'entries', on: false },
    { id: 'education', title: 'Education', type: 'edu', on: true },
    { id: 'training', title: 'Aviation Training & Education', type: 'edu', on: true,
      labels: { institution: 'School / Training Provider', degree: 'Program / Course' } },
    { id: 'volunteer', title: 'Volunteer Experience & Community Involvement', type: 'entries', on: true },
    { id: 'references', title: 'References', type: 'refs', on: true,
      note: 'Leave blank to print "References available upon request".' }
];

const SECTION_BY_ID = SECTIONS.reduce((m, s) => (m[s.id] = s, m), {});
const DEFAULT_ORDER = SECTIONS.map(s => s.id);
const DEFAULT_TITLES = SECTIONS.reduce((m, s) => (m[s.id] = s.title, m), {});
const DEFAULT_ENABLED = SECTIONS.reduce((m, s) => (m[s.id] = s.on, m), {});

/* Field list for a section, with any per-section label overrides applied. */
function fieldsFor(section) {
    const base = TYPES[section.type].fields || [];
    if (!section.labels) return base;
    return base.map(f => section.labels[f.key] ? { ...f, label: section.labels[f.key] } : f);
}
