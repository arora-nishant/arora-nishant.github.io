#!/usr/bin/env node

/**
 * RSS Feed Generator
 * Generates RSS feed from posts.json
 * Run: node generate-rss.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://nishantarora.xyz';
const SITE_TITLE = 'Nishant Arora';
const SITE_DESCRIPTION = 'Data Engineer / Builder / Learner';
const AUTHOR_NAME = 'Nishant Arora';
const AUTHOR_EMAIL = 'me@nishantarora.xyz';

// Read posts.json
const postsPath = path.join(__dirname, 'posts', 'posts.json');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));

// Sort posts by date (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Get latest post date for lastBuildDate
const latestDate = posts.length > 0 ? new Date(posts[0].date) : new Date();

// Generate RSS XML
function generateRSS() {
    const items = posts.map(post => {
        const pubDate = new Date(post.date).toUTCString();
        const link = `${SITE_URL}/blog/${post.id}`;
        const guid = link;

        // Escape XML special characters
        const escapeXml = (str) => {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };

        const categories = post.tags ? post.tags.map(tag =>
            `        <category>${escapeXml(tag)}</category>`
        ).join('\n') : '';

        return `    <item>
        <title>${escapeXml(post.title)}</title>
        <link>${link}</link>
        <guid isPermaLink="true">${guid}</guid>
        <pubDate>${pubDate}</pubDate>
        <description>${escapeXml(post.excerpt)}</description>
${categories}
    </item>`;
    }).join('\n\n');

    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />

${items}

</channel>
</rss>`;
}

// Write RSS feed
const rssContent = generateRSS();
const outputPath = path.join(__dirname, 'feed.xml');
fs.writeFileSync(outputPath, rssContent, 'utf-8');

console.log('✓ RSS feed generated successfully at feed.xml');
console.log(`✓ ${posts.length} post(s) included`);
