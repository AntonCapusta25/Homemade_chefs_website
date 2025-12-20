'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Get all published learning pages
 */
export async function getAllLearningPages() {
    try {
        const supabase = await createClient();

        const { data: pages, error } = await supabase
            .from('learning_pages')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching learning pages:', error);
            return [];
        }

        return pages || [];
    } catch (error) {
        console.error('Error in getAllLearningPages:', error);
        return [];
    }
}

/**
 * Get a single learning page by slug and language
 * Falls back to English if the requested language is not available
 */
export async function getLearningPageBySlug(slug: string, language: string = 'en') {
    try {
        const supabase = await createClient();

        console.log('Fetching learning page:', { slug, language });

        // Try to fetch the page in the requested language
        const { data: page, error } = await supabase
            .from('learning_pages')
            .select('*')
            .eq('slug', slug)
            .eq('language', language)
            .eq('is_published', true)
            .single();

        if (error) {
            // Log ALL error properties to see what's actually happening
            console.error('=== SUPABASE ERROR DETAILS ===');
            console.error('Slug:', slug);
            console.error('Language:', language);
            console.error('Error Code:', error.code);
            console.error('Error Message:', error.message);
            console.error('Error Details:', error.details);
            console.error('Error Hint:', error.hint);
            console.error('Full Error Object:', error);
            console.error('Error Keys:', Object.keys(error));
            console.error('================================');

            // If the page doesn't exist in the requested language, try English as fallback
            if (language !== 'en') {
                console.log('Page not found in requested language, trying English fallback...');

                const { data: englishPage, error: englishError } = await supabase
                    .from('learning_pages')
                    .select('*')
                    .eq('slug', slug)
                    .eq('language', 'en')
                    .eq('is_published', true)
                    .single();

                if (englishError) {
                    console.error('English fallback also failed:', englishError);
                    return { success: false, data: null, error: `Page not found in ${language} or English` };
                }

                console.log('Successfully fetched English fallback:', englishPage?.title);
                return { success: true, data: englishPage, error: null, fallbackLanguage: 'en' };
            }

            return { success: false, data: null, error: error.message || 'Failed to fetch learning page' };
        }

        console.log('Successfully fetched page:', page?.title);
        return { success: true, data: page, error: null };
    } catch (error) {
        console.error('Error in getLearningPageBySlug:', {
            slug,
            language,
            error,
            errorType: typeof error,
            errorString: String(error)
        });
        return { success: false, data: null, error: 'Failed to fetch learning page' };
    }
}

/**
 * Get all learning pages (including unpublished) - Admin only
 */
export async function getAllLearningPagesAdmin() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated', data: [] };
        }

        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            return { success: false, error: 'Not authorized', data: [] };
        }

        const { data: pages, error } = await supabase
            .from('learning_pages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching learning pages:', error);
            return { success: false, error: 'Failed to fetch pages', data: [] };
        }

        return { success: true, data: pages || [] };
    } catch (error) {
        console.error('Error in getAllLearningPagesAdmin:', error);
        return { success: false, error: 'Failed to fetch pages', data: [] };
    }
}

/**
 * Get a single learning page by ID - Admin only
 */
export async function getLearningPageById(id: number) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated', data: null };
        }

        const { data: page, error } = await supabase
            .from('learning_pages')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching learning page:', error);
            return { success: false, error: 'Failed to fetch page', data: null };
        }

        return { success: true, data: page };
    } catch (error) {
        console.error('Error in getLearningPageById:', error);
        return { success: false, error: 'Failed to fetch page', data: null };
    }
}

/**
 * Create a new learning page - Admin only
 */
export async function createLearningPage(pageData: {
    title: string;
    body_content: string;
    hero_image?: string;
    youtube_url?: string;
    meta_title?: string;
    meta_description?: string;
    is_published?: boolean;
}) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            return { success: false, error: 'Not authorized' };
        }

        const { data, error } = await supabase
            .from('learning_pages')
            .insert([pageData])
            .select()
            .single();

        if (error) {
            console.error('Error creating learning page:', error);
            return { success: false, error: 'Failed to create page' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in createLearningPage:', error);
        return { success: false, error: 'Failed to create page' };
    }
}

/**
 * Update a learning page - Admin only
 */
export async function updateLearningPage(id: number, pageData: Partial<{
    title: string;
    body_content: string;
    hero_image: string;
    youtube_url: string;
    meta_title: string;
    meta_description: string;
    is_published: boolean;
}>) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            return { success: false, error: 'Not authorized' };
        }

        const { data, error } = await supabase
            .from('learning_pages')
            .update(pageData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating learning page:', error);
            return { success: false, error: 'Failed to update page' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in updateLearningPage:', error);
        return { success: false, error: 'Failed to update page' };
    }
}

/**
 * Delete a learning page - Admin only
 */
export async function deleteLearningPage(id: number) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            return { success: false, error: 'Not authorized' };
        }

        const { error } = await supabase
            .from('learning_pages')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting learning page:', error);
            return { success: false, error: 'Failed to delete page' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error in deleteLearningPage:', error);
        return { success: false, error: 'Failed to delete page' };
    }
}

/**
 * Get all translations of a learning page
 * @param pageId - The ID of the source page
 * @returns Array of all language versions
 */
export async function getLearningPageTranslations(pageId: number) {
    try {
        const supabase = await createClient();

        // Get the source page first
        const { data: sourcePage } = await supabase
            .from('learning_pages')
            .select('id, source_id')
            .eq('id', pageId)
            .single();

        if (!sourcePage) return [];

        // If this is a translation, get the source ID
        const sourceId = sourcePage.source_id || sourcePage.id;

        // Get all translations including the source
        const { data: translations, error } = await supabase
            .from('learning_pages')
            .select('id, title, language, slug')
            .or(`id.eq.${sourceId},source_id.eq.${sourceId}`);

        if (error) {
            console.error('Error fetching translations:', error);
            return [];
        }

        return translations || [];
    } catch (error) {
        console.error('Error in getLearningPageTranslations:', error);
        return [];
    }
}

/**
 * Get available languages for a learning page
 * @param pageId - The ID of the page
 * @returns Array of language codes that have translations
 */
export async function getAvailableLanguagesForPage(pageId: number) {
    const translations = await getLearningPageTranslations(pageId);
    return translations.map(t => t.language);
}
