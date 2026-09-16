# Resume Generator

A single-page resume builder that runs entirely in the browser. It was built for
pilot resumes — flight hours, certificates and ratings, aviation training — but
every section can be switched off or renamed, so it works for any resume.

No build step, no server, no account. Open `index.html` and it runs.

## Quick start

```
git clone https://github.com/Knockoutpie/resume-generator.git
cd resume-generator
```

Then open `index.html` in a browser. That is the whole install.

Serving it over `file://` works. If your browser restricts local file access,
any static server will do:

```
python -m http.server 8000     # then visit http://localhost:8000
```

## What it does

- **Import an existing resume** from PDF or DOCX and fill the form from it.
- **Reorder, rename, add and remove sections.** Drag the ☰ handle, click a
  heading to retype it, or use the Sections chips to toggle one on or off.
- **Live preview** that matches the exported PDF.
- **Export to PDF**, laid out to survive machine reading (see below).
- **Save and load.** Work is kept in this browser's local storage and
  auto-saved as you type. Export/Load JSON moves it between machines.
- **Spelling and wording checks** against a built-in list, with prompts to
  lead with action verbs and quantify bullets.

## Machine readability

Applicant tracking systems and AI screeners read a PDF by extracting its text
layer. Several things that look fine on paper destroy that text, so the exporter
avoids them:

- **Dot leaders are vector graphics, not characters.** A row of literal periods
  extracts as `Total Hours...........251`. Here the leader is drawn as a dotted
  line, so the text layer contains only `Total Hours` and `251`.
- **Single column by default.** Side-by-side columns interleave when extracted.
  The compact two-column certificates/hours block is opt-in, and it
  automatically falls back to one column rather than straddle a page break.
- **Standard fonts and real text.** No images of text, no tables, and document
  metadata (title, author) is set.
- **Contact details go in the body**, never in a PDF or DOCX header — header
  content is invisible to most extractors. If your current resume keeps your
  name and phone number in a Word header, that is very likely why parsers lose
  them, and why importing it here recovers them when other tools do not.

## Importing: what to expect

The importer reduces both PDF and DOCX to the same line model, then finds
section headings, date ranges and entries by heuristic. It handles the common
shapes: `Company` / `Title — Mar 2021 – Present`, dates on their own line,
dates trailing a heading, bulleted or style-only lists, and grouped skills
(`Programming: Python, SQL`).

- **DOCX** is unzipped natively and read from the XML, including `header*.xml`,
  so contact blocks stored in a Word header are picked up. Paragraph styles
  (`Heading 1`, `List Paragraph`) are used as structure hints.
- **PDF** text spans are clustered into visual rows, genuine column bands are
  detected and un-interleaved, and dot leaders are stripped before parsing.

It is a heuristic, not magic. **Always read every field after an import.**
Scanned PDFs with no text layer cannot be imported at all.

## Project layout

```
index.html        markup shell
styles.css        all styling
js/sections.js    section registry — the single source of truth
js/form.js        builds the form, reads it back, repopulates it
js/import.js      DOCX/PDF extraction and resume parsing
js/render.js      live preview and PDF export
js/spell.js       spelling and wording checks
js/app.js         storage, auto-save, events, drag-and-drop
```

### Adding a section

Add one entry to `SECTIONS` in `js/sections.js`:

```js
{ id: 'awards', title: 'Awards & Honors', type: 'list', on: false }
```

The form, the gatherer, the preview, the PDF exporter and the Sections toggles
all read from that list, so nothing else needs editing. Pick a `type` from
`TYPES` in the same file (`prose`, `skills`, `list`, `pairs`, `entries`, `edu`,
`refs`), or add a new one there if none fit.

## Your data

Everything stays in your browser. Resume content is written to `localStorage`
under the key `resumeData` and is never uploaded anywhere — there is no backend.
"Clear All" deletes it. Two scripts are loaded from cdnjs (jsPDF for export,
pdf.js for import); nothing is sent to them.

If you fork this and want to harden the CDN loads, add
[SRI hashes](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
to the two `<script>` tags in `index.html`, or vendor the two files locally.

## Known limitations

- Import is best-effort and will need corrections on unusual layouts.
- Scanned/image-only PDFs are not supported (no OCR).
- The spelling check uses a fixed list of common misspellings, not a full
  dictionary; it will not catch everything.
- DOCX import needs `DecompressionStream`, available in current Chrome, Edge,
  Firefox and Safari 16.4+. Older browsers should import a PDF instead.

## License

MIT — see [LICENSE](LICENSE).
