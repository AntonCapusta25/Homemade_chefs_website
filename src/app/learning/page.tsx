"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, PlayCircle, ArrowRight, Star, ShieldCheck, ClipboardCheck, AlertTriangle, Thermometer, Lock, ChefHat } from 'lucide-react';
import { getAllLearningPages } from '@/actions/learning';
import { createClient } from '@/lib/supabase/client';

interface LearningPage {
    id: number;
    title: string;
    slug: string;
    body_content: string;
    hero_image: string | null;
    youtube_url: string | null;
    meta_description: string | null;
    is_premium?: boolean;
    progress?: number;
}

interface ChefUser {
    id: string;
    email: string;
    full_name: string;
}

function ProgressBar({ progress }: { progress: number }) {
    if (progress === undefined || progress === 0) return null;
    return (
        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div
                className="h-full bg-[#F47A44] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

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

// Extract text snippet from HTML
function getTextSnippet(html: string, maxLength: number = 100): string {
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

const categories = [
    { name: "Food Safety", icon: <ShieldCheck />, color: "bg-blue-100 text-blue-700" },
    { name: "Hygiene", icon: <ClipboardCheck />, color: "bg-green-100 text-green-700" },
    { name: "Allergens", icon: <AlertTriangle />, color: "bg-orange-100 text-orange-700" },
    { name: "Temperatures", icon: <Thermometer />, color: "bg-red-100 text-red-700" },
    { name: "Compliance", icon: "⚖️", color: "bg-purple-100 text-purple-700" },
    { name: "Kitchen Ops", icon: "🔪", color: "bg-yellow-100 text-yellow-700" },
];

export default function LearningPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [pages, setPages] = useState<LearningPage[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [chef, setChef] = useState<ChefUser | null>(null);
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        checkAuth();
        loadPages();
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            setIsLoggedIn(true);

            // Fetch chef profile
            const { data: chefData, error: chefError } = await supabase
                .from('chef_users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (chefError) {
                console.error('Error fetching chef profile:', chefError);
            }

            if (chefData) {
                console.log('Chef data loaded:', chefData);
                setChef(chefData);
            } else {
                console.warn('No chef profile found for user:', user.id);
            }
        }
    };

    const loadPages = async () => {
        const data = await getAllLearningPages();
        setPages(data as LearningPage[]);
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setLoginError(error.message);
                setIsLoggingIn(false);
                return;
            }

            if (data.user) {
                // Fetch chef profile
                const { data: chefData, error: chefError } = await supabase
                    .from('chef_users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                if (chefError) {
                    console.error('Error fetching chef profile after login:', chefError);
                }

                if (chefData) {
                    console.log('Chef profile loaded after login:', chefData);
                    setChef(chefData);
                } else {
                    console.warn('No chef profile found after login for user:', data.user.id);
                }

                setIsLoggedIn(true);
                setIsLoggingIn(false);
            }
        } catch (err: any) {
            setLoginError('An unexpected error occurred');
            setIsLoggingIn(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        setChef(null);
    };

    // Separate pages with and without videos
    const pagesWithVideos = pages.filter(p => p.youtube_url);
    const pagesWithoutVideos = pages.filter(p => !p.youtube_url);

    // Get featured articles (first 3 pages without videos, or any pages if not enough)
    const featuredArticles = pagesWithoutVideos.length >= 3
        ? pagesWithoutVideos.slice(0, 3)
        : [...pagesWithoutVideos, ...pagesWithVideos].slice(0, 3);

    // Get video list (all pages with videos)
    const videos = pagesWithVideos.slice(0, 3);

    return (
        <div className="bg-[#FDFBF7] min-h-screen font-sans text-[#0F1E19]">

            {/* HERO SECTION */}
            <section className="relative bg-[#0F1E19] text-[#FDFBF7] pt-32 pb-24 px-6 overflow-hidden rounded-b-[3rem]">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#F47A44] blur-[100px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#2A4A3C] blur-[80px]"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">



                    <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
                        Chef Resources
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10">
                        Essential guides on food safety, hygiene, and kitchen operations.
                    </p>

                    {/* LOGIN / WELCOME CARD */}
                    <div className="flex justify-center mt-12 mb-8 animate-fade-in-up">
                        {isLoggedIn ? (
                            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md text-white shadow-2xl">
                                <div className="w-12 h-12 rounded-full bg-[#F47A44] flex items-center justify-center shadow-lg shadow-[#F47A44]/20">
                                    <ChefHat size={24} className="text-[#0F1E19]" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-[#F47A44] font-extrabold uppercase tracking-wider mb-1">Welcome Back</p>
                                    <p className="font-serif font-bold text-2xl leading-none">{chef?.full_name || 'Chef'}</p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="ml-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="relative group w-full max-w-sm mx-auto">
                                {/* Glow Effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#F47A44] to-[#E86825] rounded-[2rem] opacity-30 group-hover:opacity-50 blur-xl transition-opacity duration-500"></div>

                                <form
                                    onSubmit={handleLogin}
                                    className="relative flex flex-col gap-5 p-8 rounded-[2rem] bg-[#0F1E19]/80 border border-white/10 backdrop-blur-xl shadow-2xl"
                                >
                                    <div className="text-center mb-2">
                                        <h3 className="font-serif text-2xl font-bold text-white mb-1">Chef Login</h3>
                                        <p className="text-white/60 text-sm">Access your premium resources</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="group/input relative flex items-center gap-3 px-4 py-3.5 bg-black/20 rounded-xl border border-white/5 focus-within:border-[#F47A44]/50 focus-within:bg-black/40 transition-all duration-300">
                                            <ChefHat size={18} className="text-[#F47A44] group-focus-within/input:scale-110 transition-transform" />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Chef Email"
                                                className="bg-transparent border-none outline-none text-white placeholder-white/40 w-full font-medium text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="group/input relative flex items-center gap-3 px-4 py-3.5 bg-black/20 rounded-xl border border-white/5 focus-within:border-[#F47A44]/50 focus-within:bg-black/40 transition-all duration-300">
                                            <Lock size={18} className="text-[#F47A44] group-focus-within/input:scale-110 transition-transform" />
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                className="bg-transparent border-none outline-none text-white placeholder-white/40 w-full font-medium text-sm"
                                                required
                                            />
                                        </div>
                                        {loginError && (
                                            <p className="text-red-300 text-sm text-center">{loginError}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoggingIn}
                                        className="w-full bg-gradient-to-r from-[#F47A44] to-[#E86825] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#F47A44]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group/button hover:ring-2 ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoggingIn ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                <span>Sign In</span>
                                                <ArrowRight size={18} className="opacity-80 group-hover/button:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* SEARCH BAR */}
                    {isLoggedIn && (
                        <div className="max-w-2xl mx-auto relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="text-gray-400 group-focus-within:text-[#F47A44] transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search topics (e.g., Temperature, Hygiene)..."
                                className="w-full pl-12 pr-6 py-5 rounded-full text-[#0F1E19] text-lg outline-none focus:ring-4 focus:ring-[#F47A44]/50 transition-all shadow-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold">Topics</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, idx) => (
                        <button key={idx} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3 ${cat.color} group-hover:scale-110 transition-transform`}>
                                {typeof cat.icon === 'string' ? cat.icon : React.cloneElement(cat.icon as React.ReactElement<any>, { size: 24 })}
                            </div>
                            <span className="font-bold text-sm md:text-base text-center text-gray-700">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* BENEFITS / IMPACT SECTION */}
            <section className="bg-white py-20 px-6 border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[#F47A44] font-bold tracking-wider uppercase text-sm mb-2 block">Why Learn With Us?</span>
                        <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0F1E19] mb-6">Elevate Your Craft & Career</h2>
                        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                            Professional development isn&apos;t just about compliance. It&apos;s about building a sustainable, high-quality culinary business that customers trust.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Benefit 1 */}
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FDFBF7] hover:bg-white border border-transparent hover:border-[#F47A44]/20 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-16 h-16 rounded-full bg-[#FFE5D9] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Star className="text-[#F47A44]" size={32} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-4 text-[#0F1E19]">Deliver Excellence</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Consistent training ensures every dish meets the highest standards. Delight your customers with quality they can taste and trust every time.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FDFBF7] hover:bg-white border border-transparent hover:border-[#F47A44]/20 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="text-green-600" size={32} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-4 text-[#0F1E19]">Ensure Safety</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Protect your customers and your reputation. Master food safety protocols to prevent hazards and maintain a spotless hygiene record.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#FDFBF7] hover:bg-white border border-transparent hover:border-[#F47A44]/20 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-16 h-16 rounded-full bg-[#E3F2FD] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Thermometer className="text-blue-600" size={32} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-4 text-[#0F1E19]">Boost Efficiency</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Streamline your kitchen operations. Well-trained staff work smarter, reduce waste, and create a more organized, less stressful environment.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED ARTICLES */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 flex items-center gap-3">
                        <Star className="text-[#F47A44] fill-current" /> Essential Guides
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {featuredArticles.map(article => (
                            <Link key={article.id} href={`/learning/${article.slug}`} className="group block">
                                <div className="relative h-64 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                                    {article.hero_image ? (
                                        <Image
                                            src={article.hero_image}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                                            <span className="opacity-20 text-6xl">🛡️</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F1E19]">
                                            Guide
                                        </span>
                                        {article.is_premium && (
                                            <span className="bg-[#F47A44] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                                <Lock size={10} /> Premium
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <h3 className="font-serif text-2xl font-bold mb-1 group-hover:text-[#F47A44] transition-colors leading-tight">
                                        {article.title}
                                    </h3>
                                    {isLoggedIn && article.progress ? (
                                        <div className="flex items-center gap-2 text-xs font-bold text-[#F47A44] mb-2">
                                            <span>{article.progress}% COMPLETE</span>
                                            <ProgressBar progress={article.progress} />
                                        </div>
                                    ) : null}
                                </div>
                                <p className="text-gray-600 line-clamp-2">
                                    {article.meta_description || getTextSnippet(article.body_content)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* VIDEO RESOURCES */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 flex items-center gap-3">
                    <PlayCircle className="text-[#F47A44] fill-current" /> Training Videos
                </h2>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Featured Video */}
                    {videos.length > 0 ? (
                        <div className="relative">
                            <Link
                                href={videos[0].is_premium && !isLoggedIn ? '#' : `/learning/${videos[0].slug}`}
                                onClick={(e) => {
                                    if (videos[0].is_premium && !isLoggedIn) {
                                        e.preventDefault();
                                    }
                                }}
                                className={`relative rounded-[2rem] overflow-hidden group cursor-pointer h-[400px] md:h-[500px] block ${videos[0].is_premium && !isLoggedIn ? 'pointer-events-none' : ''}`}
                            >
                                <div className="absolute inset-0 bg-black">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                                    {extractYouTubeId(videos[0].youtube_url || '') ? (
                                        <Image
                                            src={`https://img.youtube.com/vi/${extractYouTubeId(videos[0].youtube_url || '')}/maxresdefault.jpg`}
                                            alt={videos[0].title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                            <span className="text-gray-600">No Video</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-[#F47A44] text-white px-3 py-1 rounded-full text-xs font-bold">FEATURED</span>
                                        {videos[0].is_premium && (
                                            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Lock size={12} /> PREMIUM
                                            </span>
                                        )}
                                        <span className="text-gray-300 text-sm">Video Tutorial</span>
                                    </div>
                                    <h3 className="text-white font-serif text-3xl md:text-4xl font-bold mb-2">{videos[0].title}</h3>
                                    <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                                        <span>Start Watching</span> <ArrowRight size={18} />
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <PlayCircle size={40} className="text-white fill-white/20" />
                                    </div>
                                </div>
                            </Link>

                            {/* Premium Lock Overlay */}
                            {videos[0].is_premium && !isLoggedIn && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[2rem] z-30 flex items-center justify-center">
                                    <div className="text-center px-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4">
                                            <Lock size={32} className="text-black" />
                                        </div>
                                        <h4 className="text-white font-bold text-xl mb-2">Premium Content</h4>
                                        <p className="text-white/80 text-sm mb-4">Sign in to access this video</p>
                                        <button
                                            onClick={() => {
                                                const loginForm = document.querySelector('form');
                                                loginForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }}
                                            className="bg-gradient-to-r from-[#F47A44] to-[#E86825] text-white px-6 py-2 rounded-lg font-bold text-sm hover:shadow-lg transition-all"
                                        >
                                            Sign In to Watch
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-gray-500 p-8">No videos available</div>
                    )}

                    <div className="space-y-6">
                        {videos.map(video => {
                            const videoId = extractYouTubeId(video.youtube_url || '');
                            const isLocked = video.is_premium && !isLoggedIn;

                            return (
                                <div key={video.id} className="relative">
                                    <Link
                                        href={isLocked ? '#' : `/learning/${video.slug}`}
                                        onClick={(e) => {
                                            if (isLocked) {
                                                e.preventDefault();
                                                const loginForm = document.querySelector('form');
                                                loginForm?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }
                                        }}
                                        className={`flex gap-6 group cursor-pointer hover:bg-white p-4 rounded-2xl transition-colors ${isLocked ? 'opacity-60' : ''}`}
                                    >
                                        <div className="relative w-40 h-28 flex-shrink-0 bg-gray-200 rounded-xl overflow-hidden">
                                            {videoId ? (
                                                <>
                                                    <Image
                                                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                        alt={video.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        {isLocked ? (
                                                            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                                <Lock size={20} className="text-amber-400" />
                                                            </div>
                                                        ) : (
                                                            <PlayCircle size={24} className="text-white drop-shadow-lg" />
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <PlayCircle size={24} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-serif text-xl font-bold group-hover:text-[#F47A44] transition-colors">{video.title}</h4>
                                                {video.is_premium && (
                                                    <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <Lock size={10} /> PREMIUM
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">Video • Training</span>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}

                        <button className="w-full py-4 rounded-xl border-2 border-[#0F1E19] font-bold text-[#0F1E19] hover:bg-[#0F1E19] hover:text-white transition-colors mt-4">
                            View All Training Modules
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
