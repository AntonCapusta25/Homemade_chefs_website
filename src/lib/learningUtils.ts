/**
 * Utility functions for learning platform content sanitization and formatting
 */

export interface LearningPageData {
    id: number;
    title: string;
    slug: string;
    body_content: string;
    hero_image: string | null;
    youtube_url: string | null;
    meta_description: string | null;
    language: string;
    is_premium?: boolean;
    progress?: number;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats or ID strings.
 */
export function extractYouTubeId(url: string): string {
    if (!url) return '';
    if (url.length === 11 && !url.includes('/') && !url.includes('.')) return url;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return '';
}

/**
 * Extracts clean text snippet from HTML for card previews, stripping HTML tags and bare URLs.
 */
export function getTextSnippet(html: string, maxLength: number = 100): string {
    if (!html) return '';
    // Strip URLs so bare URLs don't appear in snippet previews
    const noUrls = html.replace(/https?:\/\/[^\s<"']+/gi, '');
    const text = noUrls.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * Cleans meta description: returns empty string if the meta description is just a raw URL.
 */
export function cleanMetaDescription(desc: string | null | undefined): string {
    if (!desc) return '';
    const trimmed = desc.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return '';
    }
    return trimmed;
}

/**
 * Formats HTML body content: converts any bare plain-text URLs into styled, clickable <a> tags.
 */
export function formatBodyContent(html: string): string {
    if (!html) return '';
    
    // Replace bare URLs (not inside href="", src="", or already inside <a> tags) with styled <a> tags
    return html.replace(
        /(?<!href=["']|src=["']|>)(https?:\/\/[^\s<"']+)/gi,
        (match) => `<a href="${match}" target="_blank" rel="noopener noreferrer" class="text-[#F47A44] underline hover:text-[#d6602d] transition-colors">${match}</a>`
    );
}
