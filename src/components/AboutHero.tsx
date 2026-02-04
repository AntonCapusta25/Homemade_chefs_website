"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

export default function AboutHero() {
    const scrollToContent = () => {
        const element = document.getElementById('about-content');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <section className="relative w-full h-[85vh] md:h-screen overflow-hidden bg-[#0F1E19]">
                {/* --- BACKGROUND IMAGE (KEN BURNS) --- */}
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1.0 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="/about/hero-community.png"
                        alt="Community of home chefs"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    {/* Cinematic Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E19] via-[#0F1E19]/50 to-black/20" />
                    <div className="absolute inset-0 bg-black/20" />
                </motion.div>

                {/* --- CONTENT LAYER --- */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end pb-20 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
                    <div className="max-w-5xl">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="inline-block text-[#F47A44] font-bold tracking-widest uppercase text-sm md:text-base mb-6"
                        >
                            About Homemade Chefs
                        </motion.span>

                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
                            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] mb-8"
                        >
                            Empowering the next <br />
                            generation of <br />
                            <span className="text-[#F47A44] italic">culinary entrepreneurs.</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="flex flex-col md:flex-row gap-8 md:gap-16 items-start max-w-3xl"
                        >
                            <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed">
                                We believe that great food starts at home. Our mission is to give every talented home cook the tools, platform, and legal framework to turn their passion into a thriving business.
                            </p>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.button
                        onClick={scrollToContent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-8 right-6 md:right-12 z-20 flex items-center gap-3 text-white/60 hover:text-white transition-colors"
                    >
                        <span className="text-xs uppercase tracking-widest font-bold hidden md:block">Our Vision</span>
                        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                            <ArrowDown size={18} />
                        </div>
                    </motion.button>
                </div>
            </section>

        </>
    );
}
