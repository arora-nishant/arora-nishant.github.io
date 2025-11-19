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

    div.innerHTML = `
        <div class="exp-header">
            <h3>${exp.title}</h3>
            <span class="exp-period">${exp.period}</span>
        </div>
        <p class="exp-company">${exp.company}</p>
        <p class="exp-description">${exp.description}</p>
    `;

    return div;
}
