// Load and display experience and skills from data.json
document.addEventListener('DOMContentLoaded', async () => {
    const experienceList = document.getElementById('experience-list');
    const skillsList = document.getElementById('skills-list');

    try {
        // Fetch the data
        const response = await fetch('data.json');
        const data = await response.json();

        // Load experience items
        if (data.experience && data.experience.length > 0) {
            data.experience.forEach(exp => {
                const expItem = createExperienceItem(exp);
                experienceList.appendChild(expItem);
            });
        }

        // Load skills
        if (data.skills && data.skills.length > 0) {
            data.skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill;
                skillsList.appendChild(skillTag);
            });
        }

    } catch (error) {
        console.error('Error loading experience data:', error);
        experienceList.innerHTML = '<p>Error loading experience. Please try again later.</p>';
    }
});

function createExperienceItem(exp) {
    const div = document.createElement('div');
    div.className = 'experience-item';

    // Create company element - with optional link
    let companyHTML = exp.company;
    if (exp.url) {
        companyHTML = `<a href="${exp.url}" target="_blank" rel="noopener noreferrer">${exp.company}</a>`;
    }

    // Only include description if it exists
    const descriptionHTML = exp.description ? `<p class="exp-description">${exp.description}</p>` : '';

    div.innerHTML = `
        <div class="exp-header">
            <h3>${exp.title}</h3>
            <span class="exp-period">${exp.period}</span>
        </div>
        <p class="exp-company">${companyHTML}</p>
        ${descriptionHTML}
    `;

    return div;
}
