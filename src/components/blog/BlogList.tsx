import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

// Simplified interface for the list view
interface BlogPost {
    id: number;
    title: string;
    slug?: string;
    category: string;
    created_at?: string;
    published_date?: string;
    date?: string; // Legacy field support
    hero_image?: string;
    image?: string; // Legacy field support
    excerpt: string;
}

export default function BlogList({ posts, isEditor = false, categories: propCategories }: { posts: BlogPost[], isEditor?: boolean, categories?: string[] }) {
    const { language } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Extract unique categories from posts dynamically, or use provided categories
    const categories = useMemo(() => {
        if (propCategories && propCategories.length > 0) {
            return ["All", ...propCategories];
        }
        const uniqueCategories = Array.from(new Set(posts.map(post => post.category).filter(Boolean)));
        return ["All", ...uniqueCategories.sort()];
    }, [posts, propCategories]);

    const filteredPosts = posts.filter(post => {
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const TitleWrapper = isEditor ? 'div' : Link;
    const ReadMoreWrapper = isEditor ? 'div' : Link;

    // Helper to get correct path
    const getPostPath = (post: BlogPost) => {
        const langPrefix = language === 'en' ? '' : `/${language.toLowerCase()}`;
        return `${langPrefix}/blog/${post.slug || post.id}`;
    };

    return (
        <section className="py-20 bg-[#FDFBF7] min-h-screen">
            <div className="max-w-7xl mx-auto px-6">

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
                    {/* Categories */}
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${selectedCategory === cat
                                    ? "bg-[#0F1E19] text-white shadow-lg scale-105"
                                    : "bg-white text-[#0F1E19]/70 hover:bg-[#F47A44]/10 hover:text-[#F47A44]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F47A44] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-[#F47A44] focus:ring-2 focus:ring-[#F47A44]/20 outline-none transition-all placeholder:text-gray-400 bg-white"
                        />
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-[#E6DCC3]/30 rounded-2xl overflow-hidden hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100 flex flex-col h-full"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md text-[#0F1E19]">
                                    {post.category}
                                </span>
                                <div className="w-full h-full bg-[#E0D8C8] relative group-hover:scale-105 transition-transform duration-700">
                                    <div className="absolute inset-0 flex items-center justify-center text-[#0F1E19]/10">
                                        <Image
                                            src={post.hero_image || post.image || '/chefs-cooking.png'}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/chefs-cooking.png'; // Fallback to a safe image
                                                target.onerror = null; // Prevent infinite loop
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-sm text-[#0F1E19]/50 mb-4 font-medium">
                                    <Calendar size={14} />
                                    <span>{new Date(post.published_date || post.created_at || post.date || new Date().toISOString()).toLocaleDateString()}</span>
                                </div>

                                <h3 className="font-serif text-2xl font-bold text-[#0F1E19] mb-4 leading-snug group-hover:text-[#F47A44] transition-colors">
                                    <TitleWrapper href={!isEditor ? getPostPath(post) : '#'} className={`focus:outline-none ${isEditor ? 'cursor-default' : ''}`}>
                                        {post.title}
                                    </TitleWrapper>
                                </h3>

                                <p className="text-[#0F1E19]/70 mb-8 line-clamp-3 leading-relaxed flex-grow">
                                    {post.excerpt}
                                </p>

                                <ReadMoreWrapper
                                    href={!isEditor ? getPostPath(post) : '#'}
                                    className={`inline-flex items-center gap-2 text-[#F47A44] font-bold uppercase tracking-wide text-sm group-hover:gap-3 transition-all ${isEditor ? 'cursor-default opacity-50' : ''}`}
                                >
                                    Read Post <ArrowUpRight size={16} />
                                </ReadMoreWrapper>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">No articles found matching your search.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                            className="mt-4 text-[#F47A44] font-bold hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
