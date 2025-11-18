// Load and display blog posts
document.addEventListener('DOMContentLoaded', async () => {
    const blogPostsContainer = document.getElementById('blog-posts');

    try {
        // Fetch the blog posts list
        const response = await fetch('posts/posts.json');
        const posts = await response.json();

        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Display each post
        posts.forEach(post => {
            const postElement = createPostElement(post);
            blogPostsContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogPostsContainer.innerHTML = '<p>No blog posts available yet. Check back soon!</p>';
    }
});

function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post';

    const title = document.createElement('h3');
    title.className = 'blog-post-title';

    const titleLink = document.createElement('a');
    titleLink.href = `post.html?id=${post.id}`;
    titleLink.textContent = post.title;
    title.appendChild(titleLink);

    const date = document.createElement('div');
    date.className = 'blog-post-date';
    date.textContent = formatDate(post.date);

    const excerpt = document.createElement('p');
    excerpt.className = 'blog-post-excerpt';
    excerpt.textContent = post.excerpt;

    const readMore = document.createElement('a');
    readMore.href = `post.html?id=${post.id}`;
    readMore.className = 'blog-post-link';
    readMore.textContent = 'Read more →';

    article.appendChild(title);
    article.appendChild(date);
    article.appendChild(excerpt);
    article.appendChild(readMore);

    return article;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
