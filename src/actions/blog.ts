'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Get all published blog posts with pagination
 * @param language - Optional language filter ('en', 'nl', 'fr'). Defaults to 'en'
 * @param limit - Number of posts to fetch (default: 12)
 * @param offset - Number of posts to skip (default: 0)
 */
export async function getAllPosts(language: string = 'en', limit: number = 12, offset: number = 0) {
    try {
        const supabase = await createClient();

        const { data: posts, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('is_published', true)
            .eq('language', language)
            .order('published_date', { ascending: false })
            .range(offset, offset + limit - 1); // Supabase uses inclusive range

        if (error) {
            console.error('Error fetching posts:', error);
            return [];
        }

        return posts || [];
    } catch (error) {
        console.error('Error in getAllPosts:', error);
        return [];
    }
}

/**
 * Get a single blog post by ID
 */
export async function getPostById(id: number) {
    try {
        const supabase = await createClient();

        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error('Error fetching post:', error);
            return null;
        }

        return post;
    } catch (error) {
        console.error('Error in getPostById:', error);
        return null;
    }
}

/**
 * Get a single blog post by slug
 * @param slug - Post slug
 * @param language - Optional language filter ('en', 'nl', 'fr'). Defaults to 'en'
 */
export async function getPostBySlug(slug: string, language: string = 'en') {
    try {
        const supabase = await createClient();

        const { data: post, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('language', language)
            .eq('is_published', true)
            .maybeSingle();

        if (error) {
            console.error('Error fetching post:', error);
            return null;
        }

        return post;
    } catch (error) {
        console.error('Error in getPostBySlug:', error);
        return null;
    }
}

/**
 * Get all posts (including unpublished) - Admin only
 */
export async function getAllPostsAdmin() {
    try {
        const supabase = await createClient();

        // Check if user is authenticated and is an admin
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

        const { data: posts, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('published_date', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            return { success: false, error: 'Failed to fetch posts', data: [] };
        }

        return { success: true, data: posts || [] };
    } catch (error) {
        console.error('Error in getAllPostsAdmin:', error);
        return { success: false, error: 'Failed to fetch posts', data: [] };
    }
}

/**
 * Create a new blog post - Admin only
 */
export async function createPost(postData: {
    title: string;
    slug?: string;
    category: string;
    excerpt?: string;
    content: string;
    hero_image?: string;
    meta_title?: string;
    meta_description?: string;
    published_date?: string;
    author_name: string;
    author_role?: string;
    author_avatar?: string;
    tags?: string[];
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
            .from('blog_posts')
            .insert([postData])
            .select()
            .single();

        if (error) {
            console.error('Error creating post:', error);
            return { success: false, error: 'Failed to create post' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in createPost:', error);
        return { success: false, error: 'Failed to create post' };
    }
}

/**
 * Update a blog post - Admin only
 */
export async function updatePost(id: number, postData: Partial<{
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    hero_image: string;
    meta_title: string;
    meta_description: string;
    published_date: string;
    author_name: string;
    author_role: string;
    author_avatar: string;
    tags: string[];
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
            .from('blog_posts')
            .update(postData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating post:', error);
            return { success: false, error: 'Failed to update post' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in updatePost:', error);
        return { success: false, error: 'Failed to update post' };
    }
}

/**
 * Get all unique categories from blog posts
 */
export async function getAllCategories(): Promise<string[]> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('blog_posts')
            .select('category')
            .eq('is_published', true)
            .eq('language', 'en'); // Only get categories from English posts to avoid duplicates

        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }

        // Extract unique categories and sort
        const uniqueCategories = Array.from(
            new Set(data.map(post => post.category).filter(Boolean))
        ).sort();

        return uniqueCategories;
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        return [];
    }
}

/**
 * Delete a blog post - Admin only
 */
export async function deletePost(id: number) {
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
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting post:', error);
            return { success: false, error: 'Failed to delete post' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error in deletePost:', error);
        return { success: false, error: 'Failed to delete post' };
    }
}

/**
 * Publish all unpublished posts (Admin only)
 */
export async function publishAllUnpublished() {
    try {
        const supabase = await createClient();

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!adminUser) {
            return { success: false, error: 'Not authorized' };
        }

        // Update all unpublished posts to published
        const { data, error } = await supabase
            .from('blog_posts')
            .update({ is_published: true })
            .eq('is_published', false)
            .select();

        if (error) {
            console.error('Error publishing posts:', error);
            return { success: false, error: error.message };
        }

        return { success: true, count: data?.length || 0 };
    } catch (error) {
        console.error('Error in publishAllUnpublished:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to publish posts' };
    }
}

/**
 * Get all translations of a blog post
 * @param postId - The ID of the original post or any translation
 * @returns Array of all translations including the original
 */
export async function getPostTranslations(postId: number) {
    try {
        const supabase = await createClient();

        // First get the post to check if it's a translation or original
        const { data: post } = await supabase
            .from('blog_posts')
            .select('id, translated_from_id')
            .eq('id', postId)
            .single();

        if (!post) return [];

        // Get the original post ID (either this post or its parent)
        const originalId = post.translated_from_id || post.id;

        // Get all translations (including original)
        const { data: translations, error } = await supabase
            .from('blog_posts')
            .select('id, title, slug, language, is_published')
            .or(`id.eq.${originalId},translated_from_id.eq.${originalId}`)
            .order('language');

        if (error) {
            console.error('Error fetching translations:', error);
            return [];
        }

        return translations || [];
    } catch (error) {
        console.error('Error in getPostTranslations:', error);
        return [];
    }
}

/**
 * Get available languages for a post
 * @param postId - The ID of the post
 * @returns Array of language codes that have translations
 */
export async function getAvailableLanguages(postId: number) {
    const translations = await getPostTranslations(postId);
    return translations.map(t => t.language);
}
