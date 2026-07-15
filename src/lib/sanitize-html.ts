/**
 * Sanitize and transform HTML content for blog posts.
 *
 * Handles AI/editor-generated content that uses:
 *  - <p><strong>Heading</strong></p>  →  <h2> / <h3>
 *  - Lines starting with "- " or "• " inside <p> →  <ul><li>
 *  - Plain-text "Item - description" list lines  →  <ul><li>
 *  - H1 tags → H2 (SEO: only one H1 per page)
 */
export function sanitizeBlogHTML(html: string): string {
    if (!html) return '';

    let s = html;

    // ─── 1. PROMOTE BOLD-ONLY PARAGRAPHS TO HEADINGS ─────────────────────────
    // Pattern: <p> containing ONLY <strong>…</strong> or <b>…</b> (no other text)
    // First promoted heading → h2, subsequent ones → h3.
    let headingIndex = 0;
    s = s.replace(
        /<p([^>]*)>\s*<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>\s*<\/p>/gi,
        (_match, pAttrs, innerContent) => {
            const text = innerContent.replace(/<[^>]*>/g, '').trim();
            // Skip very short (likely inline) or sentence-style text with mid-text punctuation that's clearly not a heading
            if (!text || text.length > 100) return _match;
            const level = headingIndex === 0 ? 2 : 3;
            headingIndex++;
            return `<h${level}${pAttrs}>${innerContent}</h${level}>`;
        }
    );

    // ─── 2. CONVERT INLINE BOLD HEADINGS (not wrapped in <p>) ────────────────
    // Pattern: standalone <strong>Short heading text</strong> followed by <br> or </p>
    // (Some editors produce this without a wrapping <p>)
    // We leave this for now — covered by step 1 for most cases.

    // ─── 3. PROMOTE H1 → H2 (SEO) ───────────────────────────────────────────
    s = s.replace(/<h1([^>]*)>/gi, '<h2$1>');
    s = s.replace(/<\/h1>/gi, '</h2>');

    // ─── 4. DETECT LIST LINES INSIDE <p> TAGS ────────────────────────────────
    // Some blog content has multiple lines inside a single <p>, separated by <br>,
    // where each line looks like a list item ("- Item" / "• Item" / "* Item").
    // Split such paragraphs and rebuild as <ul>.
    s = s.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (_match, attrs, inner) => {
        // Normalise <br> variants to a real newline for splitting
        const normalised = inner
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/\n{2,}/g, '\n');

        const lines = normalised.split('\n').map((l: string) => l.trim()).filter(Boolean);

        // Count how many lines look like bullet / dash items
        const bulletRe = /^[-•*]\s+/;
        const bulletLines = lines.filter((l: string) => bulletRe.test(l));

        // If at least half of the lines (and more than one) are bullet-style, wrap as list
        if (bulletLines.length > 1 && bulletLines.length >= lines.length * 0.5) {
            const items = lines.map((l: string) => {
                const text = l.replace(bulletRe, '').trim();
                return `<li>${text}</li>`;
            });
            return `<ul>${items.join('')}</ul>`;
        }

        // Otherwise reconstruct as normal paragraph (joining lines with spaces)
        return `<p${attrs}>${lines.join(' ')}</p>`;
    });

    // ─── 5. CONVERT "Word/Phrase - description" LINES TO LIST ITEMS ──────────
    // Pattern: a <p> that contains ONLY a short label followed by " - " and description,
    // AND appears adjacent to other such paragraphs.
    // We look for runs of consecutive <p> elements that all follow the pattern.
    // Strategy: collect them, then replace with a single <ul>.
    s = s.replace(
        /(<p[^>]*>[^<]{1,60} [-–] [^<]+<\/p>\s*){2,}/gi,
        (block) => {
            const items = block.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_m: string, content: string) => {
                return `<li>${content.trim()}</li>`;
            });
            return `<ul>${items}</ul>`;
        }
    );

    // ─── 6. ADD IDS TO HEADINGS (anchor links) ────────────────────────────────
    s = s.replace(/<h([2-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_m, level, attrs, content) => {
        const cleanAttrs = attrs.replace(/\s*id="[^"]*"/gi, '').replace(/\s*id='[^']*'/gi, '');
        const slug = content
            .replace(/<[^>]*>/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return `<h${level}${cleanAttrs} id="${slug}">${content}</h${level}>`;
    });

    // ─── 7. SPACING CLEANUP ───────────────────────────────────────────────────
    s = s.replace(/<\/p>\s*<p/gi, '</p>\n\n<p');
    s = s.replace(/<\/h([2-6])>\s*<p/gi, '</h$1>\n\n<p');
    s = s.replace(/<\/p>\s*<h([2-6])/gi, '</p>\n\n<h$1');
    s = s.replace(/<\/ul>\s*<p/gi, '</ul>\n\n<p');
    s = s.replace(/<\/p>\s*<ul/gi, '</p>\n\n<ul');

    // ─── 8. STRIP EMPTY / WHITESPACE-ONLY PARAGRAPHS ─────────────────────────
    s = s.replace(/<p[^>]*>\s*(<br\s*\/?>|\s|&nbsp;)*\s*<\/p>/gi, '');

    // ─── 9. STRIP STRAY BR TAGS AT START/END OF PARAGRAPHS ───────────────────
    s = s.replace(/<p([^>]*)>\s*(<br\s*\/?>)+/gi, '<p$1>');
    s = s.replace(/(<br\s*\/?>)+\s*<\/p>/gi, '</p>');

    // ─── 10. COLLAPSE EMPTY ATTRIBUTES ───────────────────────────────────────
    s = s.replace(/\s*id=""\s*/g, ' ');
    s = s.replace(/\s*class=""\s*/g, ' ');

    // ─── 11. COLLAPSE EXCESSIVE NEWLINES ─────────────────────────────────────
    s = s.replace(/\n{3,}/g, '\n\n');

    return s.trim();
}
