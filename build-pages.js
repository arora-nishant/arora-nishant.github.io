#!/usr/bin/env node

/**
 * Build script to auto-generate blog and project pages
 *
 * This script reads posts.json and projects.json and creates
 * the necessary directory structure and index.html files for each entry.
 *
 * Usage: node build-pages.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Blog post template - generates index.html for each blog post
 */
function getBlogPostTemplate(post) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Post - Nishant Arora</title>

    <!-- Open Graph / Facebook - Defaults (will be updated dynamically) -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://nishanarora.com/blog/${post.id}">
    <meta property="og:title" content="${post.title} - Nishant Arora">
    <meta property="og:description" content="${post.excerpt}">
    <meta property="og:image" content="https://nishanarora.com/images/og-default.png">
    <meta property="og:site_name" content="Nishant Arora">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://nishanarora.com/blog/${post.id}">
    <meta name="twitter:title" content="${post.title} - Nishant Arora">
    <meta name="twitter:description" content="${post.excerpt}">
    <meta name="twitter:image" content="https://nishanarora.com/images/og-default.png">

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="Nishant Arora" href="https://nishanarora.com/feed.xml">

    <script src="/meta-tags.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <link rel="stylesheet" href="/style.css">
    <script src="/theme.js"></script>
</head>
<body>
    <header>
        <div class="header-content">
            <div class="site-name">
                <a href="/">Nishant Arora</a>
            </div>
            <nav>
                <a href="/" class="nav-link">Home</a>
                <a href="/experience" class="nav-link">Experience</a>
                <a href="/projects" class="nav-link">Projects</a>
                <a href="/blog" class="nav-link active">Blog</a>
                <a href="/contact" class="nav-link">Contact</a>
            <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
                    <i id="theme-toggle-dark-icon" class="fas fa-moon"></i>
                    <i id="theme-toggle-light-icon" class="fas fa-sun" style="display: none;"></i>
                </button>
            </nav>
        </div>
    </header>

    <main>
        <section class="section active">
            <div class="content">
                <a href="/blog" class="back-link">← Back to Blog</a>
                <article id="post-content" class="post-content">
                    <!-- Post content will be loaded here -->
                </article>
            </div>
        </section>
    </main>

    <footer>
        <p>
            &copy; 2025 Nishant Arora. All rights reserved.
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="/feed.xml" class="rss-link" title="Subscribe via RSS">
                <i class="fas fa-rss"></i> RSS
            </a>
        </p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/scala.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/sql.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/plaintext.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
    <script src="/blog-post.js"></script>
</body>
</html>
`;
}

/**
 * Project template - generates index.html for each project
 */
function getProjectTemplate(project) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project - Nishant Arora</title>

    <!-- Open Graph / Facebook - Defaults (will be updated dynamically) -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://nishanarora.com/projects/${project.id}">
    <meta property="og:title" content="${project.title} - Nishant Arora">
    <meta property="og:description" content="${project.description}">
    <meta property="og:image" content="https://nishanarora.com/images/og-default.png">
    <meta property="og:site_name" content="Nishant Arora">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://nishanarora.com/projects/${project.id}">
    <meta name="twitter:title" content="${project.title} - Nishant Arora">
    <meta name="twitter:description" content="${project.description}">
    <meta name="twitter:image" content="https://nishanarora.com/images/og-default.png">

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="Nishant Arora" href="https://nishanarora.com/feed.xml">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/simple-icons-font@v11/font/simple-icons.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <link rel="stylesheet" href="/style.css">
    <script src="/theme.js"></script>
</head>
<body>
    <header>
        <div class="header-content">
            <div class="site-name">
                <a href="/">Nishant Arora</a>
            </div>
            <nav>
                <a href="/" class="nav-link">Home</a>
                <a href="/experience" class="nav-link">Experience</a>
                <a href="/projects" class="nav-link active">Projects</a>
                <a href="/blog" class="nav-link">Blog</a>
                <a href="/contact" class="nav-link">Contact</a>
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
                    <i id="theme-toggle-dark-icon" class="fas fa-moon"></i>
                    <i id="theme-toggle-light-icon" class="fas fa-sun" style="display: none;"></i>
                </button>
            </nav>
        </div>
    </header>

    <main>
        <section class="section active">
            <div class="content">
                <a href="/projects" class="back-link">← Back to Projects</a>
                <article id="project-content" class="post-content">
                    <!-- Project content will be loaded here -->
                </article>
            </div>
        </section>
    </main>

    <footer>
        <p>
            &copy; 2025 Nishant Arora. All rights reserved.
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="/feed.xml" class="rss-link" title="Subscribe via RSS">
                <i class="fas fa-rss"></i> RSS
            </a>
        </p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/scala.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/sql.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/plaintext.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
    <script src="/project-post.js"></script>
</body>
</html>
`;
}

/**
 * Build blog post pages
 */
function buildBlogPages() {
    log('\n📝 Building blog pages...', 'blue');

    const postsJsonPath = path.join(__dirname, 'posts', 'posts.json');

    // Check if posts.json exists
    if (!fs.existsSync(postsJsonPath)) {
        log('❌ posts/posts.json not found', 'red');
        return false;
    }

    // Read posts.json
    const postsData = fs.readFileSync(postsJsonPath, 'utf-8');
    const posts = JSON.parse(postsData);

    log(`Found ${posts.length} blog posts`, 'yellow');

    // Create blog directory if it doesn't exist
    const blogDir = path.join(__dirname, 'blog');
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
    }

    // Generate index.html for each post
    let successCount = 0;
    for (const post of posts) {
        try {
            const postDir = path.join(blogDir, post.id);

            // Create post directory
            if (!fs.existsSync(postDir)) {
                fs.mkdirSync(postDir, { recursive: true });
            }

            // Generate and write index.html
            const html = getBlogPostTemplate(post);
            const indexPath = path.join(postDir, 'index.html');
            fs.writeFileSync(indexPath, html, 'utf-8');

            log(`  ✓ Created /blog/${post.id}/index.html`, 'green');
            successCount++;
        } catch (error) {
            log(`  ✗ Failed to create /blog/${post.id}/: ${error.message}`, 'red');
        }
    }

    log(`✅ Successfully built ${successCount}/${posts.length} blog pages\n`, 'green');
    return successCount === posts.length;
}

/**
 * Build project pages
 */
function buildProjectPages() {
    log('🚀 Building project pages...', 'blue');

    const projectsJsonPath = path.join(__dirname, 'projects', 'projects.json');

    // Check if projects.json exists
    if (!fs.existsSync(projectsJsonPath)) {
        log('❌ projects/projects.json not found', 'red');
        return false;
    }

    // Read projects.json
    const projectsData = fs.readFileSync(projectsJsonPath, 'utf-8');
    const projects = JSON.parse(projectsData);

    log(`Found ${projects.length} projects`, 'yellow');

    // Create projects directory if it doesn't exist
    const projectsDir = path.join(__dirname, 'projects');
    if (!fs.existsSync(projectsDir)) {
        fs.mkdirSync(projectsDir, { recursive: true });
    }

    // Generate index.html for each project
    let successCount = 0;
    for (const project of projects) {
        try {
            const projectDir = path.join(projectsDir, project.id);

            // Create project directory
            if (!fs.existsSync(projectDir)) {
                fs.mkdirSync(projectDir, { recursive: true });
            }

            // Generate and write index.html
            const html = getProjectTemplate(project);
            const indexPath = path.join(projectDir, 'index.html');
            fs.writeFileSync(indexPath, html, 'utf-8');

            log(`  ✓ Created /projects/${project.id}/index.html`, 'green');
            successCount++;
        } catch (error) {
            log(`  ✗ Failed to create /projects/${project.id}/: ${error.message}`, 'red');
        }
    }

    log(`✅ Successfully built ${successCount}/${projects.length} project pages\n`, 'green');
    return successCount === projects.length;
}

/**
 * Main build function
 */
function main() {
    log('═══════════════════════════════════════════', 'blue');
    log('   Blog & Project Pages Build Script', 'blue');
    log('═══════════════════════════════════════════', 'blue');

    const blogSuccess = buildBlogPages();
    const projectSuccess = buildProjectPages();

    if (blogSuccess && projectSuccess) {
        log('═══════════════════════════════════════════', 'green');
        log('   ✨ Build completed successfully! ✨', 'green');
        log('═══════════════════════════════════════════', 'green');
        process.exit(0);
    } else {
        log('═══════════════════════════════════════════', 'red');
        log('   ⚠️  Build completed with errors', 'red');
        log('═══════════════════════════════════════════', 'red');
        process.exit(1);
    }
}

// Run the build
main();
