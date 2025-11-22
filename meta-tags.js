/**
 * Dynamic Open Graph Meta Tags
 * Sets OG tags dynamically for blog posts
 */

(function() {
    const SITE_URL = 'https://nishanarora.com';
    const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.png`; // Create this image
    const SITE_NAME = 'Nishant Arora';

    function setMetaTag(property, content) {
        if (!content) return;

        // Check if meta tag already exists
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    function setTwitterCard(name, content) {
        if (!content) return;

        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    // Wait for page to load if it's a blog post
    if (window.location.pathname.includes('/blog/')) {
        // This will be set by the blog-post.js after loading post data
        window.setPostMetaTags = function(post) {
            const url = `${SITE_URL}${window.location.pathname}`;
            const title = post.title;
            const description = post.excerpt;
            const image = post.image ? `${SITE_URL}${post.image}` : DEFAULT_IMAGE;

            // Open Graph tags
            setMetaTag('og:type', 'article');
            setMetaTag('og:url', url);
            setMetaTag('og:title', title);
            setMetaTag('og:description', description);
            setMetaTag('og:image', image);
            setMetaTag('og:site_name', SITE_NAME);
            setMetaTag('article:published_time', post.date);
            if (post.tags && post.tags.length > 0) {
                post.tags.forEach(tag => {
                    const tagMeta = document.createElement('meta');
                    tagMeta.setAttribute('property', 'article:tag');
                    tagMeta.setAttribute('content', tag);
                    document.head.appendChild(tagMeta);
                });
            }

            // Twitter Card tags
            setTwitterCard('twitter:card', 'summary_large_image');
            setTwitterCard('twitter:url', url);
            setTwitterCard('twitter:title', title);
            setTwitterCard('twitter:description', description);
            setTwitterCard('twitter:image', image);
        };
    }
})();
