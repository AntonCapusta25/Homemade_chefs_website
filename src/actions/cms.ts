'use server';

import { createClient } from '@/lib/supabase/server';
import { createStaticClient } from '@/lib/supabase/server-static';

/**
 * Get all content sections from the database
 * Returns content organized by page
 */
export async function getContent() {
    try {
        const supabase = await createClient();

        const { data: sections, error } = await supabase
            .from('content_sections')
            .select('*');

        if (error) {
            console.error('Error fetching content:', error);
            return {};
        }

        // Transform array of sections into nested object structure
        // e.g., { home: { hero: {...}, cta: {...} }, join: { hero: {...} } }
        const content: Record<string, Record<string, any>> = {};

        sections?.forEach((section) => {
            const [page, key] = section.section_key.split('.');

            if (!content[page]) {
                content[page] = {};
            }

            content[page][key] = section.data;
        });

        return content;
    } catch (error) {
        console.error('Error in getContent:', error);
        return {};
    }
}

/**
 * Get all content sections from the database (for static generation)
 * This version uses a static client that doesn't require cookies
 * Use this in generateStaticParams and other build-time contexts
 */
export async function getContentStatic() {
    try {
        const supabase = createStaticClient();

        const { data: sections, error } = await supabase
            .from('content_sections')
            .select('*');

        if (error) {
            console.error('Error fetching content:', error);
            return {};
        }

        // Transform array of sections into nested object structure
        // e.g., { home: { hero: {...}, cta: {...} }, join: { hero: {...} } }
        const content: Record<string, Record<string, any>> = {};

        sections?.forEach((section) => {
            const [page, key] = section.section_key.split('.');

            if (!content[page]) {
                content[page] = {};
            }

            content[page][key] = section.data;
        });

        return content;
    } catch (error) {
        console.error('Error in getContentStatic:', error);
        return {};
    }
}

/**
 * Update a content section in the database
 * Admin only - requires authentication
 */
export async function updateContent(sectionKey: string, newData: unknown) {
    try {
        const supabase = await createClient();

        // Check if user is authenticated and is an admin
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Verify user is an admin
        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            return { success: false, error: 'Not authorized' };
        }

        // Extract page from section_key (e.g., "home.hero" -> "home")
        const page = sectionKey.split('.')[0];

        // Upsert the content section
        const { error } = await supabase
            .from('content_sections')
            .upsert({
                section_key: sectionKey,
                page: page,
                data: newData,
            }, {
                onConflict: 'section_key'
            });

        if (error) {
            console.error('Error updating content:', error);
            return { success: false, error: 'Failed to update content' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error in updateContent:', error);
        return { success: false, error: 'Failed to update content' };
    }
}

/**
 * Get a specific content section by key
 */
export async function getContentSection(sectionKey: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('content_sections')
            .select('data')
            .eq('section_key', sectionKey)
            .single();

        if (error) {
            console.error('Error fetching content section:', error);
            return null;
        }

        return data?.data;
    } catch (error) {
        console.error('Error in getContentSection:', error);
        return null;
    }
}
