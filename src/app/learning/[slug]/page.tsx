import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, PlayCircle } from 'lucide-react';
import { getLearningPageBySlug, getAllLearningPages } from '@/actions/learning';
import SocialSidebar from '@/components/SocialSidebar';
import CallToAction from '@/components/CallToAction';
// import LiveSupport from '@/components/LiveSupport';

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string {
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

export default async function LearningPageDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const result = await getLearningPageBySlug(slug, 'en');

    if (!result.success || !result.data) {
        notFound();
    }

    const page = result.data;
    const videoId = extractYouTubeId(page.youtube_url || '');

    // Get all other learning pages for sidebar
    const allPages = await getAllLearningPages();
    const relatedPages = (allPages as any[])
        .filter(p => p.language === 'en' && p.slug !== slug)
        .slice(0, 5);

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {page.hero_image && (
                        <Image
                            src={page.hero_image}
                            alt={page.title}
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
                        href="/learning"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-[#F47A44] transition-colors mb-8 font-medium backdrop-blur-md bg-white/10 px-5 py-2 rounded-full border border-white/10"
                    >
                        <ArrowLeft size={18} />
                        Back to Learning
                    </Link>

                    {/* Meta Tags & Title */}
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-bold tracking-wider uppercase text-[#F47A44]">
                            <span className="bg-[#F47A44]/20 backdrop-blur-sm px-4 py-1.5 rounded-lg border border-[#F47A44]/30">
                                Guide
                            </span>
                            <span className="text-white/60">•</span>
                            <span className="text-white flex items-center gap-2">
                                <Clock size={16} /> 5 Min Read
                            </span>
                        </div>

                        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-xl">
                            {page.title}
                        </h1>

                        {page.meta_description && (
                            <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                                {page.meta_description}
                            </p>
                        )}
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
                    {/* YouTube Video */}
                    {videoId && (
                        <div className="mb-12 rounded-2xl overflow-hidden bg-black shadow-2xl">
                            <div className="relative pb-[56.25%]">
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    className="absolute top-0 left-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    {/* Body Content */}
                    <div
                        className="prose prose-xl prose-stone max-w-none 
                        prose-headings:font-serif prose-headings:text-[#0F1E19] prose-headings:font-bold 
                        prose-p:text-[#0F1E19]/80 prose-p:leading-loose 
                        prose-a:text-[#F47A44] prose-a:no-underline hover:prose-a:underline 
                        prose-quoteless 
                        prose-blockquote:border-l-4 prose-blockquote:border-[#F47A44] prose-blockquote:bg-[#F47A44]/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg 
                        prose-img:rounded-2xl prose-img:shadow-xl 
                        first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#F47A44] first-letter:mr-3 first-letter:float-left"
                        dangerouslySetInnerHTML={{ __html: page.body_content }}
                    />
                </article>

                {/* Right Sidebar - Related Learning Pages */}
                <div className="lg:col-span-3">
                    <div className="sticky top-32">
                        <h3 className="font-serif text-2xl font-bold text-[#0F1E19] mb-6 border-b border-[#0F1E19]/10 pb-4">
                            More Guides
                        </h3>

                        <div className="flex flex-col gap-8">
                            {relatedPages.length > 0 ? (
                                relatedPages.map((related: any) => {
                                    const relatedVideoId = extractYouTubeId(related.youtube_url || '');
                                    return (
                                        <Link
                                            key={related.id}
                                            href={`/learning/${related.slug}`}
                                            className="group block"
                                        >
                                            {/* Image or Video Thumbnail */}
                                            {relatedVideoId ? (
                                                <div className="relative h-40 mb-4 overflow-hidden rounded-xl bg-black">
                                                    <Image
                                                        src={`https://img.youtube.com/vi/${relatedVideoId}/mqdefault.jpg`}
                                                        alt={related.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-12 h-12 rounded-full bg-[#F47A44] flex items-center justify-center">
                                                            <PlayCircle size={24} className="text-white fill-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : related.hero_image ? (
                                                <div className="relative h-40 mb-4 overflow-hidden rounded-xl">
                                                    <Image
                                                        src={related.hero_image}
                                                        alt={related.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                            ) : null}

                                            <h4 className="font-serif text-lg font-bold text-[#0F1E19] mt-2 group-hover:text-[#F47A44] transition-colors leading-snug">
                                                {related.title}
                                            </h4>
                                        </Link>
                                    );
                                })
                            ) : (
                                <p className="text-[#0F1E19]/40 text-sm italic">
                                    No other guides available
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

export const viewport = {
    themeColor: '#0F1E19',
};
