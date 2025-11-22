// Load and display blog post from clean URL structure
document.addEventListener('DOMContentLoaded', async () => {
    const postContent = document.getElementById('post-content');

    try {
        // Extract post ID from URL path: /blog/{post-id}/
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const postId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

        if (!postId) {
            postContent.innerHTML = '<p>Post not found.</p>';
            return;
        }

        // Fetch posts metadata
        const response = await fetch('/posts/posts.json');
        const posts = await response.json();

        // Find the post
        const post = posts.find(p => p.id === postId);

        if (!post) {
            postContent.innerHTML = '<p>Post not found.</p>';
            return;
        }

        // Update page title
        document.title = `${post.title} - Nishant Arora`;

        // Update Open Graph meta tags if function is available
        if (window.setPostMetaTags) {
            window.setPostMetaTags(post);
        }

        // Fetch post content
        const contentResponse = await fetch(`/posts/${post.file}`);
        const content = await contentResponse.text();

        // Check if it's markdown
        const isMarkdown = post.file.endsWith('.md');
        let htmlContent;

        if (isMarkdown) {
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
        } else {
            htmlContent = content;
        }

        // Build post HTML with tags
        let tagsHTML = '';
        if (post.tags && post.tags.length > 0) {
            const tagLinks = post.tags.map(tag =>
                `<a href="/blog/tags/?tag=${tag}" class="tag-link">${tag}</a>`
            ).join('');
            tagsHTML = `<div class="post-tags">${tagLinks}</div>`;
        }

        postContent.innerHTML = `
            <h1>${post.title}</h1>
            <div class="post-meta">${post.date}</div>
            ${tagsHTML}
            <div class="post-body">${htmlContent}</div>
        `;

        // Highlight all code blocks
        if (isMarkdown) {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }

    } catch (error) {
        console.error('Error loading post:', error);
        postContent.innerHTML = '<p>Error loading post. Please try again later.</p>';
    }
});
