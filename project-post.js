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

    // DevIcons mapping (use colored class for brand colors)
    const deviconMap = {
        // Languages
        'python': 'devicon-python-plain colored',
        'java': 'devicon-java-plain colored',
        'javascript': 'devicon-javascript-plain colored',
        'typescript': 'devicon-typescript-plain colored',
        'go': 'devicon-go-plain colored',
        'golang': 'devicon-go-plain colored',
        'scala': 'devicon-scala-plain colored',
        'rust': 'devicon-rust-plain colored',
        'c++': 'devicon-cplusplus-plain colored',
        'c': 'devicon-c-plain colored',
        'r': 'devicon-r-plain colored',

        // Data & Analytics
        'kafka': 'devicon-apachekafka-plain colored',
        'apache kafka': 'devicon-apachekafka-plain colored',
        'hadoop': 'devicon-hadoop-plain colored',

        // Databases
        'postgresql': 'devicon-postgresql-plain colored',
        'postgres': 'devicon-postgresql-plain colored',
        'mysql': 'devicon-mysql-plain colored',
        'mongodb': 'devicon-mongodb-plain colored',
        'redis': 'devicon-redis-plain colored',
        'elasticsearch': 'devicon-elasticsearch-plain colored',
        'cassandra': 'devicon-cassandra-plain colored',
        'sql': 'devicon-postgresql-plain colored',

        // Cloud Platforms
        'aws': 'devicon-amazonwebservices-plain-wordmark colored',
        'amazon web services': 'devicon-amazonwebservices-plain-wordmark colored',
        'gcp': 'devicon-googlecloud-plain colored',
        'google cloud': 'devicon-googlecloud-plain colored',
        'azure': 'devicon-azure-plain colored',
        'microsoft azure': 'devicon-azure-plain colored',

        // Containers & Orchestration
        'docker': 'devicon-docker-plain colored',
        'kubernetes': 'devicon-kubernetes-plain colored',
        'k8s': 'devicon-kubernetes-plain colored',

        // Web Frameworks
        'react': 'devicon-react-original colored',
        'vue': 'devicon-vuejs-plain colored',
        'angular': 'devicon-angularjs-plain colored',
        'django': 'devicon-django-plain colored',
        'flask': 'devicon-flask-original colored',
        'fastapi': 'devicon-fastapi-plain colored',
        'nodejs': 'devicon-nodejs-plain colored',
        'node.js': 'devicon-nodejs-plain colored',
        'express': 'devicon-express-original colored',

        // Tools & Platforms
        'git': 'devicon-git-plain colored',
        'github': 'devicon-github-original colored',
        'gitlab': 'devicon-gitlab-plain colored',
        'jenkins': 'devicon-jenkins-plain colored',
        'terraform': 'devicon-terraform-plain colored',
        'ansible': 'devicon-ansible-plain colored',
        'nginx': 'devicon-nginx-original colored',
        'grafana': 'devicon-grafana-plain colored',
        'prometheus': 'devicon-prometheus-original colored',
    };

    // Simple Icons mapping (for tools not in DevIcons)
    const simpleIconMap = {
        // Data Engineering & Analytics
        'airflow': 'si si-apacheairflow',
        'apache airflow': 'si si-apacheairflow',
        'dbt': 'si si-dbt',
        'snowflake': 'si si-snowflake',
        'databricks': 'si si-databricks',
        'tableau': 'si si-tableau',
        'looker': 'si si-looker',
        'powerbi': 'si si-powerbi',
        'apache flink': 'si si-apacheflink',
        'flink': 'si si-apacheflink',
        'spark': 'si si-apachespark',
        'apache spark': 'si si-apachespark',

        // Cloud Services
        'redshift': 'si si-amazonredshift',
        'amazon redshift': 'si si-amazonredshift',
        'bigquery': 'si si-googlebigquery',
        'google bigquery': 'si si-googlebigquery',
        's3': 'si si-amazons3',
        'amazon s3': 'si si-amazons3',
        'lambda': 'si si-awslambda',
        'aws lambda': 'si si-awslambda',

        // Additional tools
        'pandas': 'si si-pandas',
        'numpy': 'si si-numpy',
        'jupyter': 'si si-jupyter',
        'apache': 'si si-apache',
        'pytest': 'si si-pytest',
        'openai': 'si si-openai',
    };

    // Check DevIcons first
    if (deviconMap[techLower]) {
        return `<i class="${deviconMap[techLower]}"></i>`;
    }

    // Check Simple Icons second
    if (simpleIconMap[techLower]) {
        return `<i class="${simpleIconMap[techLower]}"></i>`;
    }

    // Fallback to generic code icon
    return '<i class="fas fa-code"></i>';
}
