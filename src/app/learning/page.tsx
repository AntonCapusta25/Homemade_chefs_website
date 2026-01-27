"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, PlayCircle, ArrowRight, Star, ShieldCheck, ClipboardCheck, AlertTriangle, Thermometer, Lock, ChefHat } from 'lucide-react';
import { getAllLearningPages } from '@/actions/learning';

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

    useEffect(() => {
        // Check for mock login
        const checkLogin = () => {
            const loggedIn = document.cookie.includes('mock_logged_in=true');
            setIsLoggedIn(loggedIn);
        }
        checkLogin();

        async function loadPages() {
            const data = await getAllLearningPages();
            setPages(data as LearningPage[]);
        }
        loadPages();
    }, []);

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

                    <div className="flex justify-center mb-8">
                        <div className="flex justify-center mb-8">
                            {isLoggedIn ? (
                                <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md text-white shadow-2xl animate-fade-in-up">
                                    <div className="w-12 h-12 rounded-full bg-[#F47A44] flex items-center justify-center shadow-lg shadow-[#F47A44]/20">
                                        <ChefHat size={24} className="text-[#0F1E19]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-[#F47A44] font-extrabold uppercase tracking-wider mb-1">Welcome Back</p>
                                        <p className="font-serif font-bold text-2xl leading-none">Chef Marco</p>
                                    </div>
                                </div>
                            ) : (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        // Mock Login Logic
                                        document.cookie = "mock_logged_in=true; path=/";
                                        setIsLoggedIn(true);
                                    }}
                                    className="inline-flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md shadow-2xl w-full max-w-lg"
                                >
                                    <div className="flex-1 w-full px-2 flex flex-col gap-2">
                                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5 focus-within:bg-white/10 focus-within:border-white/20 transition-colors">
                                            <ChefHat size={20} className="text-[#F47A44]" />
                                            <input
                                                type="email"
                                                placeholder="Enter your chef email..."
                                                className="bg-transparent border-none outline-none text-white placeholder-white/40 w-full font-medium"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5 focus-within:bg-white/10 focus-within:border-white/20 transition-colors">
                                            <Lock size={20} className="text-[#F47A44]" />
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                className="bg-transparent border-none outline-none text-white placeholder-white/40 w-full font-medium"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto bg-[#F47A44] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#d6602d] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-[#F47A44]/20 flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        Access Resources
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
                        Chef Resources
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10">
                        Essential guides on food safety, hygiene, and kitchen operations.
                    </p>

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
                        <Link
                            href={`/learning/${videos[0].slug}`}
                            className="relative rounded-[2rem] overflow-hidden group cursor-pointer h-[400px] md:h-[500px]"
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
                    ) : (
                        <div className="text-gray-500 p-8">No videos available</div>
                    )}

                    <div className="space-y-6">
                        {videos.map(video => {
                            const videoId = extractYouTubeId(video.youtube_url || '');
                            return (
                                <Link key={video.id} href={`/learning/${video.slug}`} className="flex gap-6 group cursor-pointer hover:bg-white p-4 rounded-2xl transition-colors">
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
                                                    <PlayCircle size={24} className="text-white drop-shadow-lg" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <PlayCircle size={24} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="font-serif text-xl font-bold mb-2 group-hover:text-[#F47A44] transition-colors">{video.title}</h4>
                                        <span className="text-sm text-gray-500">Video • Training</span>
                                    </div>
                                </Link>
                            );
                        })}

                        <button className="w-full py-4 rounded-xl border-2 border-[#0F1E19] font-bold text-[#0F1E19] hover:bg-[#0F1E19] hover:text-white transition-colors mt-4">
                            View All Training Modules
                        </button>
                    </div>
                </div>
            </section>

            {/* ACCESS CTA */}
            <section id="access-form" className="bg-[#F47A44] py-20 px-6">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Get Full Access</h2>
                    <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                        Enter your email to access our complete library of food safety documents and checklists.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const emailInput = (e.target as any).email;
                                const email = emailInput.value;
                                if (!email) return;

                                const btn = e.currentTarget.querySelector('button');
                                if (btn) {
                                    btn.disabled = true;
                                    btn.innerHTML = 'Submitting...';
                                }

                                try {
                                    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/newsletter-subscribe`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                                        },
                                        body: JSON.stringify({ email }),
                                    });

                                    const data = await response.json();

                                    if (response.ok) {
                                        if (btn) {
                                            btn.innerHTML = 'Success! Check your email.';
                                            btn.classList.remove('bg-[#0F1E19]', 'text-white');
                                            btn.classList.add('bg-white', 'text-[#0F1E19]');
                                        }
                                        emailInput.value = '';
                                        alert(data.message || 'Successfully subscribed! You now have full access.');
                                    } else {
                                        if (btn) {
                                            btn.disabled = false;
                                            btn.innerHTML = 'Get Access';
                                        }
                                        alert(data.error || 'Something went wrong. Please try again.');
                                    }
                                } catch (error) {
                                    console.error('Subscription error:', error);
                                    if (btn) {
                                        btn.disabled = false;
                                        btn.innerHTML = 'Get Access';
                                    }
                                    alert('Failed to subscribe. Please try again.');
                                }
                            }}
                            className="flex flex-col md:flex-row gap-4 w-full"
                        >
                            <input
                                name="email"
                                type="email"
                                placeholder="Your email address"
                                className="px-6 py-4 rounded-full text-[#0F1E19] flex-grow outline-none focus:ring-4 focus:ring-white/30"
                                required
                            />
                            <button className="bg-[#0F1E19] text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                Get Access
                            </button>
                        </form>

                    </div>
                </div>
            </section>

        </div>
    );
}
