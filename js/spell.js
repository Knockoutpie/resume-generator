/* Spelling and wording checks. Dictionaries carried over from the original build. */

const commonMisspellings = {
    'recieve': 'receive',
    'occured': 'occurred',
    'occurence': 'occurrence',
    'seperate': 'separate',
    'definately': 'definitely',
    'accomodate': 'accommodate',
    'acheive': 'achieve',
    'agressive': 'aggressive',
    'apparant': 'apparent',
    'calender': 'calendar',
    'collegue': 'colleague',
    'commited': 'committed',
    'concensus': 'consensus',
    'consistant': 'consistent',
    'embarass': 'embarrass',
    'enviroment': 'environment',
    'experiance': 'experience',
    'goverment': 'government',
    'grammer': 'grammar',
    'harrass': 'harass',
    'immediatly': 'immediately',
    'independant': 'independent',
    'liason': 'liaison',
    'maintainance': 'maintenance',
    'managment': 'management',
    'millenium': 'millennium',
    'neccessary': 'necessary',
    'noticable': 'noticeable',
    'occassion': 'occasion',
    'paralel': 'parallel',
    'persue': 'pursue',
    'posession': 'possession',
    'prefered': 'preferred',
    'privelege': 'privilege',
    'profesional': 'professional',
    'publically': 'publicly',
    'recomend': 'recommend',
    'refered': 'referred',
    'relevent': 'relevant',
    'responsiblity': 'responsibility',
    'succesful': 'successful',
    'supercede': 'supersede',
    'tommorow': 'tomorrow',
    'transfered': 'transferred',
    'untill': 'until',
    'wierd': 'weird',
    'writting': 'writing',
    'analisis': 'analysis',
    'analize': 'analyze',
    'beleive': 'believe',
    'buisness': 'business',
    'catagory': 'category',
    'comunicate': 'communicate',
    'develope': 'develop',
    'diferent': 'different',
    'efective': 'effective',
    'excercise': 'exercise',
    'finacial': 'financial',
    'foriegn': 'foreign',
    'garantee': 'guarantee',
    'hieght': 'height',
    'knowlege': 'knowledge',
    'liscense': 'license',
    'mispell': 'misspell',
    'necesary': 'necessary',
    'oportunity': 'opportunity',
    'performace': 'performance',
    'personel': 'personnel',
    'priviledge': 'privilege',
    'proceedure': 'procedure',
    'restaraunt': 'restaurant',
    'shedule': 'schedule',
    'similer': 'similar',
    'sincerly': 'sincerely',
    'specificly': 'specifically',
    'strenght': 'strength',
    'technicaly': 'technically',
    'therefor': 'therefore',
    'thier': 'their',
    'truely': 'truly',
    'usualy': 'usually',
    'vaccum': 'vacuum',
    'vegatables': 'vegetables',
    'wether': 'whether'
};

const wordImprovements = {
    'helped': ['assisted', 'supported', 'contributed to', 'facilitated'],
    'worked': ['collaborated', 'partnered', 'executed', 'delivered'],
    'did': ['accomplished', 'achieved', 'completed', 'executed'],
    'made': ['created', 'developed', 'produced', 'established'],
    'got': ['obtained', 'acquired', 'secured', 'achieved'],
    'used': ['utilized', 'leveraged', 'employed', 'applied'],
    'good': ['excellent', 'outstanding', 'exceptional', 'superior'],
    'big': ['significant', 'substantial', 'major', 'considerable'],
    'many': ['numerous', 'multiple', 'extensive', 'various'],
    'very': ['highly', 'exceptionally', 'remarkably', 'extremely'],
    'nice': ['pleasant', 'effective', 'beneficial', 'valuable'],
    'bad': ['poor', 'inadequate', 'substandard', 'deficient'],
    'things': ['tasks', 'responsibilities', 'objectives', 'deliverables'],
    'stuff': ['materials', 'resources', 'components', 'elements'],
    'hard': ['challenging', 'demanding', 'rigorous', 'intensive'],
    'easy': ['straightforward', 'efficient', 'streamlined', 'seamless'],
    'fast': ['rapid', 'swift', 'efficient', 'accelerated'],
    'slow': ['gradual', 'measured', 'deliberate', 'methodical'],
    'team': ['cross-functional team', 'collaborative team', 'department'],
    'responsible for': ['led', 'managed', 'oversaw', 'spearheaded'],
    'in charge of': ['directed', 'supervised', 'administered', 'orchestrated'],
    'duties included': ['key accomplishments include', 'delivered results such as'],
    'worked on': ['developed', 'implemented', 'executed', 'delivered'],
    'dealt with': ['managed', 'resolved', 'addressed', 'handled'],
    'looked at': ['analyzed', 'evaluated', 'assessed', 'examined'],
    'put together': ['assembled', 'compiled', 'organized', 'coordinated'],
    'came up with': ['developed', 'devised', 'created', 'formulated'],
    'figured out': ['determined', 'identified', 'resolved', 'solved'],
    'set up': ['established', 'implemented', 'configured', 'initiated'],
    'took care of': ['managed', 'administered', 'handled', 'maintained']
};

const actionVerbs = [
    'Achieved', 'Administered', 'Analyzed', 'Coordinated', 'Created',
    'Delivered', 'Designed', 'Developed', 'Directed', 'Established',
    'Executed', 'Generated', 'Implemented', 'Improved', 'Increased',
    'Initiated', 'Led', 'Managed', 'Optimized', 'Organized',
    'Oversaw', 'Produced', 'Reduced', 'Resolved', 'Spearheaded',
    'Streamlined', 'Supervised', 'Trained', 'Transformed'
];

/* ---------------- analysis ---------------- */

const WEAK_START = ['i ', 'my ', 'we ', 'our ', 'the ', 'a ', 'an ', 'responsible for'];

const RE_SPECIALS = /[.*+?^${}()|[\]\\]/g;
const escapeRe = s => s.replace(RE_SPECIALS, '\\$&');

function allFormText() {
    return Array.from(document.querySelectorAll('.field, .bullet-input'))
        .map(i => i.value || '')
        .filter(v => v.trim())
        .join(' ');
}

function findSpellingErrors(text) {
    const seen = {}, out = [];
    text.toLowerCase().split(/\s+/).forEach(w => {
        const c = w.replace(/[.,!?;:'"()\[\]]/g, '');
        if (commonMisspellings[c] && !seen[c]) {
            seen[c] = 1;
            out.push({ word: c, suggestion: commonMisspellings[c] });
        }
    });
    return out;
}

function findWordImprovements(text) {
    const lower = text.toLowerCase();
    return Object.keys(wordImprovements)
        .filter(w => new RegExp('\\b' + escapeRe(w) + '\\b', 'i').test(lower))
        .map(w => ({ original: w, suggestions: wordImprovements[w] }));
}

function checkBulletPoints() {
    const out = [], seen = {};
    document.querySelectorAll('.bullet-input').forEach(input => {
        const line = input.value.trim();
        if (line.length < 8) return;
        const lower = line.toLowerCase();
        if (WEAK_START.some(s => lower.startsWith(s))) {
            const key = lower.slice(0, 24);
            if (seen[key]) return;
            seen[key] = 1;
            out.push({
                original: line.slice(0, 44) + (line.length > 44 ? '…' : ''),
                suggestions: actionVerbs.slice(0, 4),
                context: 'Lead with an action verb instead.'
            });
        }
        if (!/\d/.test(line)) {
            const key = 'q' + lower.slice(0, 24);
            if (seen[key]) return;
            seen[key] = 1;
            out.push({
                original: line.slice(0, 44) + (line.length > 44 ? '…' : ''),
                suggestions: ['Add a number: how many, how much, how often, how fast'],
                context: 'Quantified bullets read as specific rather than generic — and that is what a recruiter remembers.'
            });
        }
    });
    return out;
}

function checkFieldSpelling(field) {
    if (!field || !('value' in field)) return;
    const bad = field.value.toLowerCase().split(/\s+/)
        .some(w => commonMisspellings[w.replace(/[.,!?;:'"()]/g, '')]);
    field.classList.toggle('spell-error-highlight', bad);
}

function runSpellCheck() {
    const errBox = document.getElementById('spelling-errors');
    const sugBox = document.getElementById('word-suggestions');
    const text = allFormText();
    const errors = findSpellingErrors(text);
    const tips = findWordImprovements(text).concat(checkBulletPoints());

    errBox.textContent = '';
    if (!errors.length) {
        errBox.innerHTML = '<p class="no-issues">No misspellings from the built-in list.</p>';
    } else {
        errors.forEach(e => {
            const d = document.createElement('div');
            d.className = 'spelling-error';
            d.innerHTML = '<span class="word">' + escapeHtml(e.word) + '</span> → ' +
                '<span class="improved">' + escapeHtml(e.suggestion) + '</span>';
            errBox.appendChild(d);
        });
    }

    sugBox.textContent = '';
    if (!tips.length) {
        sugBox.innerHTML = '<p class="no-issues">Nothing flagged. Your wording looks strong.</p>';
    } else {
        tips.forEach(t => {
            const d = document.createElement('div');
            d.className = 'word-improvement';
            d.innerHTML = '<span class="original">' + escapeHtml(t.original) + '</span>' +
                '<span class="arrow"> → </span>' +
                '<span class="improved">' + escapeHtml(t.suggestions[0]) + '</span>' +
                (t.suggestions.length > 1 ? '<div class="context">Also: ' + escapeHtml(t.suggestions.slice(1).join(', ')) + '</div>' : '') +
                (t.context ? '<div class="context">' + escapeHtml(t.context) + '</div>' : '');
            sugBox.appendChild(d);
        });
    }

    document.querySelectorAll('.field, .bullet-input').forEach(checkFieldSpelling);
    showTab('suggestions');
}
