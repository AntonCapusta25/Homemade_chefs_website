
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getPostTranslations } from '@/actions/blog';
import SocialSidebar from '@/components/SocialSidebar';
import BlogLanguageManager from '@/components/blog/BlogLanguageManager';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, ArrowRight, Tag, Clock } from 'lucide-react';
import { sanitizeBlogHTML } from '@/lib/sanitize-html';
import CallToAction from '@/components/CallToAction';
// import LiveSupport from '@/components/LiveSupport';
import en from '@/translations/en.json';
import nl from '@/translations/nl.json';
import fr from '@/translations/fr.json';

// Type definition for translations
type Translations = typeof en;

const dictionaries: Record<string, Translations> = { en, nl, fr };

function getDictionary(lang: string): Translations {
    return dictionaries[lang.toLowerCase()] || en;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }) {
    const { slug, lang } = await params;
    const post = await getPostBySlug(slug, lang);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt,
        openGraph: {
            title: post.meta_title || post.title,
            description: post.meta_description || post.excerpt,
            images: post.hero_image ? [{ url: post.hero_image }] : [],
            type: 'article',
            publishedTime: post.published_date,
            authors: [post.author_name],
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
    const { slug, lang } = await params;

    // Ensure lang is valid, default to 'en' if not (though middleware handles this)
    const validLang = ['en', 'nl', 'fr'].includes(lang?.toLowerCase()) ? lang.toLowerCase() : 'en';
    const t = getDictionary(validLang);

    const post = await getPostBySlug(slug, validLang);

    if (!post) {
        notFound();
    }

    // Fetch translations for language switcher
    const translations = await getPostTranslations(post.id);

    // Get related posts (same category, excluding current post, limit to 2 for cleaner layout)
    const allPosts = await getAllPosts(validLang);
    const relatedPosts = allPosts
        .filter(p => p.category === post.category && p.slug !== post.slug)
        .slice(0, 2);

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <BlogLanguageManager translations={translations} />
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {post.hero_image && (
                        <Image
                            src={post.hero_image}
                            alt={post.title}
                            fill
                            className="object-cover scale-105"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E19] via-[#0F1E19]/60 to-transparent opacity-90" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
                    {/* Back Button */}
                    <Link
                        href={`/${validLang === 'en' ? '' : validLang + '/'}blog`}
                        className="inline-flex items-center gap-2 text-white/80 hover:text-[#F47A44] transition-colors mb-8 font-medium backdrop-blur-md bg-white/10 px-5 py-2 rounded-full border border-white/10"
                    >
                        <ArrowLeft size={18} />
                        {t.blogPost.backToBlog}
                    </Link>

                    {/* Meta Tags & Title */}
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-bold tracking-wider uppercase text-[#F47A44]">
                            {post.category && (
                                <span className="bg-[#F47A44]/20 backdrop-blur-sm px-4 py-1.5 rounded-lg border border-[#F47A44]/30">
                                    {post.category}
                                </span>
                            )}
                            <span className="text-white/60">•</span>
                            <span className="text-white flex items-center gap-2">
                                <Clock size={16} /> 5 Min Read
                            </span>
                        </div>

                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-xl">
                            {post.title}
                        </h1>

                        {/* Author Info */}
                        <div className="flex items-center gap-6 text-white/90 border-t border-white/20 pt-6">
                            <div className="flex items-center gap-3">
                                {post.author_avatar ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#F47A44]">
                                        <Image
                                            src={post.author_avatar}
                                            alt={post.author_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-[#F47A44] flex items-center justify-center text-white font-bold text-xl border-2 border-white">
                                        {post.author_name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-lg leading-none">{post.author_name}</p>
                                    {post.author_role && (
                                        <p className="text-white/60 text-sm">{post.author_role}</p>
                                    )}
                                </div>
                            </div>
                            <div className="h-10 w-px bg-white/20 mx-2" />
                            <div className="flex flex-col">
                                <span className="text-white/60 text-xs uppercase tracking-widest">Published</span>
                                <span className="font-medium text-lg">
                                    {new Date(post.published_date || post.created_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content with Sidebar */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 py-20">
                {/* Social Share Sidebar */}
                <aside className="hidden lg:block lg:col-span-1">
                    <SocialSidebar />
                </aside>

                {/* Article Content */}
                <article className="lg:col-span-8">
                    <div
                        className="prose prose-xl prose-stone max-w-none 
                        prose-headings:font-serif prose-headings:text-[#0F1E19] prose-headings:font-bold 
                        prose-p:text-[#0F1E19]/80 prose-p:leading-loose 
                        prose-a:text-[#F47A44] prose-a:no-underline hover:prose-a:underline 
                        prose-quoteless 
                        prose-blockquote:border-l-4 prose-blockquote:border-[#F47A44] prose-blockquote:bg-[#F47A44]/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg 
                        prose-img:rounded-2xl prose-img:shadow-xl 
                        first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#F47A44] first-letter:mr-3 first-letter:float-left"
                        dangerouslySetInnerHTML={{ __html: sanitizeBlogHTML(post.content) }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-12 pt-12 border-t border-[#0F1E19]/10">
                            {post.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="bg-white border border-[#0F1E19]/10 px-4 py-2 rounded-full text-sm text-[#0F1E19]/70 font-medium flex items-center gap-2 hover:border-[#F47A44] hover:text-[#F47A44] transition-colors cursor-pointer"
                                >
                                    <Tag size={14} /> {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Author Box */}
                    <div className="bg-[#E6DCC3]/20 p-8 rounded-2xl flex items-center gap-6 mt-16 border border-[#E6DCC3]/50">
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <div className="absolute inset-0 bg-[#F47A44] rounded-full opacity-10 scale-110" />
                            {post.author_avatar ? (
                                <Image
                                    src={post.author_avatar}
                                    alt={post.author_name}
                                    fill
                                    className="object-cover rounded-full border-2 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-[#F47A44] flex items-center justify-center text-white font-bold text-2xl border-2 border-white shadow-md">
                                    {post.author_name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <span className="text-[#F47A44] font-bold text-xs uppercase tracking-wider mb-1 block">Written By</span>
                            <h4 className="font-serif text-xl font-bold text-[#0F1E19]">{post.author_name}</h4>
                            {post.author_role && (
                                <p className="text-[#0F1E19]/60 text-sm mt-1">{post.author_role}</p>
                            )}
                            <p className="text-[#0F1E19]/70 text-sm mt-3 leading-relaxed">
                                Passionate about sharing insights on culinary trends and kitchen management. Bringing you the latest updates from the heart of the industry.
                            </p>
                        </div>
                    </div>
                </article>

                {/* Right Sidebar - Related Articles */}
                <div className="lg:col-span-3">
                    <div className="sticky top-32">
                        <h3 className="font-serif text-2xl font-bold text-[#0F1E19] mb-6 border-b border-[#0F1E19]/10 pb-4">
                            {t.blogPost.relatedArticles}
                        </h3>

                        <div className="flex flex-col gap-8">
                            {relatedPosts.length > 0 ? (
                                relatedPosts.map((related) => (
                                    <Link
                                        key={related.id}
                                        href={`/${validLang === 'en' ? '' : validLang + '/'}blog/${related.slug}`}
                                        className="group block"
                                    >
                                        {/* Image */}
                                        {related.hero_image && (
                                            <div className="relative h-40 mb-4 overflow-hidden rounded-xl">
                                                <Image
                                                    src={related.hero_image}
                                                    alt={related.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                        )}

                                        {related.category && (
                                            <span className="text-[#F47A44] text-xs font-bold uppercase tracking-wider">
                                                {related.category}
                                            </span>
                                        )}

                                        <h4 className="font-serif text-lg font-bold text-[#0F1E19] mt-2 group-hover:text-[#F47A44] transition-colors leading-snug">
                                            {related.title}
                                        </h4>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-[#0F1E19]/40 text-sm italic">
                                    {t.blogPost.noRelatedArticles}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <CallToAction />

            {/* Live Support Chatbot */}
            {/* <LiveSupport /> */}
        </main>
    );
}

// Add viewport export for theme color if needed (optional)
export const viewport = {
    themeColor: '#0F1E19',
};
