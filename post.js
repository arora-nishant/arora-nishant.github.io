// Load and display individual blog post
document.addEventListener('DOMContentLoaded', async () => {
    const postContent = document.getElementById('post-content');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        postContent.innerHTML = '<p>Blog post not found.</p>';
        return;
    }

    try {
        // Fetch the posts list to get post metadata
        const postsResponse = await fetch('posts/posts.json');
        const posts = await postsResponse.json();
        const post = posts.find(p => p.id === postId);

        if (!post) {
            postContent.innerHTML = '<p>Blog post not found.</p>';
            return;
        }

        // Update page title
        document.title = `${post.title} - Nishant Arora`;

        // Fetch the post content
        const contentResponse = await fetch(`posts/${post.file}`);
        const content = await contentResponse.text();

        // Check if it's a markdown file
        const isMarkdown = post.file.endsWith('.md');
        let htmlContent = content;

        if (isMarkdown) {
            // Configure marked for better rendering
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

            // Parse markdown to HTML
            htmlContent = marked.parse(content);
        }

        // Display the post
        postContent.innerHTML = `
            <h1>${post.title}</h1>
            <div class="post-meta">${formatDate(post.date)}</div>
            <div class="post-body">${htmlContent}</div>
        `;

        // Highlight code blocks if not already done by marked
        if (!isMarkdown) {
            postContent.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }

    } catch (error) {
        console.error('Error loading blog post:', error);
        postContent.innerHTML = '<p>Error loading blog post. Please try again later.</p>';
    }
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
