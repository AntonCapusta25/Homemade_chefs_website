/**
 * Sanitize and transform HTML content for blog posts
 * - Converts H1 tags to H2 (SEO: only one H1 per page)
 * - Ensures proper heading hierarchy
 * - Adds proper spacing and structure
 * - Cleans up formatting issues
 */
export function sanitizeBlogHTML(html: string): string {
    if (!html) return '';

    let sanitized = html;

    // Convert all H1 tags to H2 (page title is the only H1)
    sanitized = sanitized.replace(/<h1([^>]*)>/gi, '<h2$1>');
    sanitized = sanitized.replace(/<\/h1>/gi, '</h2>');

    // Ensure proper ID attributes for headings (for anchor links)
    sanitized = sanitized.replace(/<h([2-6])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, content) => {
        // Remove existing id attribute if present
        const cleanAttrs = attrs.replace(/id="[^"]*"/gi, '').replace(/id='[^']*'/gi, '');
        // Create slug from content
        const slug = content
            .toLowerCase()
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

        return `<h${level}${cleanAttrs} id="${slug}">${content}</h${level}>`;
    });

    // Fix paragraphs that are missing proper spacing
    sanitized = sanitized.replace(/<\/p>\s*<p/gi, '</p>\n\n<p');

    // Add spacing after headings
    sanitized = sanitized.replace(/<\/h([2-6])>\s*<p/gi, '</h$1>\n\n<p');

    // Add spacing before headings
    sanitized = sanitized.replace(/<\/p>\s*<h([2-6])/gi, '</p>\n\n<h$1');

    // Fix list spacing
    sanitized = sanitized.replace(/<\/ul>\s*<p/gi, '</ul>\n\n<p');
    sanitized = sanitized.replace(/<\/ol>\s*<p/gi, '</ol>\n\n<p');
    sanitized = sanitized.replace(/<\/p>\s*<ul/gi, '</p>\n\n<ul');
    sanitized = sanitized.replace(/<\/p>\s*<ol/gi, '</p>\n\n<ol');

    // Clean up empty paragraphs
    sanitized = sanitized.replace(/<p[^>]*>\s*<\/p>/gi, '');

    // Clean up paragraphs with only &nbsp; or whitespace
    sanitized = sanitized.replace(/<p[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '');

    // Clean up multiple consecutive <br> tags (max 2)
    sanitized = sanitized.replace(/(<br\s*\/?>){3,}/gi, '<br /><br />');

    // Remove <br> tags at the start of paragraphs
    sanitized = sanitized.replace(/<p([^>]*)>\s*(<br\s*\/?>)+/gi, '<p$1>');

    // Remove <br> tags at the end of paragraphs
    sanitized = sanitized.replace(/(<br\s*\/?>)+\s*<\/p>/gi, '</p>');

    // Clean up empty attributes
    sanitized = sanitized.replace(/id=""/g, '');
    sanitized = sanitized.replace(/id=''/g, '');
    sanitized = sanitized.replace(/class=""/g, '');
    sanitized = sanitized.replace(/class=''/g, '');

    // Trim excessive whitespace while preserving structure
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

    return sanitized.trim();
}
