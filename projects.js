// Load and display projects
document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.getElementById('projects-list');

    try {
        // Fetch the projects list
        const response = await fetch('projects/projects.json');
        const projects = await response.json();

        // Display each project
        projects.forEach(project => {
            const projectElement = createProjectElement(project);
            projectsContainer.appendChild(projectElement);
        });

    } catch (error) {
        console.error('Error loading projects:', error);
        projectsContainer.innerHTML = '<p>No projects available yet. Check back soon!</p>';
    }
});

function createProjectElement(project) {
    const article = document.createElement('article');
    article.className = 'blog-post';

    const title = document.createElement('h3');
    title.className = 'blog-post-title';

    const titleLink = document.createElement('a');
    titleLink.href = `/projects/${project.id}`;
    titleLink.textContent = project.title;
    title.appendChild(titleLink);

    article.appendChild(title);

    const description = document.createElement('p');
    description.className = 'blog-post-excerpt';
    description.textContent = project.description;

    const readMore = document.createElement('a');
    readMore.href = `/projects/${project.id}`;
    readMore.className = 'blog-post-link';
    readMore.textContent = 'Read more →';

    article.appendChild(description);
    article.appendChild(readMore);

    return article;
}
