"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

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
        <section ref={targetRef} className="relative h-[400vh] bg-[#FDFBF7]">

            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

                {/* Header */}
                <div className="absolute top-12 left-0 right-0 z-10 text-center px-4">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0F1E19] mb-2">
                        {t('features.title')}
                    </h2>
                    <p className="text-[#F47A44] font-bold text-xl md:text-2xl">
                        {t('features.subtitle')}
                    </p>
                </div>

                {/* The Horizontal Scrolling Track */}
                <motion.div
                    ref={contentRef}
                    style={{ x: contentWidth > 0 ? x : 0 }}
                    className="flex gap-12 px-12 md:px-24 w-max"
                >
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} />
                    ))}
                    {/* Final Call to Action Card at the end of scroll */}
                    <div className="flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[40vw] h-[70vh] flex items-center justify-center bg-[#0F1E19] rounded-[3rem] text-white p-12 text-center">
                        <div>
                            <h3 className="font-serif text-4xl mb-6">{t('features.readyToStart')}</h3>
                            <Link href="https://signup.homemadechefs.com" className="inline-flex items-center gap-2 bg-[#F47A44] hover:bg-[#E86825] px-8 py-4 rounded-full font-bold text-lg transition-colors">
                                {t('features.joinNow')} <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Scroll Progress Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
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
        <div className="flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[60vw] h-[70vh] bg-white rounded-[3rem] border border-gray-100 p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-8 md:gap-12 relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500">

            {/* Visual Side */}
            <div className="w-full md:w-1/2 relative min-h-[250px] md:min-h-full rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100">
                <div className={`absolute inset-0 ${feature.color} opacity-50`}></div>
                <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute top-4 left-4 ${feature.badgeColor} px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider`}>
                    {feature.badge}
                </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#0F1E19] mb-8 leading-tight">
                    {feature.title}
                </h3>
                <div className="space-y-6">
                    {feature.points.map((point: string, i: number) => (
                        <div key={i} className="flex gap-4">
                            <div className="flex-shrink-0 mt-1 text-[#F47A44]">
                                <CheckCircle2 size={24} fill="#FFF" strokeWidth={3} className="bg-orange-100 rounded-full" />
                            </div>
                            <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
                                {point}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
