"use client";

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, ArrowDown, ShieldCheck, Thermometer, ChefHat } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function AccessoriesHero() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full h-screen bg-[#0F1E19] overflow-hidden flex items-end pb-20 md:items-center md:pb-0 justify-center">

            {/* Full Screen Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/chef-delivery-bag-hero.png"
                    alt="Chef delivering food with Homemade bag"
                    fill
                    className="object-cover object-center opacity-70 scale-105"
                    priority
                />
                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E19] via-[#0F1E19]/30 to-[#0F1E19]/60" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center">

                {/* Premium Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl"
                >
                    <ChefHat size={14} className="text-[#F47A44]" />
                    <span className="text-xs font-bold text-white tracking-[0.2em] uppercase">{t('accessoriesHero.badge')}</span>
                </motion.div>

                {/* Narrative Typography */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center font-bold text-white leading-[0.95] mb-8 drop-shadow-2xl"
                >
                    {/* Chef Line */}
                    <span className="font-serif text-5xl md:text-8xl tracking-tight mb-2 md:mb-4 relative">
                        {t('accessoriesHero.title1')}
                        {/* Decorative Underline */}
                        <motion.span
                            initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.8, duration: 0.8 }}
                            className="absolute -bottom-2 left-0 h-1 bg-white/20 rounded-full hidden md:block"
                        />
                    </span>

                    {/* Connection Word */}
                    <span className="text-lg md:text-2xl font-serif italic text-white/60 my-2">
                        {t('accessoriesHero.to')}
                    </span>

                    {/* Delivery Line */}
                    <span className="text-6xl md:text-9xl font-sans uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#F47A44] to-[#E66A38]">
                        {t('accessoriesHero.title2')}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-2xl text-white/80 max-w-2xl leading-relaxed font-light mb-12"
                >
                    {t('accessoriesHero.subtitle')} <br className="hidden md:block" />
                    <span className="text-white font-medium">{t('accessoriesHero.subtitleHighlight')}</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col md:flex-row gap-6 items-center"
                >
                    <button className="bg-white text-[#0F1E19] px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-[#F47A44] hover:text-white transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_#F47A44] group">
                        <ShoppingBag size={20} />
                        {t('accessoriesHero.cta')}
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Functional Badges */}
                    <div className="flex gap-4">
                        <div className="px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/90 text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
                            <Thermometer size={16} className="text-[#F47A44]" /> {t('accessoriesHero.thermalControl')}
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/90 text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default">
                            <ShieldCheck size={16} className="text-[#F47A44]" /> {t('accessoriesHero.chefGrade')}
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce cursor-pointer"
            >
                <ArrowDown size={24} />
            </motion.div>
        </section>
    );
}
