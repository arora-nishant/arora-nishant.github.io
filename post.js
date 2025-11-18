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

        // Display the post
        postContent.innerHTML = `
            <h1>${post.title}</h1>
            <div class="post-meta">${formatDate(post.date)}</div>
            <div class="post-body">${content}</div>
        `;

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
