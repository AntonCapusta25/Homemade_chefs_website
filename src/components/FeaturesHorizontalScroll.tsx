"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { trackSignupClick } from '@/lib/fbPixel';

export default function FeaturesHorizontalScroll() {
    const { t } = useLanguage();

    const features = [
        {
            title: t('features.feature1Title'),
            badge: t('features.feature1Badge'),
            points: [
                t('features.feature1Point1'),
                t('features.feature1Point2'),
            ],
            image: "/feature-store.png",
            color: "bg-orange-50",
            badgeColor: "bg-blue-100 text-blue-700",
        },
        {
            title: t('features.feature2Title'),
            badge: t('features.feature2Badge'),
            points: [
                t('features.feature2Point1'),
                t('features.feature2Point2'),
            ],
            image: "/feature-orders.png",
            color: "bg-blue-50",
            badgeColor: "bg-purple-100 text-purple-700",
        },
        {
            title: t('features.feature3Title'),
            badge: t('features.feature3Badge'),
            points: [
                t('features.feature3Point1'),
                t('features.feature3Point2'),
            ],
            image: "/feature-dashboard.png",
            color: "bg-purple-50",
            badgeColor: "bg-green-100 text-green-700",
        },
        {
            title: t('features.feature4Title'),
            badge: t('features.feature4Badge'),
            points: [
                t('features.feature4Point1'),
                t('features.feature4Point2'),
            ],
            image: "/feature-marketing.png",
            color: "bg-green-50",
            badgeColor: "bg-orange-100 text-orange-700",
        },
    ];

    const targetRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [contentWidth, setContentWidth] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(0);

    // Measure widths on mount and resize
    useEffect(() => {
        const handleResize = () => {
            if (contentRef.current) {
                setContentWidth(contentRef.current.scrollWidth);
                setViewportWidth(window.innerWidth);
            }
        };

        // Initial measure
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    // Calculate the maximum scroll distance
    const scrollDistance = contentWidth > viewportWidth ? contentWidth - viewportWidth + 100 : 0;

    // Only apply transform if we have dimensions
    const x = useTransform(scrollYProgress, [0, 1], ["0px", `-${scrollDistance}px`]);

    return (
        <section ref={targetRef} className="relative h-auto md:h-[400vh] bg-[#FDFBF7]">

            <div className="relative h-auto md:sticky md:top-0 md:h-screen flex flex-col justify-center overflow-hidden py-16 md:py-0">

                {/* Header */}
                <div className="relative md:absolute top-0 md:top-12 left-0 right-0 z-10 text-center px-4 mb-10 md:mb-0">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0F1E19] mb-2">
                        {t('features.title')}
                    </h2>
                    <p className="text-[#F47A44] font-bold text-xl md:text-2xl">
                        {t('features.subtitle')}
                    </p>
                </div>

                {/* MOBILE: Native Horizontal Scroll Track */}
                <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 px-4 w-full pb-8 scrollbar-hide cursor-grab active:cursor-grabbing">
                    {features.map((feature, index) => (
                        <div key={index} className="snap-center flex-shrink-0">
                            <FeatureCard feature={feature} />
                        </div>
                    ))}
                    {/* Mobile CTA Card */}
                    <div className="snap-center flex-shrink-0 w-[85vw] bg-[#0F1E19] rounded-3xl text-white p-8 text-center flex flex-col items-center justify-center shadow-lg">
                        <h3 className="font-serif text-3xl mb-6">{t('features.readyToStart')}</h3>
                        <Link
                            href="https://signup.homemadechefs.com"
                            onClick={(e) => {
                                e.preventDefault();
                                const url = trackSignupClick('features-scroll');
                                window.open(url, '_blank');
                            }}
                            className="inline-flex items-center gap-2 bg-[#F47A44] hover:bg-[#E86825] px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-md"
                        >
                            {t('features.joinNow')} <ArrowRight />
                        </Link>
                    </div>
                </div>

                {/* DESKTOP: Animated Horizontal Scroll Track */}
                <motion.div
                    ref={contentRef}
                    style={{ x: contentWidth > 0 ? x : 0 }}
                    className="hidden md:flex gap-12 px-24 w-max"
                >
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} />
                    ))}
                    {/* Desktop Final Call to Action Card */}
                    <div className="flex-shrink-0 w-[60vw] lg:w-[40vw] h-[70vh] flex items-center justify-center bg-[#0F1E19] rounded-[3rem] text-white p-12 text-center">
                        <div>
                            <h3 className="font-serif text-4xl mb-6">{t('features.readyToStart')}</h3>
                            <Link
                                href="https://signup.homemadechefs.com"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const url = trackSignupClick('features-scroll');
                                    window.open(url, '_blank');
                                }}
                                className="inline-flex items-center gap-2 bg-[#F47A44] hover:bg-[#E86825] px-8 py-4 rounded-full font-bold text-lg transition-colors"
                            >
                                {t('features.joinNow')} <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Scroll Progress Indicator (Desktop Only) */}
                <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 gap-2">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('features.scrollToExplore')}</div>
                </div>

            </div>
        </section>
    );
}

interface FeatureProps {
    title: string;
    badge: string;
    points: string[];
    image: string;
    color: string;
    badgeColor: string;
}

function FeatureCard({ feature }: { feature: FeatureProps }) {
    return (
        <div className="flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[60vw] h-auto md:h-[70vh] bg-white rounded-3xl md:rounded-[3rem] border border-gray-100 p-5 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] md:shadow-sm flex flex-col md:flex-row gap-6 md:gap-12 relative overflow-hidden group hover:shadow-xl md:hover:shadow-2xl transition-all duration-500">

            {/* Visual Side */}
            <div className="w-full md:w-1/2 relative aspect-video md:aspect-auto md:h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100">
                <div className={`hidden md:block absolute inset-0 ${feature.color} opacity-50`}></div>
                <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 85vw, (max-width: 1024px) 35vw, 30vw"
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Mobile Badge (Inside Image) */}
                <div className={`md:hidden absolute top-3 left-3 ${feature.badgeColor} px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md bg-opacity-95 border border-white/40`}>
                    {feature.badge}
                </div>

                {/* Desktop Badge (Overlay) */}
                <div className={`hidden md:block absolute top-4 left-4 ${feature.badgeColor} px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider`}>
                    {feature.badge}
                </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center pb-2 md:pb-0">
                <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-[#0F1E19] mb-4 md:mb-8 leading-tight">
                    {feature.title}
                </h3>
                <div className="space-y-4 md:space-y-6">
                    {feature.points.map((point: string, i: number) => (
                        <div key={i} className="flex gap-3 md:gap-4 items-start">
                            <div className="flex-shrink-0 mt-1 text-[#F47A44]">
                                <CheckCircle2 size={18} fill="#FFF" strokeWidth={3} className="bg-orange-100 rounded-full md:w-6 md:h-6" />
                            </div>
                            <p className="text-gray-600 text-sm md:text-lg lg:text-xl font-medium leading-relaxed">
                                {point}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
