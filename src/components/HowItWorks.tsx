"use client";

import { motion } from 'framer-motion';
import { ChefHat, Utensils, Flame, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
    const { t } = useLanguage();

    const steps = [
        {
            id: 1,
            title: t('howItWorks.step1Title'),
            description: t('howItWorks.step1Desc'),
            icon: ChefHat,
            color: "text-[#F47A44]",
            image: "/hiw-step-1.jpg"
        },
        {
            id: 2,
            title: t('howItWorks.step2Title'),
            description: t('howItWorks.step2Desc'),
            icon: Utensils,
            color: "text-[#F47A44]",
            image: "/hiw-step-2.jpg"
        },
        {
            id: 3,
            title: t('howItWorks.step3Title'),
            description: t('howItWorks.step3Desc'),
            icon: Flame,
            color: "text-[#F47A44]",
            image: "/hiw-step-3.jpg"
        },
        {
            id: 4,
            title: t('howItWorks.step4Title'),
            description: t('howItWorks.step4Desc'),
            icon: TrendingUp,
            color: "text-[#F47A44]",
            image: "/hiw-step-4.png"
        }
    ];

    return (
        <section id="how-it-works" className="py-16 md:py-24 bg-white relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-12 md:mb-20">
                    <div className="flex justify-center mb-4 md:mb-6">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-50 text-[#F47A44] text-xs font-bold tracking-widest uppercase border border-orange-100">
                            Start Your Journey
                        </span>
                    </div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-3xl md:text-5xl font-bold text-[#0F1E19] mb-3 md:mb-4"
                    >
                        {t('howItWorks.title')}
                    </motion.h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
                        {t('howItWorks.subtitle')}
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting line — desktop only */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 transform -translate-x-1/2" />

                    <div className="space-y-10 md:space-y-24">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`flex flex-col md:flex-row items-center gap-6 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Image — always first on mobile */}
                                    <div className="w-full md:flex-1">
                                        <div className={`relative h-52 sm:h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-500 ${isEven ? 'md:rotate-1' : 'md:-rotate-1'} hover:rotate-0`}>
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover transition-transform duration-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Number badge — desktop centre column only */}
                                    <div className="hidden md:flex relative flex-none">
                                        <div className="w-10 h-10 bg-[#F47A44] rounded-full flex items-center justify-center text-white font-bold text-lg relative z-10 ring-4 ring-white">
                                            {step.id}
                                        </div>
                                    </div>

                                    {/* Text block */}
                                    <div className={`w-full md:flex-1 flex flex-col items-start text-left ${isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>

                                        {/* Mobile: step number + icon on one line */}
                                        <div className="flex items-center gap-3 mb-3 md:hidden">
                                            <div className="w-8 h-8 bg-[#F47A44] rounded-full flex items-center justify-center text-white font-bold text-sm flex-none">
                                                {step.id}
                                            </div>
                                            <div className={step.color}>
                                                <step.icon size={22} strokeWidth={1.5} />
                                            </div>
                                        </div>

                                        {/* Desktop icon */}
                                        <div className={`hidden md:block mb-4 ${step.color}`}>
                                            <step.icon size={32} strokeWidth={1.5} />
                                        </div>

                                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-2 md:mb-4">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-md">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
