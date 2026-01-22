"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Play, Star, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { trackSignupClick, trackAppDownload } from '@/lib/fbPixel';

interface GrandHeroProps {
    title?: string;
    subtitle?: string;
    primaryCta?: string;
    secondaryCta?: string;
}

export default function GrandHero({ title, subtitle, primaryCta, secondaryCta }: GrandHeroProps) {
    const [index, setIndex] = useState(0);
    const { t } = useLanguage();

    const heroContent = [
        {
            image: "/hero-real-1.webp",
            headline: title || t("hero.mainHeadline"),
            testimonial: {
                quote: t("hero.slide1Quote"),
                name: t("hero.slide1Name"),
                role: t("hero.slide1Role"),
                avatar: "/hero-real-1.webp",
                position: "top-32 right-12"
            }
        },
        {
            image: "/hero-real-5.webp",
            headline: title || t("hero.slide2Headline"),
            testimonial: {
                quote: t("hero.slide2Quote"),
                name: t("hero.slide2Name"),
                role: t("hero.slide2Role"),
                avatar: "/hero-real-5.webp",
                position: "bottom-40 right-20"
            }
        },
        {
            image: "/hero-real-4.webp",
            headline: title || t("hero.slide3Headline"),
            testimonial: {
                quote: t("hero.slide3Quote"),
                name: t("hero.slide3Name"),
                role: t("hero.slide3Role"),
                avatar: "/hero-real-4.webp",
                position: "top-40 right-1/4"
            }
        },
        {
            image: "/hero-real-2.webp",
            headline: title || t("hero.slide4Headline"),
            testimonial: {
                quote: t("hero.slide4Quote"),
                name: t("hero.slide4Name"),
                role: t("hero.slide4Role"),
                avatar: "/hero-real-2.webp",
                position: "bottom-32 right-32"
            }
        },
        {
            image: "/hero-real-3.webp",
            headline: title || t("hero.slide5Headline"),
            testimonial: {
                quote: t("hero.slide5Quote"),
                name: t("hero.slide5Name"),
                role: t("hero.slide5Role"),
                avatar: "/hero-real-3.webp",
                position: "top-1/3 right-10"
            }
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % heroContent.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [heroContent.length]);

    return (
        <section className="relative w-full h-screen overflow-hidden bg-[#0F1E19]">

            {/* --- BACKGROUND SLIDESHOW (KEN BURNS) --- */}
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1.0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={heroContent[index].image}
                        alt="Home Chef"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                        fetchPriority="high"
                    />
                    {/* Cinematic Overlay Gradient - Darkened for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E19] via-[#0F1E19]/40 to-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F1E19]/90 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* --- CONTENT LAYER --- */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end pb-24 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">

                <div className="max-w-4xl md:mt-0">
                    {/* Animated Headline that changes with image */}
                    <div className="h-[180px] md:h-[320px] lg:h-[400px] overflow-visible relative mb-4 flex items-end pb-2">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={index}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                                className="font-serif text-5xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.95]"
                            >
                                {heroContent[index].headline.split('\n').map((line, i) => (
                                    <span key={i} className="block">{line}</span>
                                ))}
                            </motion.h1>
                        </AnimatePresence>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-white/80 text-lg md:text-2xl max-w-xl mb-8 font-light leading-relaxed drop-shadow-md"
                    >
                        {subtitle || t("hero.mainSubtitle")}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 mb-12"
                    >
                        <Link
                            href="https://signup.homemadechefs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.preventDefault();
                                const url = trackSignupClick('hero-section');
                                window.open(url, '_blank');
                            }}
                            className="group inline-flex items-center justify-center gap-2 bg-[#F47A44] hover:bg-[#E86825] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-2xl w-full sm:w-auto"
                        >
                            {primaryCta || t("hero.startCooking")}
                            <ArrowUpRight className="group-hover:rotate-45 transition-transform" size={20} />
                        </Link>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="flex items-center gap-6 text-white/60"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F1E19] overflow-hidden bg-white/20 relative">
                                    <Image
                                        src={`/chef-avatar-${i}.png`}
                                        alt={`Chef ${i}`}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={16} fill="#F47A44" className="text-[#F47A44]" />
                                ))}
                            </div>
                            <span className="text-sm font-medium">{t('hero.happyChefs')}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Testimonial Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className={`hidden lg:block absolute ${heroContent[index].testimonial.position} max-w-sm`}
                    >
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
                            <p className="text-white text-sm mb-4 italic leading-relaxed">
                                &quot;{heroContent[index].testimonial.quote}&quot;
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
                                    <Image
                                        src={heroContent[index].testimonial.avatar}
                                        alt={heroContent[index].testimonial.name}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">{heroContent[index].testimonial.name}</div>
                                    <div className="text-white/60 text-xs">{heroContent[index].testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40"
            >
                <span className="text-xs uppercase tracking-widest font-bold">{t("hero.scroll")}</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    <ChevronDown size={24} />
                </motion.div>
            </motion.div>

        </section>
    );
}
