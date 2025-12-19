
import Image from 'next/image';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import CallToAction from '@/components/CallToAction';
import SocialShare from '@/components/blog/SocialShare';
import AuthorCard from '@/components/blog/AuthorCard';
import BlogGallery from '@/components/blog/BlogGallery';
import * as motion from "framer-motion/client";
import EditableElement from '@/components/admin/EditableElement';

// This template accepts the specific POST data being edited
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogDetailTemplate({ post, onUpdate }: { post: any, onUpdate?: (key: string, value: any) => void }) {

    if (!post) {
        return <div className="p-10 text-center">Select a post to preview content.</div>;
    }

    // Helper to handle updates safely
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdate = (field: string, value: any) => {
        if (onUpdate) onUpdate(field, value);
    };

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            {/* Hero Section with Parallax-like feel */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative h-[70vh] min-h-[500px] flex items-end pb-20 overflow-hidden"
            >
                <div className="absolute inset-0 z-0">
                    <EditableElement
                        type="image"
                        value={post.image}
                        onChange={(val) => handleUpdate('image', val)}
                        className="w-full h-full"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E19] via-[#0F1E19]/60 to-transparent opacity-90 pointer-events-none" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
                    {/* Fake Back Button for Preview */}
                    <button
                        className="inline-flex items-center gap-2 text-white/80 hover:text-[#F47A44] transition-colors mb-8 font-medium backdrop-blur-md bg-white/10 px-5 py-2 rounded-full border border-white/10 cursor-not-allowed opacity-70"
                        title="Disabled in Preview"
                    >
                        <ArrowLeft size={18} /> Back to Blog
                    </button>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-bold tracking-wider uppercase text-[#F47A44]">
                            <span className="bg-[#F47A44]/20 backdrop-blur-sm px-4 py-1.5 rounded-lg border border-[#F47A44]/30">
                                <EditableElement
                                    value={post.category || 'Category'}
                                    onChange={(val) => handleUpdate('category', val)}
                                    tagName="span"
                                    className="min-w-[50px] inline-block"
                                />
                            </span>
                            <span className="text-white/60">•</span>
                            <span className="text-white flex items-center gap-2">
                                <Clock size={16} /> 5 Min Read
                            </span>
                        </div>

                        <EditableElement
                            value={post.title || 'Untitled Post'}
                            onChange={(val) => handleUpdate('title', val)}
                            tagName="h1"
                            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-xl"
                        />

                        <div className="flex items-center gap-6 text-white/90 border-t border-white/20 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#F47A44]">
                                    <Image
                                        src={post.author?.avatar || '/placeholder.jpg'}
                                        alt={post.author?.name || 'Author'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <EditableElement
                                        value={post.author?.name || 'Author Name'}
                                        onChange={(val) => handleUpdate('author.name', val)}
                                        tagName="p"
                                        className="font-bold text-lg leading-none"
                                    />
                                    <EditableElement
                                        value={post.author?.role || 'Role'}
                                        onChange={(val) => handleUpdate('author.role', val)}
                                        tagName="p"
                                        className="text-white/60 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="h-10 w-px bg-white/20 mx-2" />
                            <div className="flex flex-col">
                                <span className="text-white/60 text-xs uppercase tracking-widest">Published</span>
                                <EditableElement
                                    value={post.date || 'Date'}
                                    onChange={(val) => handleUpdate('date', val)}
                                    tagName="span"
                                    className="font-medium text-lg"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 py-20">
                {/* Social Sidebar */}
                <aside className="hidden lg:block lg:col-span-1">
                    <SocialShare />
                </aside>

                {/* Main Content */}
                <article className="lg:col-span-8">
                    <div className="prose prose-xl prose-stone max-w-none prose-headings:font-serif prose-headings:text-[#0F1E19] prose-headings:font-bold prose-p:text-[#0F1E19]/80 prose-p:leading-loose prose-a:text-[#F47A44] prose-a:no-underline hover:prose-a:underline prose-quoteless prose-blockquote:border-l-4 prose-blockquote:border-[#F47A44] prose-blockquote:bg-[#F47A44]/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-img:rounded-2xl prose-img:shadow-xl first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#F47A44] first-letter:mr-3 first-letter:float-left">
                        <EditableElement
                            value={post.content || '<p>Start writing...</p>'}
                            onChange={(val) => handleUpdate('content', val)}
                            tagName="div"
                            type="html"
                        />
                    </div>

                    {/* Gallery */}
                    <div className="mt-16">
                        <BlogGallery images={post.galleryImages || []} />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-12 pt-12 border-t border-[#0F1E19]/10">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(post.tags || []).map((tag: any, idx: number) => (
                            <span key={idx} className="bg-white border border-[#0F1E19]/10 px-4 py-2 rounded-full text-sm text-[#0F1E19]/70 font-medium flex items-center gap-2 hover:border-[#F47A44] hover:text-[#F47A44] transition-colors cursor-pointer">
                                <Tag size={14} /> {tag}
                            </span>
                        ))}
                    </div>

                    <AuthorCard author={post.author || {}} />
                </article>

                {/* Sidebar */}
                <div className="lg:col-span-3">
                    <div className="sticky top-32">
                        <h3 className="font-serif text-2xl font-bold text-[#0F1E19] mb-6 border-b border-[#0F1E19]/10 pb-4">
                            Related Articles
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
                            Related posts preview disabled in editor.
                        </div>
                    </div>
                </div>
            </div>

            <CallToAction />
        </main>
    );
}
