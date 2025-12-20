"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { trackSignupClick } from '@/lib/fbPixel';

export default function PricingHero() {
    const { t } = useLanguage();

    return (
        <section className="relative min-h-screen md:min-h-[auto] md:pt-36 md:pb-24 bg-[#F47A44] overflow-hidden flex flex-col justify-center">
            {/* Background Texture/Pattern - Enhanced for Mobile */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {/* Mobile Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/5 md:hidden pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 md:px-6 text-center text-white z-10 flex flex-col justify-center h-full pt-20 pb-20 md:pt-0 md:pb-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 md:mb-8"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-xs md:text-sm font-bold tracking-widest uppercase mb-4 text-white/90 border border-white/30">
                        Start Your Journey
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.7 }}
                    className="font-serif text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-6 leading-[1.1] md:leading-tight"
                >
                    {t('pricingHero.title').split('\n').map((line, i) => (
                        <span key={i} className="block">
                            {line}
                        </span>
                    ))}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="text-xl md:text-2xl font-light mb-10 md:mb-10 max-w-sm md:max-w-3xl mx-auto opacity-90 leading-relaxed px-2"
                >
                    {t('pricingHero.subtitle')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-4 md:px-0"
                >
                    <Link
                        href="https://signup.homemadechefs.com"
                        onClick={(e) => {
                            e.preventDefault();
                            const url = trackSignupClick('pricing-hero');
                            window.open(url, '_blank');
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F1E19] text-white px-8 py-5 md:py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#0F1E19] transition-all duration-300 shadow-xl"
                    >
                        {t('pricingHero.cta')} <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>

            {/* Wave Divider at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 md:h-16 bg-[#FDFBF7]" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}></div>
        </section>
    );
}
