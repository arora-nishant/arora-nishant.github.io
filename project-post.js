// Load and display project from clean URL structure
document.addEventListener('DOMContentLoaded', async () => {
    const projectContent = document.getElementById('project-content');

    try {
        // Extract project ID from URL path: /projects/{project-id}/
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const projectId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

        if (!projectId) {
            projectContent.innerHTML = '<p>Project not found.</p>';
            return;
        }

        // Fetch projects metadata
        const response = await fetch('/projects/projects.json');
        const projects = await response.json();

        // Find the project
        const project = projects.find(p => p.id === projectId);

        if (!project) {
            projectContent.innerHTML = '<p>Project not found.</p>';
            return;
        }

        // Update page title
        document.title = `${project.title} - Nishant Arora`;

        // Update Open Graph meta tags if function is available
        if (window.setProjectMetaTags) {
            window.setProjectMetaTags(project);
        }

        // Fetch project content
        const contentResponse = await fetch(`/projects-content/${project.file}`);
        let content = await contentResponse.text();

        // Calculate reading time
        const readingTime = calculateReadingTime(content);

        // Check if it's markdown
        const isMarkdown = project.file.endsWith('.md');
        let htmlContent;

        if (isMarkdown) {
            // Protect math blocks from markdown processing
            const mathBlocks = [];
            const mathPlaceholder = 'MATH_BLOCK_';

            // Extract display math blocks ($$...$$)
            content = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, equation) => {
                const id = mathBlocks.length;
                mathBlocks.push(`\\[${equation}\\]`);
                return `${mathPlaceholder}${id}`;
            });

            // Extract inline math blocks ($...$)
            content = content.replace(/\$([^\$\n]+?)\$/g, (match, equation) => {
                const id = mathBlocks.length;
                mathBlocks.push(`\\(${equation}\\)`);
                return `${mathPlaceholder}${id}`;
            });

            // Configure marked for syntax highlighting
            marked.setOptions({
                highlight: function(code, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        return hljs.highlight(code, { language: lang }).value;
                    }
                    return hljs.highlightAuto(code).value;
                },
                breaks: true,
                gfm: true
            });

            htmlContent = marked.parse(content);

            // Restore math blocks
            htmlContent = htmlContent.replace(new RegExp(`${mathPlaceholder}(\\d+)`, 'g'), (match, id) => {
                return mathBlocks[parseInt(id)];
            });
        } else {
            htmlContent = content;
        }

        // Build tech stack HTML
        let techStackHTML = '';
        if (project.tech && project.tech.length > 0) {
            const techItems = project.tech.map(tech =>
                `<span class="tech-tag">${getTechIcon(tech)} ${tech}</span>`
            ).join('');
            techStackHTML = `<div class="tech-stack">${techItems}</div>`;
        }

        projectContent.innerHTML = `
            <h1>${project.title}</h1>
            ${techStackHTML}
            <div class="post-body">${htmlContent}</div>
        `;

        // Highlight all code blocks
        if (isMarkdown) {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }

        // Render math equations with KaTeX
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(projectContent, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\[', right: '\\]', display: true},
                    {left: '\\(', right: '\\)', display: false}
                ],
                throwOnError: false
            });
        }

    } catch (error) {
        console.error('Error loading project:', error);
        projectContent.innerHTML = '<p>Error loading project. Please try again later.</p>';
    }
});

// Calculate reading time from content
function calculateReadingTime(text) {
    // Remove markdown syntax for more accurate word count
    const plainText = text
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`[^`]*`/g, '') // Remove inline code
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
        .replace(/[#*_~]/g, ''); // Remove markdown symbols

    const words = plainText.trim().split(/\s+/).length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(words / wordsPerMinute);

    return `${minutes} min read`;
}

// Get appropriate tech icon for technology name
function getTechIcon(tech) {
    const techLower = tech.toLowerCase();

    // Map technology names to DevIcon classes
    const iconMap = {
        // Languages
        'python': 'devicon-python-plain',
        'java': 'devicon-java-plain',
        'javascript': 'devicon-javascript-plain',
        'typescript': 'devicon-typescript-plain',
        'go': 'devicon-go-plain',
        'golang': 'devicon-go-plain',
        'scala': 'devicon-scala-plain',
        'rust': 'devicon-rust-plain',
        'c++': 'devicon-cplusplus-plain',
        'c': 'devicon-c-plain',
        'r': 'devicon-r-plain',

        // Data & Analytics
        'spark': 'devicon-apachespark-plain',
        'apache spark': 'devicon-apachespark-plain',
        'kafka': 'devicon-apachekafka-plain',
        'apache kafka': 'devicon-apachekafka-plain',
        'airflow': 'devicon-apache-plain',
        'apache airflow': 'devicon-apache-plain',
        'hadoop': 'devicon-hadoop-plain',
        'flink': 'devicon-apache-plain',

        // Databases
        'postgresql': 'devicon-postgresql-plain',
        'postgres': 'devicon-postgresql-plain',
        'mysql': 'devicon-mysql-plain',
        'mongodb': 'devicon-mongodb-plain',
        'redis': 'devicon-redis-plain',
        'elasticsearch': 'devicon-elasticsearch-plain',
        'cassandra': 'devicon-cassandra-plain',
        'sql': 'devicon-postgresql-plain',

        // Cloud Platforms
        'aws': 'devicon-amazonwebservices-plain-wordmark',
        'amazon web services': 'devicon-amazonwebservices-plain-wordmark',
        'gcp': 'devicon-googlecloud-plain',
        'google cloud': 'devicon-googlecloud-plain',
        'azure': 'devicon-azure-plain',
        'microsoft azure': 'devicon-azure-plain',

        // Cloud Services (use cloud icon for specific services)
        'redshift': 'devicon-amazonwebservices-plain-wordmark',
        'bigquery': 'devicon-googlecloud-plain',
        's3': 'devicon-amazonwebservices-plain-wordmark',
        'lambda': 'devicon-amazonwebservices-plain-wordmark',
        'ec2': 'devicon-amazonwebservices-plain-wordmark',

        // Data Tools
        'dbt': 'devicon-dbeaver-plain',
        'snowflake': 'devicon-postgresql-plain',
        'databricks': 'devicon-apachespark-plain',
        'tableau': 'devicon-postgresql-plain',
        'looker': 'devicon-google-plain',
        'powerbi': 'devicon-azure-plain',

        // Containers & Orchestration
        'docker': 'devicon-docker-plain',
        'kubernetes': 'devicon-kubernetes-plain',
        'k8s': 'devicon-kubernetes-plain',

        // Web Frameworks
        'react': 'devicon-react-original',
        'vue': 'devicon-vuejs-plain',
        'angular': 'devicon-angularjs-plain',
        'django': 'devicon-django-plain',
        'flask': 'devicon-flask-original',
        'fastapi': 'devicon-fastapi-plain',
        'nodejs': 'devicon-nodejs-plain',
        'node.js': 'devicon-nodejs-plain',
        'express': 'devicon-express-original',

        // Tools & Platforms
        'git': 'devicon-git-plain',
        'github': 'devicon-github-original',
        'gitlab': 'devicon-gitlab-plain',
        'jenkins': 'devicon-jenkins-plain',
        'terraform': 'devicon-terraform-plain',
        'ansible': 'devicon-ansible-plain',
        'nginx': 'devicon-nginx-original',
        'grafana': 'devicon-grafana-plain',
        'prometheus': 'devicon-prometheus-original',
    };

    // Return the icon class if found, otherwise return a generic code icon
    const iconClass = iconMap[techLower];
    if (iconClass) {
        return `<i class="${iconClass} colored"></i>`;
    }

    // Fallback to generic code icon
    return '<i class="fas fa-code"></i>';
}
