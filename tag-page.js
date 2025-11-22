// Load and display posts for a specific tag
document.addEventListener('DOMContentLoaded', async () => {
    const tagTitle = document.getElementById('tag-title');
    const tagPosts = document.getElementById('tag-posts');

    try {
        // Extract tag from query parameter: /blog/tags/?tag=personal
        const urlParams = new URLSearchParams(window.location.search);
        const tag = urlParams.get('tag');

        if (!tag) {
            tagTitle.textContent = 'Tag not found';
            tagPosts.innerHTML = '<p>Please select a valid tag.</p>';
            return;
        }

        // Update title
        const displayTag = tag.replace(/-/g, ' ');
        tagTitle.textContent = `Posts tagged: ${displayTag}`;
        document.title = `${displayTag} - Blog Tags - Nishant Arora`;

        // Fetch posts
        const response = await fetch('/posts/posts.json');
        const posts = await response.json();

        // Filter posts by tag
        const taggedPosts = posts.filter(post =>
            post.tags && post.tags.includes(tag)
        );

        if (taggedPosts.length === 0) {
            tagPosts.innerHTML = '<p>No posts found with this tag.</p>';
            return;
        }

        // Display posts
        tagPosts.innerHTML = taggedPosts.map(post => {
            const tagsHTML = post.tags.map(t =>
                `<a href="/blog/tags/?tag=${t}" class="tag-link">${t}</a>`
            ).join('');

            return `
                <div class="blog-post">
                    <h2 class="blog-post-title">
                        <a href="/blog/${post.id}">${post.title}</a>
                    </h2>
                    <div class="blog-post-date">${post.date}</div>
                    <div class="post-tags">${tagsHTML}</div>
                    <p class="blog-post-excerpt">${post.excerpt}</p>
                    <a href="/blog/${post.id}" class="blog-post-link">Read more →</a>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading tag page:', error);
        tagPosts.innerHTML = '<p>Error loading posts. Please try again later.</p>';
    }
});
