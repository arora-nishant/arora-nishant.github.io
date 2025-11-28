# Personal Website

A clean, classy, and minimalist personal website built for GitHub Pages. Inspired by elegant designs with a focus on readability and user experience.

## Features

- **Home**: About me section with circular profile picture
- **Experience**: Professional experience and skills showcase
- **Blog**: Write posts in Markdown with syntax highlighting (100+ languages!)
- **Resume**: PDF viewer with download option
- **Contact**: Social links with icons + FREE contact form that sends to your email
- **Beautiful Design**: Greyish side borders, elegant fonts (Lora + Inter), unified blue theme
- **Clean URLs**: / for home, /blog, /experience, /contact, /resume
- **Markdown Support**: Full GFM support with code highlighting, tables, images, and more
- **Fully Responsive**: Looks great on desktop, tablet, and mobile

## How to Add a New Blog Post

Adding a new blog post is simple and requires just **two steps** + running the build script:

### 1. Create your blog post in Markdown

Create a new Markdown file in the `posts/` directory. For example, `posts/my-new-post.md`:

```markdown
Introduction paragraph for your blog post. Write naturally in markdown!

## Section Heading

Your content here. Markdown makes it easy to format text:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- [Links](https://example.com) are simple
- Lists are automatic

### Code Examples

Inline code uses backticks: `const x = 42`

Code blocks with syntax highlighting:

\`\`\`javascript
function greet(name) {
    console.log(`Hello, ${name}!`);
    return true;
}
\`\`\`

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

### Images

![Alt text](image.jpg)

### Tables

| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Syntax Highlighting | ✅ |
| Images | ✅ |

---

Use horizontal rules to separate sections.
```

**Supported Features:**
- ✅ Headings (H1-H6)
- ✅ Bold, italic, strikethrough
- ✅ Lists (ordered and unordered)
- ✅ Links and images
- ✅ Code blocks with syntax highlighting (100+ languages)
- ✅ Tables
- ✅ Blockquotes
- ✅ Horizontal rules
- ✅ GitHub Flavored Markdown (GFM)

### 2. Add an entry to posts.json

Edit `posts/posts.json` and add a new entry for your post:

```json
{
    "id": "my-new-post",
    "title": "My New Blog Post",
    "date": "2025-01-20",
    "excerpt": "A brief summary of what this post is about.",
    "file": "my-new-post.md"
}
```

**Note:** Use `.md` extension for Markdown files. The system auto-detects and renders markdown appropriately.

### 3. Run the build script

After adding your markdown file and updating `posts.json`, run the build script to auto-generate the blog page:

```bash
node build-pages.js
```

This script will:
- ✅ Read `posts/posts.json` and create `/blog/{post-id}/index.html` for each post
- ✅ Read `projects/projects.json` and create `/projects/{project-id}/index.html` for each project
- ✅ Ensure correct navigation bar order across all pages
- ✅ Set up proper meta tags for social media sharing

That's it! Your new post will automatically appear on the blog page with full markdown rendering and syntax highlighting.

## How to Add a New Project

Adding a new project follows the same simple process:

### 1. Create your project description in Markdown

Create a new Markdown file in the `projects-content/` directory. For example, `projects-content/my-project.md`:

```markdown
A brief overview of your project, what it does, and why you built it.

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Technical Details

Explain the architecture, technologies used, and interesting technical challenges.

## Results

Share outcomes, metrics, or lessons learned.
```

### 2. Add an entry to projects.json

Edit `projects/projects.json` and add a new entry:

```json
{
    "id": "my-project",
    "title": "My Awesome Project",
    "description": "A brief description of what this project does",
    "tech": ["Python", "Docker", "AWS", "PostgreSQL"],
    "file": "my-project.md"
}
```

The `tech` array accepts any technology names - the system will automatically display appropriate icons if available.

### 3. Run the build script

```bash
node build-pages.js
```

Your project page will be generated at `/projects/my-project/` with full markdown support!

## Customization

### Update Personal Information

Edit the HTML files to update:
- **index.html**: Your tagline and about me section
- **contact.html**: Contact links (email, GitHub, LinkedIn)
- Update "Nishant Arora" in all files with your name

### Update Experience and Skills (Easy!)

Your experience and skills are now data-driven! Simply edit `data.json`:

```json
{
  "experience": [
    {
      "title": "Your Job Title",
      "company": "Company Name",
      "period": "Start - End",
      "description": "What you did and technologies used."
    }
  ],
  "skills": [
    "Skill 1",
    "Skill 2",
    "Skill 3"
  ]
}
```

Add, remove, or modify entries - the website will automatically load and display them!

### Add Your Profile Picture

1. Add your photo as `profile.jpg` in the root directory
2. The image should be square (or will be cropped to circle)
3. Recommended size: at least 500x500 pixels for best quality
4. Supported formats: JPG, PNG, or any web-friendly format

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

## RSS Feed

Your website includes an RSS feed at `/feed.xml` that allows readers to subscribe to your blog.

### Updating the RSS Feed

After adding new blog posts, regenerate the RSS feed:

```bash
node generate-rss.js
```

This script reads `posts/posts.json` and automatically generates the RSS feed with all your posts.

The RSS link is displayed in the footer of every page for easy subscription.

## Open Graph Meta Tags

Open Graph (OG) tags are included on all pages to provide rich previews when your links are shared on social media (Facebook, Twitter, LinkedIn, Slack, etc.).

### Required: Create OG Default Image

Create a default Open Graph image:

1. **Size**: 1200x630 pixels (1.91:1 ratio)
2. **Location**: Save as `images/og-default.png`
3. **Content**: Include your name and tagline
4. **Tools**: Use Canva, Figma, or any image editor

See `images/OG-IMAGE-README.txt` for detailed instructions.

### Dynamic OG Tags for Blog Posts

Blog posts automatically set their OG tags based on post metadata:
- Title from post title
- Description from post excerpt
- Tags as article tags
- Custom image if specified in `posts.json` (optional `image` field)

## Dark Mode

The website includes a dark mode toggle:
- Click the moon/sun icon in the navigation
- Preference is saved automatically
- Respects system dark mode preference
- Works seamlessly across all pages

## Technology Stack

- **HTML5** for semantic structure
- **CSS3** with CSS Variables for theming
- **Vanilla JavaScript** for functionality
- **Markdown** with marked.js for blog posts
- **Syntax Highlighting** with highlight.js (Atom One Light theme)
- **Icons** from Font Awesome 6
- **Fonts**: Charter for headings, system fonts for body

