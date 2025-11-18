# Personal Website

A clean, classy, and minimalist personal website built for GitHub Pages. Inspired by elegant designs with a focus on readability and user experience.

## Features

- **Home**: About me section with circular profile picture
- **Experience**: Professional experience and skills showcase
- **Blog**: Blog posts with easy publishing workflow
- **Resume**: PDF viewer with download option
- **Contact**: Social links with icons + FREE contact form that sends to your email
- **Beautiful Design**: Greyish side borders, elegant fonts (Lora + Inter), unified blue theme
- **Clean URLs**: / for home, /blog, /experience, /contact, /resume
- **Fully Responsive**: Looks great on desktop, tablet, and mobile

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

Edit the HTML files to update:
- **index.html**: Your tagline and about me section
- **experience.html**: Your work experience and skills
- **contact.html**: Contact links (email, GitHub, LinkedIn, Twitter)
- Update "Nishant Arora" in all files with your name

### Add Your Profile Picture

1. Add your photo as `profile.jpg` in the root directory
2. The image should be square (or will be cropped to circle)
3. Recommended size: at least 500x500 pixels for best quality
4. Supported formats: JPG, PNG, or any web-friendly format

If you don't add a profile picture, you'll see a placeholder message prompting you to add one.

### Add Your Resume

1. Add your resume PDF as `resume.pdf` in the root directory
2. The resume page will automatically display it with a download button
3. If the PDF fails to load, users will see a download link instead

### Set Up the Contact Form (FREE!)

The website includes a contact form that sends messages directly to your email using [Formspree](https://formspree.io/) - completely free for up to 50 submissions per month.

**Setup steps:**
1. Go to [https://formspree.io/](https://formspree.io/) and sign up for a free account
2. Create a new form and get your form endpoint (looks like `https://formspree.io/f/YOUR_FORM_ID`)
3. In `index.html`, find the contact form and replace `YOUR_FORM_ID` with your actual form ID:
   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. Done! Messages will now be sent to your email

### Styling

The site uses a classy, minimalist design with CSS variables for easy customization. Edit `style.css` and modify the variables in `:root`:

```css
:root {
    --text-primary: #1a1a1a;
    --text-secondary: #555;
    --text-light: #888;
    --accent-blue: #3b82f6;
    --accent-green: #10b981;
    --accent-purple: #8b5cf6;
    --accent-orange: #f59e0b;
    --bg-main: #ffffff;
    --bg-alt: #f8f8f8;
    --bg-border: #e8e8e8;
}
```

### Fonts

The site uses:
- **Lora** (serif) for headings - elegant and classic
- **Inter** (sans-serif) for body text - modern and readable

Both fonts are loaded from Google Fonts.

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
