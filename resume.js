// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
}

// SVG Icons
const icons = {
    phone: '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/></svg>',
    email: '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/></svg>',
    linkedin: '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>',
    github: '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>'
};

// Load YAML and render
async function loadResume() {
    try {
        const response = await fetch('resume-data.yaml');
        const yamlText = await response.text();
        const data = jsyaml.load(yamlText);
        renderResume(data);
    } catch (error) {
        console.error('Error loading resume:', error);
        document.getElementById('header').innerHTML = `
            <div class="loading" style="color: #f85149;">
                Error loading resume data. Make sure resume-data.yaml exists.
            </div>`;
    }
}

function renderResume(data) {
    renderHeader(data.personal);
    renderSummary(data.personal.summary);
    renderSkills(data.skills);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderCertifications(data.certifications);
    renderFooter(data.personal.github);
    
    // Update page title
    document.title = `${data.personal.name} - ${data.personal.role}`;
}

function renderHeader(personal) {
    document.getElementById('header').innerHTML = `
        <div class="header-content">
            <div class="name-title">
                <h1>${personal.name}</h1>
                <div class="role">${personal.role}</div>
            </div>
            <div class="contact-links">
                <a href="tel:${personal.phone.replace(/[^0-9+]/g, '')}">
                    ${icons.phone} ${personal.phone}
                </a>
                <a href="mailto:${personal.email}">
                    ${icons.email} Email
                </a>
                <a href="${personal.linkedin}" target="_blank">
                    ${icons.linkedin} LinkedIn
                </a>
                <a href="${personal.github}" target="_blank">
                    ${icons.github} GitHub
                </a>
            </div>
        </div>
    `;
}

function renderSummary(summary) {
    document.getElementById('summary-section').innerHTML = `
        <div class="section-header"><h2>Summary</h2></div>
        <p class="summary">${summary}</p>
    `;
}

function renderSkills(skills) {
    const html = skills.map(skill => `
        <div class="skill-category">
            <h3>${skill.category}</h3>
            <div class="skill-tags">
                ${skill.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
            </div>
        </div>
    `).join('');

    document.getElementById('skills-section').innerHTML = `
        <div class="section-header"><h2>Technical Skills</h2></div>
        <div class="skills-grid">${html}</div>
    `;
}

function renderExperience(experience) {
    const html = experience.map(exp => `
        <div class="experience-item">
            <div class="experience-header">
                <div>
                    <h3>${exp.title}</h3>
                    <span class="company">${exp.company}</span>
                    ${exp.client ? `<span class="client"> · Client: ${exp.client}</span>` : ''}
                </div>
                <span class="date-range">${exp.duration}</span>
            </div>
            <ul>
                ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
            </ul>
            <div class="tech-stack">
                ${exp.techStack.map(t => `<span>${t}</span>`).join('')}
            </div>
        </div>
    `).join('');

    document.getElementById('experience-section').innerHTML = `
        <div class="section-header"><h2>Experience</h2></div>
        ${html}
    `;
}

function renderProjects(projects) {
    if (!projects || projects.length === 0) {
        document.getElementById('projects-section').style.display = 'none';
        return;
    }

    const html = projects.map(proj => `
        <div class="project-card">
            <h3>${proj.name}</h3>
            <p>${proj.description}</p>
            <div class="project-tech">
                ${proj.techStack.map(t => `<span>${t}</span>`).join('')}
            </div>
        </div>
    `).join('');

    document.getElementById('projects-section').innerHTML = `
        <div class="section-header"><h2>Projects</h2></div>
        <div class="projects-grid">${html}</div>
    `;
}

function renderCertifications(certs) {
    if (!certs || certs.length === 0) {
        document.getElementById('certifications-section').style.display = 'none';
        return;
    }

    const html = certs.map(cert => `
        <div class="cert-badge">
            ${cert.name}
            <span class="year">${cert.year}</span>
        </div>
    `).join('');

    document.getElementById('certifications-section').innerHTML = `
        <div class="section-header"><h2>Certifications</h2></div>
        <div class="cert-list">${html}</div>
    `;
}

function renderFooter(github) {
    document.getElementById('footer').innerHTML = `
        <p>Built with ❤️ | <a href="${github}">${github.replace('https://', '')}</a></p>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadResume();
});
