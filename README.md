# Personal Website

A clean, minimalist personal website built for GitHub Pages.

## Features

- **Home**: About me section with introduction
- **Experience**: Professional experience and skills
- **Blog**: Blog posts with easy publishing workflow
- **Contact**: Contact information and social links

## How to Add a New Blog Post

Adding a new blog post is simple and requires just two steps:

### 1. Create the blog post HTML file

Create a new HTML file in the `posts/` directory with your content. For example, `posts/my-new-post.html`:

```html
<p>
    Introduction paragraph for your blog post.
</p>

<h2>Section Heading</h2>

<p>
    Your content here. You can use regular HTML tags for formatting.
</p>

<ul>
    <li>List items</li>
    <li>Work great too</li>
</ul>

<p>
    You can include <code>inline code</code> and code blocks:
</p>

<pre><code>function example() {
    console.log("Hello, world!");
}
</code></pre>
```

### 2. Add an entry to posts.json

Edit `posts/posts.json` and add a new entry for your post:

```json
{
    "id": "my-new-post",
    "title": "My New Blog Post",
    "date": "2025-01-20",
    "excerpt": "A brief summary of what this post is about.",
    "file": "my-new-post.html"
}
```

That's it! Your new post will automatically appear on the blog page.

## Customization

### Update Personal Information

Edit `index.html` to update:
- Your name and tagline
- About me section
- Experience and skills
- Contact links

### Styling

The site uses a minimalist design with CSS variables for easy customization. Edit `style.css` and modify the variables in `:root`:

```css
:root {
    --text-primary: #2c2c2c;
    --text-secondary: #666;
    --text-light: #999;
    --border-color: #e0e0e0;
    --accent: #0066cc;
    --bg-main: #ffffff;
    --bg-alt: #fafafa;
}
```

## Local Development

To test locally, you can use any simple HTTP server. For example:

```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Deployment

This site is designed for GitHub Pages. Simply push to your repository and it will be automatically deployed to `https://yourusername.github.io`.

## License

Feel free to use this as a template for your own personal website!
