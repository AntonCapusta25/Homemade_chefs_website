'use client';

import { useEffect, useState } from 'react';
import BlogHero from '@/components/blog/BlogHero';
import BlogList from '@/components/blog/BlogList';
import FAQCreative from '@/components/FAQCreative';
import { getAllPosts } from '@/actions/blog';
import CallToAction from '@/components/CallToAction';
// import LiveSupport from '@/components/LiveSupport';
import { useLanguage } from '@/context/LanguageContext';

const POSTS_PER_PAGE = 12;

export default function BlogPage() {
    const { language } = useLanguage();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);

    // Initial load
    useEffect(() => {
        async function fetchInitialPosts() {
            setLoading(true);
            setPosts([]);
            setOffset(0);
            setHasMore(true);

            const langCode = language.toLowerCase();
            const fetchedPosts = await getAllPosts(langCode, POSTS_PER_PAGE, 0);
            setPosts(fetchedPosts);
            setHasMore(fetchedPosts.length === POSTS_PER_PAGE);
            setLoading(false);
        }
        fetchInitialPosts();
    }, [language]);

    // Load more posts
    const loadMore = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const langCode = language.toLowerCase();
        const newOffset = offset + POSTS_PER_PAGE;
        const morePosts = await getAllPosts(langCode, POSTS_PER_PAGE, newOffset);

        setPosts(prev => [...prev, ...morePosts]);
        setOffset(newOffset);
        setHasMore(morePosts.length === POSTS_PER_PAGE);
        setLoadingMore(false);
    };

    return (
        <main className="flex flex-col min-h-screen bg-[#FDFBF7]">
            <BlogHero />
            {loading ? (
                <div className="py-20 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F47A44]"></div>
                    <p className="text-gray-500 mt-4">Loading posts...</p>
                </div>
            ) : (
                <>
                    <BlogList posts={posts} />
                    {hasMore && (
                        <div className="py-12 text-center">
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="bg-[#0F1E19] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#F47A44] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingMore ? (
                                    <span className="flex items-center gap-2">
                                        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Loading...
                                    </span>
                                ) : (
                                    'Load More Posts'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
            <FAQCreative />
            <CallToAction />
            {/* <LiveSupport /> */}
        </main>
    );
}
