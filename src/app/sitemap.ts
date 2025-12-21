import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://homemadechefs.com';
    const supabase = await createClient();

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        // Homepage
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/nl`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/fr`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        // Pricing
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/nl/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/fr/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        // Blog
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/nl/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/fr/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        // Learning
        {
            url: `${baseUrl}/learning`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/nl/learning`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/fr/learning`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // Fetch blog posts
    const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('slug, language, updated_at, is_published')
        .eq('is_published', true)
        .order('updated_at', { ascending: false });

    const blogPages: MetadataRoute.Sitemap = (blogPosts || []).map((post) => ({
        url: `${baseUrl}/${post.language === 'en' ? '' : post.language + '/'}blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Fetch learning pages
    const { data: learningPages } = await supabase
        .from('learning_pages')
        .select('slug, language, updated_at, is_published')
        .eq('is_published', true)
        .order('updated_at', { ascending: false });

    const learningPagesSitemap: MetadataRoute.Sitemap = (learningPages || []).map((page) => ({
        url: `${baseUrl}/${page.language === 'en' ? '' : page.language + '/'}learning/${page.slug}`,
        lastModified: new Date(page.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...blogPages, ...learningPagesSitemap];
}
