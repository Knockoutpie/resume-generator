// Resume Generator Application

// ==========================================
// FORM MANAGEMENT FUNCTIONS
// ==========================================

function addCertificate() {
    const container = document.getElementById('certificates-container');
    const entry = document.createElement('div');
    entry.className = 'certificate-entry';
    entry.innerHTML = `
        <input type="text" class="certificate-input" placeholder="Enter certificate or rating..." spellcheck="true">
        <button class="remove-btn" onclick="removeEntry(this)">×</button>
    `;
    container.appendChild(entry);
}

function addHours() {
    const container = document.getElementById('hours-container');
    const entry = document.createElement('div');
    entry.className = 'hours-entry custom-hours';
    entry.innerHTML = `
        <input type="text" class="hours-label" placeholder="Custom Hour Type" spellcheck="true">
        <input type="number" class="hours-value" placeholder="0">
        <button class="remove-btn" onclick="removeEntry(this)">×</button>
    `;
    container.appendChild(entry);
}

function addExperience() {
    const container = document.getElementById('experience-container');
    const entry = document.createElement('div');
    entry.className = 'experience-entry';
    entry.innerHTML = `
        <div class="form-group">
            <label>Company Name</label>
            <input type="text" class="company-name" placeholder="Company Name" spellcheck="true">
        </div>
        <div class="form-group">
            <label>Job Title</label>
            <input type="text" class="job-title" placeholder="Job Title" spellcheck="true">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Date</label>
                <input type="text" class="start-date" placeholder="Month Year">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="text" class="end-date" placeholder="Present">
            </div>
        </div>
        <div class="form-group">
            <label>Responsibilities</label>
            <div class="responsibilities-container">
                <div class="bullet-entry">
                    <span class="bullet-icon">•</span>
                    <input type="text" class="bullet-input" placeholder="Start with action verbs like Developed, Led, Created" spellcheck="true">
                    <button class="remove-bullet-btn" onclick="removeBullet(this)">×</button>
                </div>
            </div>
            <button class="add-bullet-btn" onclick="addBullet(this)">+ Add Bullet Point</button>
        </div>
        <button class="remove-btn remove-section" onclick="removeEntry(this)">Remove Job</button>
    `;
    container.appendChild(entry);
}

function addEducation() {
    const container = document.getElementById('education-container');
    const entry = document.createElement('div');
    entry.className = 'education-entry';
    entry.innerHTML = `
        <div class="form-group">
            <label>Institution Name</label>
            <input type="text" class="institution-name" placeholder="University Name" spellcheck="true">
        </div>
        <div class="form-group">
            <label>Degree / Program</label>
            <input type="text" class="degree" placeholder="Bachelor of Science in..." spellcheck="true">
        </div>
        <div class="form-group">
            <label>Date</label>
            <input type="text" class="edu-date" placeholder="May 2024">
        </div>
        <div class="form-group">
            <label>Additional Details (one per line)</label>
            <textarea class="edu-details" rows="3" placeholder="Minor, honors, study abroad..." spellcheck="true"></textarea>
        </div>
        <button class="remove-btn remove-section" onclick="removeEntry(this)">Remove Education</button>
    `;
    container.appendChild(entry);
}

function addVolunteer() {
    const container = document.getElementById('volunteer-container');
    const entry = document.createElement('div');
    entry.className = 'volunteer-entry';
    entry.innerHTML = `
        <div class="form-group">
            <label>Organization</label>
            <input type="text" class="volunteer-org" placeholder="Organization Name" spellcheck="true">
        </div>
        <div class="form-group">
            <label>Role</label>
            <input type="text" class="volunteer-role" placeholder="Volunteer Role or Title" spellcheck="true">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Date</label>
                <input type="text" class="volunteer-start" placeholder="Month Year">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="text" class="volunteer-end" placeholder="Present">
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <div class="responsibilities-container">
                <div class="bullet-entry">
                    <span class="bullet-icon">•</span>
                    <input type="text" class="bullet-input" placeholder="Describe your involvement..." spellcheck="true">
                    <button class="remove-bullet-btn" onclick="removeBullet(this)">×</button>
                </div>
            </div>
            <button class="add-bullet-btn" onclick="addBullet(this)">+ Add Bullet Point</button>
        </div>
        <button class="remove-btn remove-section" onclick="removeEntry(this)">Remove Entry</button>
    `;
    container.appendChild(entry);
}

function addTraining() {
    const container = document.getElementById('training-container');
    const entry = document.createElement('div');
    entry.className = 'training-entry';
    entry.innerHTML = `
        <div class="form-group">
            <label>School / Training Provider</label>
            <input type="text" class="training-school" placeholder="ATP Flight School, FlightSafety International..." spellcheck="true">
        </div>
        <div class="form-group">
            <label>Program / Course</label>
            <input type="text" class="training-program" placeholder="Multi-Engine Rating, Part 141 Private Pilot..." spellcheck="true">
        </div>
        <div class="form-group">
            <label>Date</label>
            <input type="text" class="training-date" placeholder="Month Year">
        </div>
        <div class="form-group">
            <label>Additional Details (one per line)</label>
            <textarea class="training-details" rows="2" placeholder="Aircraft types, honors, achievements..." spellcheck="true"></textarea>
        </div>
        <button class="remove-btn remove-section" onclick="removeEntry(this)">Remove Training</button>
    `;
    container.appendChild(entry);
}

function addReference() {
    const container = document.getElementById('references-container');
    const entry = document.createElement('div');
    entry.className = 'reference-entry';
    entry.innerHTML = `
        <div class="form-group">
            <label>Name</label>
            <input type="text" class="ref-name" placeholder="Reference Full Name" spellcheck="true">
        </div>
        <div class="form-group">
            <label>Title / Relationship</label>
            <input type="text" class="ref-title" placeholder="Chief Pilot, Former Supervisor..." spellcheck="true">
        </div>
        <div class="form-group">
            <label>Company / Organization</label>
            <input type="text" class="ref-company" placeholder="Company Name" spellcheck="true">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" class="ref-phone" placeholder="(555) 555-5555">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="ref-email" placeholder="reference@email.com">
            </div>
        </div>
        <button class="remove-btn remove-section" onclick="removeEntry(this)">Remove Reference</button>
    `;
    container.appendChild(entry);
}

function removeEntry(button) {
    const entry = button.closest('.certificate-entry, .hours-entry, .experience-entry, .education-entry, .volunteer-entry, .training-entry, .reference-entry');
    if (entry) {
        entry.remove();
    }
}

function addBullet(button) {
    const container = button.previousElementSibling;
    const bulletEntry = document.createElement('div');
    bulletEntry.className = 'bullet-entry';
    bulletEntry.innerHTML = `
        <span class="bullet-icon">•</span>
        <input type="text" class="bullet-input" placeholder="Add another responsibility..." spellcheck="true">
        <button class="remove-bullet-btn" onclick="removeBullet(this)">×</button>
    `;
    container.appendChild(bulletEntry);
    // Focus the new input
    bulletEntry.querySelector('.bullet-input').focus();
}

function removeBullet(button) {
    const bulletEntry = button.closest('.bullet-entry');
    const container = bulletEntry.closest('.responsibilities-container');

    // Don't remove if it's the last one
    if (container.querySelectorAll('.bullet-entry').length > 1) {
        bulletEntry.remove();
    } else {
        // Just clear the input if it's the last one
        bulletEntry.querySelector('.bullet-input').value = '';
    }
}

// ==========================================
// TAB MANAGEMENT
// ==========================================

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName)) {
            btn.classList.add('active');
        }
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
}

// ==========================================
// RESUME GENERATION
// ==========================================

function generateResume() {
    const preview = document.getElementById('resume-preview');

    // Gather data
    const data = gatherFormData();

    // Build contact line with proper separators
    const contactParts = [];
    if (data.address) contactParts.push(escapeHtml(data.address));
    if (data.phone) contactParts.push(escapeHtml(data.phone));
    if (data.email) contactParts.push(escapeHtml(data.email));
    const contactLine = contactParts.join(' | ');

    // Generate HTML
    let html = `
        <div class="resume-document">
            <div class="resume-header">
                <div class="resume-name">${escapeHtml(data.fullName)}</div>
                <div class="resume-contact">${contactLine}</div>
            </div>
    `;

    // Certificates and Hours section
    if (data.certificates.length > 0 || data.hours.length > 0) {
        html += `
            <div class="resume-section">
                <div class="certs-hours-container">
                    <div class="certs-column">
                        <h4>Certificates and Ratings</h4>
                        <hr style="margin-bottom: 8px;">
                        <ul class="cert-list">
                            ${data.certificates.map(cert => `<li>${escapeHtml(cert)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="hours-column">
                        <h4>Hours</h4>
                        <hr style="margin-bottom: 8px;">
                        <div class="hours-list">
                            ${data.hours.map(h => `
                                <div class="hours-item">
                                    <span class="hours-label-display">${escapeHtml(h.label)}</span>
                                    <span class="hours-dots"></span>
                                    <span class="hours-value-display">${escapeHtml(h.value)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Work Experience section
    if (data.experience.length > 0) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Work Experience</div>
                ${data.experience.map(job => `
                    <div class="job-entry">
                        <div class="job-header">
                            <span class="company-name-display">${escapeHtml(job.company)}</span>
                            <span class="job-dates">${escapeHtml(job.startDate)}${job.endDate ? ' - ' + escapeHtml(job.endDate) : ''}</span>
                        </div>
                        <div class="job-title-display">${escapeHtml(job.title)}</div>
                        <ul class="responsibilities-list">
                            ${job.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Education section
    if (data.education.length > 0) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Education</div>
                ${data.education.map(edu => `
                    <div class="edu-entry">
                        <div class="edu-header">
                            <span class="institution-display">${escapeHtml(edu.institution)}</span>
                            <span class="edu-dates">${escapeHtml(edu.date)}</span>
                        </div>
                        <div class="degree-display">${escapeHtml(edu.degree)}</div>
                        ${edu.details.length > 0 ? `
                            <ul class="edu-details-list">
                                ${edu.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Aviation Training section
    if (data.training.length > 0) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Aviation Training & Education</div>
                ${data.training.map(t => `
                    <div class="edu-entry">
                        <div class="edu-header">
                            <span class="institution-display">${escapeHtml(t.school)}</span>
                            <span class="edu-dates">${escapeHtml(t.date)}</span>
                        </div>
                        <div class="degree-display">${escapeHtml(t.program)}</div>
                        ${t.details.length > 0 ? `
                            <ul class="edu-details-list">
                                ${t.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Volunteer Experience & Community Involvement section
    if (data.volunteer.length > 0) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Volunteer Experience & Community Involvement</div>
                ${data.volunteer.map(v => `
                    <div class="job-entry">
                        <div class="job-header">
                            <span class="company-name-display">${escapeHtml(v.organization)}</span>
                            <span class="job-dates">${escapeHtml(v.startDate)}${v.endDate ? ' - ' + escapeHtml(v.endDate) : ''}</span>
                        </div>
                        <div class="job-title-display">${escapeHtml(v.role)}</div>
                        ${v.bullets.length > 0 ? `
                            <ul class="responsibilities-list">
                                ${v.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // References
    if (data.references && data.references.length > 0) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">References</div>
                ${data.references.map(r => `
                    <div class="job-entry">
                        <strong>${escapeHtml(r.name)}</strong>
                        ${r.title ? ` — ${escapeHtml(r.title)}` : ''}
                        ${r.company ? `, ${escapeHtml(r.company)}` : ''}<br>
                        ${r.phone ? `Phone: ${escapeHtml(r.phone)}` : ''}
                        ${r.phone && r.email ? ' | ' : ''}
                        ${r.email ? `Email: ${escapeHtml(r.email)}` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        html += `
            <div class="resume-section" style="text-align: center; margin-top: 15px; font-size: 11px; font-style: italic;">
                References available upon request
            </div>
        `;
    }

    html += '</div>';
    preview.innerHTML = html;
}

function gatherFormData() {
    return {
        fullName: document.getElementById('fullName').value || 'Your Name',
        address: document.getElementById('address').value || '',
        phone: document.getElementById('phone').value || '',
        email: document.getElementById('email').value || '',
        certificates: Array.from(document.querySelectorAll('.certificate-input'))
            .map(input => input.value.trim())
            .filter(v => v),
        hours: Array.from(document.querySelectorAll('.hours-entry'))
            .map(entry => {
                const fixedLabel = entry.querySelector('.hours-label-fixed');
                const customLabel = entry.querySelector('.hours-label');
                const valueInput = entry.querySelector('.hours-value');

                let label = '';
                if (fixedLabel) {
                    label = fixedLabel.textContent.trim();
                } else if (customLabel) {
                    label = customLabel.value.trim();
                } else if (valueInput && valueInput.dataset.label) {
                    label = valueInput.dataset.label;
                }

                return {
                    label: label,
                    value: valueInput ? valueInput.value.trim() : ''
                };
            })
            .filter(h => h.label && h.value),
        experience: Array.from(document.querySelectorAll('.experience-entry'))
            .map(entry => ({
                company: entry.querySelector('.company-name').value.trim(),
                title: entry.querySelector('.job-title').value.trim(),
                startDate: entry.querySelector('.start-date').value.trim(),
                endDate: entry.querySelector('.end-date').value.trim(),
                responsibilities: Array.from(entry.querySelectorAll('.bullet-input'))
                    .map(input => input.value.trim())
                    .filter(r => r)
            }))
            .filter(job => job.company || job.title),
        education: Array.from(document.querySelectorAll('.education-entry'))
            .map(entry => ({
                institution: entry.querySelector('.institution-name').value.trim(),
                degree: entry.querySelector('.degree').value.trim(),
                date: entry.querySelector('.edu-date').value.trim(),
                details: entry.querySelector('.edu-details').value
                    .split('\n')
                    .map(d => d.trim())
                    .filter(d => d)
            }))
            .filter(edu => edu.institution || edu.degree),
        training: Array.from(document.querySelectorAll('.training-entry'))
            .map(entry => ({
                school: entry.querySelector('.training-school').value.trim(),
                program: entry.querySelector('.training-program').value.trim(),
                date: entry.querySelector('.training-date').value.trim(),
                details: entry.querySelector('.training-details').value
                    .split('\n')
                    .map(d => d.trim())
                    .filter(d => d)
            }))
            .filter(t => t.school || t.program),
        volunteer: Array.from(document.querySelectorAll('.volunteer-entry'))
            .map(entry => ({
                organization: entry.querySelector('.volunteer-org').value.trim(),
                role: entry.querySelector('.volunteer-role').value.trim(),
                startDate: entry.querySelector('.volunteer-start').value.trim(),
                endDate: entry.querySelector('.volunteer-end').value.trim(),
                bullets: Array.from(entry.querySelectorAll('.bullet-input'))
                    .map(input => input.value.trim())
                    .filter(r => r)
            }))
            .filter(v => v.organization || v.role),
        references: Array.from(document.querySelectorAll('.reference-entry'))
            .map(entry => ({
                name: entry.querySelector('.ref-name').value.trim(),
                title: entry.querySelector('.ref-title').value.trim(),
                company: entry.querySelector('.ref-company').value.trim(),
                phone: entry.querySelector('.ref-phone').value.trim(),
                email: entry.querySelector('.ref-email').value.trim()
            }))
            .filter(r => r.name)
    };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// PDF EXPORT
// ==========================================

function exportPDF() {
    const preview = document.getElementById('resume-preview');

    if (preview.querySelector('.placeholder-text')) {
        alert('Please generate your resume first before exporting to PDF.');
        return;
    }

    const data = gatherFormData();
    if (!data.fullName || data.fullName === 'Your Name') {
        alert('Please fill in your resume details first.');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'letter' });

        // Letter size: 612 x 792 points
        const pageW = 612;
        const pageH = 792;
        const margin = 40;
        const contentW = pageW - margin * 2;
        let y = margin;

        // Helper: add a new page if needed
        function checkPage(needed) {
            if (y + needed > pageH - margin) {
                doc.addPage();
                y = margin;
            }
        }

        // Helper: wrap text and return lines
        function getWrappedLines(text, maxWidth) {
            return doc.splitTextToSize(text, maxWidth);
        }

        // --- HEADER ---
        // Name
        doc.setFont('times', 'bold');
        doc.setFontSize(22);
        doc.text(data.fullName, pageW / 2, y, { align: 'center' });
        y += 20;

        // Contact line
        const contactParts = [];
        if (data.address) contactParts.push(data.address);
        if (data.phone) contactParts.push(data.phone);
        if (data.email) contactParts.push(data.email);
        if (contactParts.length > 0) {
            doc.setFont('times', 'normal');
            doc.setFontSize(10);
            doc.text(contactParts.join('  |  '), pageW / 2, y, { align: 'center' });
        }
        y += 18;

        // --- CERTIFICATES & HOURS (side by side) ---
        if (data.certificates.length > 0 || data.hours.length > 0) {
            const colW = contentW / 2 - 10;
            const startY = y;

            // Certificates column
            if (data.certificates.length > 0) {
                doc.setFont('times', 'bold');
                doc.setFontSize(11);
                doc.text('Certificates and Ratings', margin, y);
                y += 3;
                doc.setLineWidth(0.5);
                doc.line(margin, y, margin + colW, y);
                y += 10;

                doc.setFont('times', 'normal');
                doc.setFontSize(9);
                data.certificates.forEach(cert => {
                    checkPage(12);
                    const lines = getWrappedLines(cert, colW - 15);
                    lines.forEach((line, i) => {
                        if (i === 0) {
                            doc.text('\u2022  ' + line, margin + 5, y);
                        } else {
                            doc.text('   ' + line, margin + 5, y);
                        }
                        y += 11;
                    });
                });
            }

            const certsEndY = y;

            // Hours column
            if (data.hours.length > 0) {
                y = startY;
                const hoursX = margin + colW + 20;

                doc.setFont('times', 'bold');
                doc.setFontSize(11);
                doc.text('Hours', hoursX, y);
                y += 3;
                doc.setLineWidth(0.5);
                doc.line(hoursX, y, hoursX + colW, y);
                y += 10;

                doc.setFont('times', 'normal');
                doc.setFontSize(9);
                data.hours.forEach(h => {
                    checkPage(12);
                    // Clean format: "Label: Value" for ATS readability
                    doc.text(h.label + ':  ' + h.value, hoursX, y);
                    y += 11;
                });
            }

            y = Math.max(y, certsEndY) + 8;
        }

        // --- WORK EXPERIENCE ---
        if (data.experience.length > 0) {
            checkPage(30);
            doc.setFont('times', 'bold');
            doc.setFontSize(12);
            doc.text('Work Experience', margin, y);
            y += 3;
            doc.setLineWidth(0.75);
            doc.line(margin, y, pageW - margin, y);
            y += 12;

            data.experience.forEach(job => {
                checkPage(40);

                // Company and dates on same line
                doc.setFont('times', 'bold');
                doc.setFontSize(10);
                doc.text(job.company, margin, y);
                const dateStr = job.startDate + (job.endDate ? ' - ' + job.endDate : '');
                doc.setFont('times', 'normal');
                doc.text(dateStr, pageW - margin, y, { align: 'right' });
                y += 13;

                // Job title
                doc.setFont('times', 'italic');
                doc.setFontSize(10);
                doc.text(job.title, margin, y);
                y += 12;

                // Bullet points
                doc.setFont('times', 'normal');
                doc.setFontSize(9);
                job.responsibilities.forEach(r => {
                    checkPage(12);
                    const lines = getWrappedLines(r, contentW - 20);
                    lines.forEach((line, i) => {
                        if (i === 0) {
                            doc.text('\u2022  ' + line, margin + 10, y);
                        } else {
                            doc.text('   ' + line, margin + 10, y);
                        }
                        y += 11;
                    });
                });
                y += 5;
            });
        }

        // --- EDUCATION ---
        if (data.education.length > 0) {
            checkPage(30);
            doc.setFont('times', 'bold');
            doc.setFontSize(12);
            doc.text('Education', margin, y);
            y += 3;
            doc.setLineWidth(0.75);
            doc.line(margin, y, pageW - margin, y);
            y += 12;

            data.education.forEach(edu => {
                checkPage(30);

                // Institution and date
                doc.setFont('times', 'bold');
                doc.setFontSize(10);
                doc.text(edu.institution, margin, y);
                doc.setFont('times', 'normal');
                doc.text(edu.date, pageW - margin, y, { align: 'right' });
                y += 13;

                // Degree
                doc.setFont('times', 'italic');
                doc.setFontSize(10);
                doc.text(edu.degree, margin, y);
                y += 12;

                // Details
                if (edu.details.length > 0) {
                    doc.setFont('times', 'normal');
                    doc.setFontSize(9);
                    edu.details.forEach(d => {
                        checkPage(12);
                        const lines = getWrappedLines(d, contentW - 20);
                        lines.forEach((line, i) => {
                            if (i === 0) {
                                doc.text('\u2022  ' + line, margin + 10, y);
                            } else {
                                doc.text('   ' + line, margin + 10, y);
                            }
                            y += 11;
                        });
                    });
                }
                y += 5;
            });
        }

        // --- AVIATION TRAINING ---
        if (data.training.length > 0) {
            checkPage(30);
            doc.setFont('times', 'bold');
            doc.setFontSize(12);
            doc.text('Aviation Training & Education', margin, y);
            y += 3;
            doc.setLineWidth(0.75);
            doc.line(margin, y, pageW - margin, y);
            y += 12;

            data.training.forEach(t => {
                checkPage(30);

                doc.setFont('times', 'bold');
                doc.setFontSize(10);
                doc.text(t.school, margin, y);
                doc.setFont('times', 'normal');
                doc.text(t.date, pageW - margin, y, { align: 'right' });
                y += 13;

                doc.setFont('times', 'italic');
                doc.setFontSize(10);
                doc.text(t.program, margin, y);
                y += 12;

                if (t.details.length > 0) {
                    doc.setFont('times', 'normal');
                    doc.setFontSize(9);
                    t.details.forEach(d => {
                        checkPage(12);
                        var lines = getWrappedLines(d, contentW - 20);
                        lines.forEach(function(line, i) {
                            if (i === 0) {
                                doc.text('\u2022  ' + line, margin + 10, y);
                            } else {
                                doc.text('   ' + line, margin + 10, y);
                            }
                            y += 11;
                        });
                    });
                }
                y += 5;
            });
        }

        // --- VOLUNTEER EXPERIENCE ---
        if (data.volunteer.length > 0) {
            checkPage(30);
            doc.setFont('times', 'bold');
            doc.setFontSize(12);
            doc.text('Volunteer Experience & Community Involvement', margin, y);
            y += 3;
            doc.setLineWidth(0.75);
            doc.line(margin, y, pageW - margin, y);
            y += 12;

            data.volunteer.forEach(v => {
                checkPage(40);

                doc.setFont('times', 'bold');
                doc.setFontSize(10);
                doc.text(v.organization, margin, y);
                var dateStr = v.startDate + (v.endDate ? ' - ' + v.endDate : '');
                doc.setFont('times', 'normal');
                doc.text(dateStr, pageW - margin, y, { align: 'right' });
                y += 13;

                doc.setFont('times', 'italic');
                doc.setFontSize(10);
                doc.text(v.role, margin, y);
                y += 12;

                doc.setFont('times', 'normal');
                doc.setFontSize(9);
                v.bullets.forEach(b => {
                    checkPage(12);
                    var lines = getWrappedLines(b, contentW - 20);
                    lines.forEach(function(line, i) {
                        if (i === 0) {
                            doc.text('\u2022  ' + line, margin + 10, y);
                        } else {
                            doc.text('   ' + line, margin + 10, y);
                        }
                        y += 11;
                    });
                });
                y += 5;
            });
        }

        // --- REFERENCES ---
        if (data.references && data.references.length > 0) {
            checkPage(30 + data.references.length * 30);
            y += 5;
            doc.setFont('times', 'bold');
            doc.setFontSize(11);
            doc.text('References', margin, y);
            y += 2;
            doc.setLineWidth(0.5);
            doc.line(margin, y, pageW - margin, y);
            y += 12;

            data.references.forEach(r => {
                checkPage(35);
                doc.setFont('times', 'bold');
                doc.setFontSize(10);
                let refLine = r.name;
                if (r.title) refLine += ' — ' + r.title;
                if (r.company) refLine += ', ' + r.company;
                doc.text(refLine, margin, y);
                y += 12;

                doc.setFont('times', 'normal');
                let contactParts = [];
                if (r.phone) contactParts.push('Phone: ' + r.phone);
                if (r.email) contactParts.push('Email: ' + r.email);
                if (contactParts.length > 0) {
                    doc.text(contactParts.join('  |  '), margin, y);
                    y += 12;
                }
                y += 3;
            });
        } else {
            checkPage(25);
            y += 5;
            doc.setFont('times', 'italic');
            doc.setFontSize(10);
            doc.text('References available upon request', pageW / 2, y, { align: 'center' });
        }

        // Generate filename from the person's name
        const filename = data.fullName.replace(/\s+/g, '_') + '_Resume.pdf';
        doc.save(filename);

    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF: ' + error.message);
    }
}

// ==========================================
// SPELL CHECK AND WORD SUGGESTIONS
// ==========================================

// Common misspellings dictionary
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

// Weak words and their stronger alternatives
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

// Action verbs for resume bullet points
const actionVerbs = [
    'Achieved', 'Administered', 'Analyzed', 'Coordinated', 'Created',
    'Delivered', 'Designed', 'Developed', 'Directed', 'Established',
    'Executed', 'Generated', 'Implemented', 'Improved', 'Increased',
    'Initiated', 'Led', 'Managed', 'Optimized', 'Organized',
    'Oversaw', 'Produced', 'Reduced', 'Resolved', 'Spearheaded',
    'Streamlined', 'Supervised', 'Trained', 'Transformed'
];

function runSpellCheck() {
    const spellingErrorsDiv = document.getElementById('spelling-errors');
    const wordSuggestionsDiv = document.getElementById('word-suggestions');

    // Clear previous results
    spellingErrorsDiv.innerHTML = '';
    wordSuggestionsDiv.innerHTML = '';

    // Gather all text from the form
    const allText = gatherAllText();

    // Check for spelling errors
    const spellingErrors = findSpellingErrors(allText);

    // Check for word improvements
    const improvements = findWordImprovements(allText);

    // Check for weak bullet point starts
    const bulletPointSuggestions = checkBulletPoints();

    // Display spelling errors
    if (spellingErrors.length === 0) {
        spellingErrorsDiv.innerHTML = '<p class="no-issues">No spelling errors found!</p>';
    } else {
        spellingErrors.forEach(error => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'spelling-error';
            errorDiv.innerHTML = `
                <span class="word">"${escapeHtml(error.word)}"</span> may be misspelled.
                <div class="suggestions">
                    Suggestion: <span class="suggestion-word" onclick="copyToClipboard('${escapeHtml(error.suggestion)}')">${escapeHtml(error.suggestion)}</span>
                </div>
            `;
            spellingErrorsDiv.appendChild(errorDiv);
        });
    }

    // Display word improvements
    let allImprovements = [...improvements, ...bulletPointSuggestions];

    if (allImprovements.length === 0) {
        wordSuggestionsDiv.innerHTML = '<p class="no-issues">Your word choices look strong!</p>';
    } else {
        allImprovements.forEach(imp => {
            const impDiv = document.createElement('div');
            impDiv.className = 'word-improvement';
            impDiv.innerHTML = `
                <span class="original">"${escapeHtml(imp.original)}"</span>
                <span class="arrow">→</span>
                <span class="improved">"${escapeHtml(imp.suggestions[0])}"</span>
                ${imp.suggestions.length > 1 ? `<br><span class="context">Other options: ${imp.suggestions.slice(1).join(', ')}</span>` : ''}
                ${imp.context ? `<div class="context">${escapeHtml(imp.context)}</div>` : ''}
            `;
            wordSuggestionsDiv.appendChild(impDiv);
        });
    }

    // Switch to suggestions tab
    showTabDirect('suggestions');
}

function showTabDirect(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName)) {
            btn.classList.add('active');
        }
    });
    document.getElementById(tabName + '-tab').classList.add('active');
}

function gatherAllText() {
    const texts = [];

    // Get all input values
    document.querySelectorAll('input[type="text"], textarea').forEach(input => {
        if (input.value.trim()) {
            texts.push(input.value);
        }
    });

    return texts.join(' ');
}

function findSpellingErrors(text) {
    const errors = [];
    const words = text.toLowerCase().split(/\s+/);

    words.forEach(word => {
        // Clean the word of punctuation
        const cleanWord = word.replace(/[.,!?;:'"()]/g, '');

        if (commonMisspellings[cleanWord]) {
            // Check if we haven't already added this error
            if (!errors.find(e => e.word === cleanWord)) {
                errors.push({
                    word: cleanWord,
                    suggestion: commonMisspellings[cleanWord]
                });
            }
        }
    });

    return errors;
}

function findWordImprovements(text) {
    const improvements = [];
    const lowerText = text.toLowerCase();

    Object.keys(wordImprovements).forEach(weakWord => {
        // Use word boundary regex to find whole word matches
        const regex = new RegExp('\\b' + weakWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');

        if (regex.test(lowerText)) {
            improvements.push({
                original: weakWord,
                suggestions: wordImprovements[weakWord]
            });
        }
    });

    return improvements;
}

function checkBulletPoints() {
    const suggestions = [];
    const weakStarters = ['i ', 'my ', 'we ', 'our ', 'the '];

    // Check responsibilities in work experience (each bullet is a .bullet-input)
    document.querySelectorAll('.bullet-input').forEach(input => {
        const line = input.value.trim();
        if (!line) return;

        const trimmedLine = line.toLowerCase();

        // Check if line starts with a weak word
        weakStarters.forEach(starter => {
            if (trimmedLine.startsWith(starter)) {
                suggestions.push({
                    original: line.substring(0, 30) + (line.length > 30 ? '...' : ''),
                    suggestions: actionVerbs.slice(0, 4),
                    context: 'Consider starting with a strong action verb instead'
                });
            }
        });

        // Check if first word is not a strong action verb
        const firstWord = trimmedLine.split(' ')[0];
        if (firstWord && line.length > 10) {
            const pastTenseVerbs = ['managed', 'led', 'created', 'developed', 'implemented',
                                   'analyzed', 'coordinated', 'designed', 'established', 'executed',
                                   'generated', 'improved', 'increased', 'initiated', 'maintained',
                                   'optimized', 'organized', 'oversaw', 'produced', 'reduced',
                                   'resolved', 'spearheaded', 'streamlined', 'supervised', 'trained',
                                   'achieved', 'administered', 'delivered', 'directed'];

            const commonNonVerbs = ['a', 'an', 'the', 'this', 'that', 'these', 'those'];
            if (commonNonVerbs.includes(firstWord) &&
                !weakStarters.some(s => trimmedLine.startsWith(s))) {
                const exists = suggestions.find(s => s.original.includes(line.substring(0, 20)));
                if (!exists) {
                    suggestions.push({
                        original: line.substring(0, 30) + (line.length > 30 ? '...' : ''),
                        suggestions: ['Start with an action verb like: ' + actionVerbs.slice(0, 3).join(', ')],
                        context: 'Bullet points are stronger when they begin with action verbs'
                    });
                }
            }
        }
    });

    return suggestions;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied "' + text + '" to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Add real-time spell checking to textareas
    document.querySelectorAll('textarea, input[type="text"]').forEach(element => {
        element.addEventListener('blur', function() {
            checkFieldSpelling(this);
        });
    });

    // Add phone number auto-formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            formatPhoneNumber(this);
        });
    }

    // Auto-load saved data from localStorage
    loadSavedData();
});

function formatPhoneNumber(input) {
    // Get only digits from the input
    let digits = input.value.replace(/\D/g, '');

    // Limit to 10 digits
    digits = digits.substring(0, 10);

    // Format as (XXX) XXX-XXXX
    let formatted = '';
    if (digits.length > 0) {
        formatted = '(' + digits.substring(0, 3);
    }
    if (digits.length >= 3) {
        formatted += ') ' + digits.substring(3, 6);
    }
    if (digits.length >= 6) {
        formatted += '-' + digits.substring(6, 10);
    }

    input.value = formatted;
}

function checkFieldSpelling(field) {
    const text = field.value.toLowerCase();
    const words = text.split(/\s+/);
    let hasError = false;

    words.forEach(word => {
        const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
        if (commonMisspellings[cleanWord]) {
            hasError = true;
        }
    });

    if (hasError) {
        field.classList.add('spell-error-highlight');
    } else {
        field.classList.remove('spell-error-highlight');
    }
}

// ==========================================
// RESUME IMPORT FUNCTIONALITY
// ==========================================

// Initialize PDF.js worker
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

async function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusDiv = document.getElementById('importStatus');
    const fileNameSpan = document.getElementById('fileName');

    fileNameSpan.textContent = file.name;
    statusDiv.className = 'import-status loading';
    statusDiv.textContent = 'Processing file...';

    try {
        let text = '';

        if (file.name.endsWith('.pdf')) {
            text = await extractTextFromPDF(file);
        } else if (file.name.endsWith('.docx')) {
            text = await extractTextFromDOCX(file);
        } else {
            throw new Error('Unsupported file type. Please use PDF or DOCX.');
        }

        // Parse the extracted text
        const parsedData = parseResumeText(text);

        // Populate the form
        populateForm(parsedData);

        statusDiv.className = 'import-status success';
        statusDiv.textContent = 'Resume imported successfully! Review and edit the fields as needed.';

    } catch (error) {
        console.error('Import error:', error);
        statusDiv.className = 'import-status error';
        statusDiv.textContent = 'Error importing file: ' + error.message;
    }
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Use y-coordinates to detect line breaks
        let lastY = null;
        let lineText = '';

        textContent.items.forEach(item => {
            if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
                // Y position changed significantly — new line
                fullText += lineText.trim() + '\n';
                lineText = '';
            }
            lineText += item.str + ' ';
            lastY = item.transform[5];
        });

        if (lineText.trim()) {
            fullText += lineText.trim() + '\n';
        }
        fullText += '\n';
    }

    return fullText;
}

async function extractTextFromDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
}

function parseResumeText(text) {
    const data = {
        fullName: '',
        address: '',
        phone: '',
        email: '',
        certificates: [],
        skills: [],
        experience: [],
        education: [],
        training: [],
        volunteer: [],
        references: []
    };

    // Normalize text - preserve line breaks for structure, only collapse horizontal whitespace
    const lines = text.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(l => l);
    const flatText = lines.join(' ');

    // Extract email
    const emailMatch = flatText.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
        data.email = emailMatch[0];
    }

    // Extract phone number
    const phoneMatch = flatText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
        data.phone = phoneMatch[0];
    }

    // Try to extract name (usually first non-empty line)
    // Handles: "Title Case", "ALL CAPS", hyphenated, and suffixes like Jr./III
    if (lines.length > 0) {
        const firstLine = lines[0];
        const nameMatch = firstLine.match(/^([A-Za-z][A-Za-z'-]+(?:\s+[A-Za-z][A-Za-z'-]+)+(?:\s+(?:Jr\.?|Sr\.?|II|III|IV))?)\s*$/i);
        if (nameMatch) {
            data.fullName = nameMatch[1].trim();
        } else {
            // Fallback: look in first few lines for a name-like pattern
            for (let i = 0; i < Math.min(lines.length, 5); i++) {
                const match = lines[i].match(/^([A-Z][A-Za-z'-]+(?:\s+[A-Z][A-Za-z'-]+){1,3})\s*$/);
                if (match && !match[1].match(/@|www\.|http|\d{3}/)) {
                    data.fullName = match[1];
                    break;
                }
            }
        }
    }

    // Extract address (look for street number + city, state ZIP pattern)
    const addressMatch = flatText.match(/\d+[^,\n]{3,40},\s*[A-Za-z\s]+,?\s*[A-Z]{2},?\s*\d{5}(?:-\d{4})?/);
    if (addressMatch) {
        data.address = addressMatch[0].trim();
    } else {
        // Fallback: just city, state ZIP
        const cityStateZip = flatText.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,?\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?/);
        if (cityStateZip) {
            data.address = cityStateZip[0].trim();
        }
    }

    // Identify sections based on common headers
    const sectionPatterns = {
        experience: /work\s*experience|professional\s*experience|employment|experience/i,
        education: /\beducation\b(?!\s*skills)|academic/i,
        skills: /\bskills\b|technical\s*skills|competencies|expertise/i,
        certificates: /certificates?|certifications?|licenses?|ratings?/i,
        projects: /projects?|professional\s*projects/i,
        objective: /objective|summary|profile|professional\s*objective/i
    };

    // Split text into sections (use line-based text to preserve structure)
    const lineText = lines.join('\n');
    const sections = identifySections(lineText, sectionPatterns);

    // Parse Work Experience
    if (sections.experience) {
        data.experience = parseExperienceSection(sections.experience);
    }

    // Parse Education
    if (sections.education) {
        data.education = parseEducationSection(sections.education);
    }

    // Parse Skills/Certificates
    if (sections.skills) {
        data.skills = parseSkillsSection(sections.skills);
    }

    if (sections.certificates) {
        data.certificates = parseCertificatesSection(sections.certificates);
    }

    return data;
}

function identifySections(text, patterns) {
    const sections = {};
    const sectionStarts = [];

    // Find all section headers
    Object.keys(patterns).forEach(sectionName => {
        const regex = new RegExp(patterns[sectionName].source, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
            sectionStarts.push({
                name: sectionName,
                index: match.index,
                header: match[0]
            });
        }
    });

    // Sort by position in text
    sectionStarts.sort((a, b) => a.index - b.index);

    // Extract content for each section
    sectionStarts.forEach((section, i) => {
        const startIndex = section.index + section.header.length;
        const endIndex = i < sectionStarts.length - 1 ? sectionStarts[i + 1].index : text.length;
        sections[section.name] = text.substring(startIndex, endIndex).trim();
    });

    return sections;
}

function parseExperienceSection(text) {
    const experiences = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

    // Date pattern that matches lines like "MARCH 2022 TO PRESENT" or "AUGUST 2015 – MARCH 2016"
    const dateLinePattern = /^((?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{4})\s*(?:[-–—]|to)\s*((?:Present|Current|January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{0,4})\s*$/i;

    let currentJob = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const dateMatch = line.match(dateLinePattern);

        if (dateMatch) {
            // Save previous job if exists
            if (currentJob && (currentJob.company || currentJob.title)) {
                experiences.push(currentJob);
            }

            currentJob = {
                company: '',
                title: '',
                startDate: dateMatch[1].trim(),
                endDate: dateMatch[2].trim(),
                responsibilities: []
            };

            // Next line(s) after date are typically title then company
            // Title is usually ALL CAPS or bold
            if (i + 1 < lines.length && !lines[i + 1].match(dateLinePattern)) {
                const nextLine = lines[i + 1];
                // Check if it looks like a title (ALL CAPS, no bullet)
                if (!nextLine.match(/^[•●○■◦▪-]\s/) && nextLine.length < 80) {
                    currentJob.title = nextLine.replace(/[,.]$/, '');
                    i++;

                    // Line after title is typically company
                    if (i + 1 < lines.length && !lines[i + 1].match(dateLinePattern) && !lines[i + 1].match(/^[•●○■◦▪-]\s/)) {
                        const companyLine = lines[i + 1];
                        if (companyLine.length < 80) {
                            currentJob.company = companyLine.replace(/[,.]$/, '');
                            i++;
                        }
                    }
                }
            }
        } else if (currentJob) {
            // Check if it's a bullet point
            const bulletMatch = line.match(/^[•●○■◦▪-]\s*(.*)/);
            if (bulletMatch) {
                const bulletText = bulletMatch[1].trim();
                if (bulletText.length > 5) {
                    currentJob.responsibilities.push(bulletText);
                }
            } else if (line.length > 20 && currentJob.responsibilities.length > 0) {
                // Continuation of previous bullet (wrapped line)
                const lastIdx = currentJob.responsibilities.length - 1;
                currentJob.responsibilities[lastIdx] += ' ' + line;
            }
        }
    }

    // Don't forget the last job
    if (currentJob && (currentJob.company || currentJob.title)) {
        experiences.push(currentJob);
    }

    return experiences;
}

function parseEducationSection(text) {
    const education = [];

    // Look for degree patterns
    const degreePatterns = [
        /(?:Bachelor|Master|Associate|Doctor|PhD|B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|M\.?B\.?A\.?|Ph\.?D\.?)[^,.\n]*(?:in|of)[^,.\n]*/gi,
        /(?:Bachelor|Master|Associate|Doctor|PhD)[^,.\n]*/gi
    ];

    const datePattern = /(?:May|December|August|January|Spring|Fall|Summer|Winter)?\s*\d{4}/gi;
    const gpaPattern = /GPA[:\s]*(\d\.\d+)/i;

    // Try to find education entries
    let degrees = [];
    degreePatterns.forEach(pattern => {
        const matches = [...text.matchAll(pattern)];
        degrees = degrees.concat(matches);
    });

    // Also look for university names
    const universityPattern = /(?:University|College|Institute|School)[^,.\n]*/gi;
    const universities = [...text.matchAll(universityPattern)];

    // Combine and dedupe
    const allMatches = [...degrees, ...universities].sort((a, b) => a.index - b.index);

    if (allMatches.length > 0) {
        // Group consecutive matches
        let currentEdu = { institution: '', degree: '', date: '', details: [] };

        allMatches.forEach((match, i) => {
            const matchText = match[0].trim();

            if (matchText.match(/University|College|Institute|School/i)) {
                if (currentEdu.institution && currentEdu.degree) {
                    education.push({ ...currentEdu });
                    currentEdu = { institution: '', degree: '', date: '', details: [] };
                }
                currentEdu.institution = matchText;
            } else {
                currentEdu.degree = matchText;
            }

            // Look for date near this match
            const nearbyText = text.substring(match.index, Math.min(match.index + 100, text.length));
            const dateMatch = nearbyText.match(datePattern);
            if (dateMatch) {
                currentEdu.date = dateMatch[0];
            }

            // Look for GPA
            const gpaMatch = nearbyText.match(gpaPattern);
            if (gpaMatch) {
                currentEdu.details.push('GPA: ' + gpaMatch[1]);
            }
        });

        // Don't forget the last one
        if (currentEdu.institution || currentEdu.degree) {
            education.push(currentEdu);
        }
    }

    return education;
}

function parseSkillsSection(text) {
    // Split by common delimiters
    const skills = text
        .split(/[•●○■◦▪,\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 2 && s.length < 100);

    return skills;
}

function parseCertificatesSection(text) {
    const certs = text
        .split(/[•●○■◦▪\n]/)
        .map(c => c.trim())
        .filter(c => c.length > 5 && c.length < 200);

    return certs;
}

function populateForm(data) {
    // Clear existing entries first (except the first one in each section)
    clearExistingEntries();

    // Personal Information
    if (data.fullName) {
        document.getElementById('fullName').value = data.fullName;
    }
    if (data.address) {
        document.getElementById('address').value = data.address;
    }
    if (data.phone) {
        document.getElementById('phone').value = data.phone;
    }
    if (data.email) {
        document.getElementById('email').value = data.email;
    }

    // Certificates
    if (data.certificates && data.certificates.length > 0) {
        const certsContainer = document.getElementById('certificates-container');
        certsContainer.innerHTML = ''; // Clear existing

        data.certificates.forEach(cert => {
            const entry = document.createElement('div');
            entry.className = 'certificate-entry';
            entry.innerHTML = `
                <input type="text" class="certificate-input" value="${escapeHtmlAttr(cert)}" spellcheck="true">
                <button class="remove-btn" onclick="removeEntry(this)">×</button>
            `;
            certsContainer.appendChild(entry);
        });
    }

    // Work Experience
    if (data.experience && data.experience.length > 0) {
        const expContainer = document.getElementById('experience-container');
        expContainer.innerHTML = ''; // Clear existing

        data.experience.forEach(job => {
            const entry = document.createElement('div');
            entry.className = 'experience-entry';

            // Build bullet points HTML
            const bulletsHtml = job.responsibilities.length > 0
                ? job.responsibilities.map(r => `
                    <div class="bullet-entry">
                        <span class="bullet-icon">•</span>
                        <input type="text" class="bullet-input" value="${escapeHtmlAttr(r)}" spellcheck="true">
                        <button class="remove-bullet-btn" onclick="removeBullet(this)">×</button>
                    </div>
                `).join('')
                : `
                    <div class="bullet-entry">
                        <span class="bullet-icon">•</span>
                        <input type="text" class="bullet-input" placeholder="Add a responsibility..." spellcheck="true">
                        <button class="remove-bullet-btn" onclick="removeBullet(this)">×</button>
                    </div>
                `;

            entry.innerHTML = `
                <div class="form-group">
                    <label>Company Name</label>
                    <input type="text" class="company-name" value="${escapeHtmlAttr(job.company)}" spellcheck="true">
                </div>
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" class="job-title" value="${escapeHtmlAttr(job.title)}" spellcheck="true">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="text" class="start-date" value="${escapeHtmlAttr(job.startDate)}">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="text" class="end-date" value="${escapeHtmlAttr(job.endDate)}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Responsibilities</label>
                    <div class="responsibilities-container">
                        ${bulletsHtml}
                    </div>
                    <button class="add-bullet-btn" onclick="addBullet(this)">+ Add Bullet Point</button>
                </div>
                <button class="remove-btn remove-section" onclick="removeEntry(this)">Remove Job</button>
            `;
            expContainer.appendChild(entry);
        });
    }

    // Education
    if (data.education && data.education.length > 0) {
        const eduContainer = document.getElementById('education-container');
        eduContainer.innerHTML = ''; // Clear existing

        data.education.forEach(edu => {
            const entry = document.createElement('div');
            entry.className = 'education-entry';
            entry.innerHTML = `
                <div class="form-group">
                    <label>Institution Name</label>
                    <input type="text" class="institution-name" value="${escapeHtmlAttr(edu.institution)}" spellcheck="true">
                </div>
                <div class="form-group">
                    <label>Degree / Program</label>
                    <input type="text" class="degree" value="${escapeHtmlAttr(edu.degree)}" spellcheck="true">
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="text" class="edu-date" value="${escapeHtmlAttr(edu.date)}">
                </div>
                <div class="form-group">
                    <label>Additional Details (one per line)</label>
                    <textarea class="edu-details" rows="3" spellcheck="true">${escapeHtmlAttr(edu.details.join('\n'))}</textarea>
                </div>
                <button class="remove-btn remove-section" onclick="removeEntry(this)">Remove Education</button>
            `;
            eduContainer.appendChild(entry);
        });
    }

    // Aviation Training
    if (data.training && data.training.length > 0) {
        const trainContainer = document.getElementById('training-container');
        trainContainer.innerHTML = '';

        data.training.forEach(t => {
            const entry = document.createElement('div');
            entry.className = 'training-entry';
            entry.innerHTML = `
                <div class="form-group">
                    <label>School / Training Provider</label>
                    <input type="text" class="training-school" value="${escapeHtmlAttr(t.school)}" spellcheck="true">
                </div>
                <div class="form-group">
                    <label>Program / Course</label>
                    <input type="text" class="training-program" value="${escapeHtmlAttr(t.program)}" spellcheck="true">
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="text" class="training-date" value="${escapeHtmlAttr(t.date)}">
                </div>
                <div class="form-group">
                    <label>Additional Details (one per line)</label>
                    <textarea class="training-details" rows="2" spellcheck="true">${escapeHtmlAttr(t.details.join('\n'))}</textarea>
                </div>
                <button class="remove-btn remove-section" onclick="removeEntry(this)">Remove Training</button>
            `;
            trainContainer.appendChild(entry);
        });
    }

    // Volunteer Experience
    if (data.volunteer && data.volunteer.length > 0) {
        const volContainer = document.getElementById('volunteer-container');
        volContainer.innerHTML = '';

        data.volunteer.forEach(v => {
            const bulletsHtml = v.bullets && v.bullets.length > 0
                ? v.bullets.map(b => `
                    <div class="bullet-entry">
                        <span class="bullet-icon">•</span>
                        <input type="text" class="bullet-input" value="${escapeHtmlAttr(b)}" spellcheck="true">
                        <button class="remove-bullet-btn" onclick="removeBullet(this)">×</button>
                    </div>
                `).join('')
                : `
                    <div class="bullet-entry">
                        <span class="bullet-icon">•</span>
                        <input type="text" class="bullet-input" placeholder="Describe your involvement..." spellcheck="true">
                        <button class="remove-bullet-btn" onclick="removeBullet(this)">×</button>
                    </div>
                `;

            const entry = document.createElement('div');
            entry.className = 'volunteer-entry';
            entry.innerHTML = `
                <div class="form-group">
                    <label>Organization</label>
                    <input type="text" class="volunteer-org" value="${escapeHtmlAttr(v.organization)}" spellcheck="true">
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <input type="text" class="volunteer-role" value="${escapeHtmlAttr(v.role)}" spellcheck="true">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="text" class="volunteer-start" value="${escapeHtmlAttr(v.startDate)}">
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="text" class="volunteer-end" value="${escapeHtmlAttr(v.endDate)}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <div class="responsibilities-container">
                        ${bulletsHtml}
                    </div>
                    <button class="add-bullet-btn" onclick="addBullet(this)">+ Add Bullet Point</button>
                </div>
                <button class="remove-btn remove-section" onclick="removeEntry(this)">Remove Entry</button>
            `;
            volContainer.appendChild(entry);
        });
    }

    // References
    if (data.references && data.references.length > 0) {
        const refContainer = document.getElementById('references-container');
        refContainer.innerHTML = '';

        data.references.forEach(r => {
            const entry = document.createElement('div');
            entry.className = 'reference-entry';
            entry.innerHTML = `
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" class="ref-name" value="${escapeHtmlAttr(r.name)}" spellcheck="true">
                </div>
                <div class="form-group">
                    <label>Title / Relationship</label>
                    <input type="text" class="ref-title" value="${escapeHtmlAttr(r.title)}" spellcheck="true">
                </div>
                <div class="form-group">
                    <label>Company / Organization</label>
                    <input type="text" class="ref-company" value="${escapeHtmlAttr(r.company)}" spellcheck="true">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" class="ref-phone" value="${escapeHtmlAttr(r.phone)}">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="ref-email" value="${escapeHtmlAttr(r.email)}">
                    </div>
                </div>
                <button class="remove-btn remove-section" onclick="removeEntry(this)">Remove Reference</button>
            `;
            refContainer.appendChild(entry);
        });
    }

    // Auto-generate preview after import
    generateResume();
}

function clearExistingEntries() {
    // We'll replace the contents entirely in populateForm, so this is just a helper
}

function escapeHtmlAttr(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ==========================================
// SAVE / LOAD FORM DATA
// ==========================================

function saveFormData() {
    var data = gatherFormData();
    localStorage.setItem('resumeData', JSON.stringify(data));
    alert('Progress saved! Your data will be here when you come back.');
}

function loadSavedData() {
    var saved = localStorage.getItem('resumeData');
    if (saved) {
        try {
            var data = JSON.parse(saved);
            populateForm(data);
        } catch (e) {
            console.error('Failed to load saved data:', e);
        }
    }
}

function exportFormJSON() {
    var data = gatherFormData();
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (data.fullName || 'resume').replace(/\s+/g, '_') + '_data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importFormJSON(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
            populateForm(data);
            alert('Resume data loaded successfully!');
        } catch (err) {
            alert('Error reading file: ' + err.message);
        }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be re-imported
    event.target.value = '';
}
