"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown, Target, Globe } from "lucide-react";

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

            {/* --- MISSION & VISION (Split Section) --- */}
            <section id="about-content" className="py-24 md:py-32 bg-[#FDFBF7]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
                        {/* Mission Bento Card (Dark) */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#0F1E19] text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F47A44]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                            <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif mb-6">Our Mission</h2>
                            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
                                To democratize the food industry by giving every talented home cook the tools, platform, and specific legal framework they need to turn their passion into a thriving, legitimate business. We are lowering the barrier to entry for food entrepreneurs.
                            </p>
                        </motion.div>

                        {/* Vision Bento Card (Light/Accent) */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-white text-[#0F1E19] p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
                        >
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#F47A44]/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
                            <div className="bg-[#E86825]/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 border border-[#E86825]/20">
                                <Globe className="w-6 h-6 text-[#E86825]" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-[#0F1E19]">Our Vision</h2>
                            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                                A world where local food economies are powered by neighbors. We envision a future where ordering authentic, homemade meals is as common as ordering pizza, connecting communities through the universal language of food and culture.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
