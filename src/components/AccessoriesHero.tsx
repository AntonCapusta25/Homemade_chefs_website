"use client";

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Thermometer } from 'lucide-react';
import Image from 'next/image';
import EditableElement from '@/components/admin/EditableElement';

interface AccessoriesHeroProps {
    title?: string;
    subtitle?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate?: (field: string, value: any) => void;
}

export default function AccessoriesHero({ title, subtitle, onUpdate }: AccessoriesHeroProps) {
    // Parse title for semantic line breaks if provided, or use defaults
    const mainTitle = title || "From Your Kitchen <br /><span class='to-table-span'>to THEIR TABLE</span>";
    // We can't really parse logic complexly if we want simple editing.
    // If the user replaces the text, they replace the fancy layout unless they write HTML.
    // That is acceptable for this level of CMS.

    const subTitle = subtitle || "The complete equipment collection for Homemade chefs.";

    return (
        <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/chef-delivery-bg.jpg"
                    alt="Chef delivery"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 mb-6 border border-white/20 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md"
                >
                    <span className="text-[#F47A44] text-xs font-bold tracking-[0.2em] uppercase">Official Homemade Gear</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4"
                >
                    {onUpdate ? (
                        <div className="font-serif text-6xl md:text-8xl font-bold leading-none">
                            <EditableElement
                                tagName="h1"
                                type="html"
                                value={mainTitle}
                                onChange={(val) => onUpdate('hero.title', val)}
                                className="outline-none"
                            />
                        </div>
                    ) : (
                        <h1 className="font-serif text-6xl md:text-8xl font-bold leading-none">
                            {/* Maintain compatibility with previous hardcoded check if it matches exactly, otherwise html */}
                            {(!title || title.includes("From Your Kitchen")) && !title ? (
                                <>
                                    From Your Kitchen <br />
                                    <span className="italic font-light opacity-80 text-4xl md:text-5xl block my-2">to</span>
                                    <span className="text-[#F47A44] uppercase tracking-tight">THEIR TABLE</span>
                                </>
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: mainTitle }} />
                            )}
                        </h1>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {onUpdate ? (
                        <EditableElement
                            tagName="p"
                            value={subTitle}
                            onChange={(val) => onUpdate('hero.subtitle', val)}
                            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light"
                        />
                    ) : (
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light">
                            {subTitle}
                        </p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button className="px-8 py-4 bg-white text-[#0F1E19] rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors">
                        View The Collection <ArrowRight size={18} />
                    </button>

                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-white/60">
                        <span className="flex items-center gap-2 bg-black/30 px-4 py-3 rounded-lg backdrop-blur-md border border-white/5">
                            <span className="text-[#F47A44]"><Thermometer size={16} /></span>
                            Thermal Control
                        </span>
                        <span className="flex items-center gap-2 bg-black/30 px-4 py-3 rounded-lg backdrop-blur-md border border-white/5">
                            <span className="text-[#F47A44]"><ShieldCheck size={16} /></span>
                            Chef Grade
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
            >
                <ArrowRight size={24} className="rotate-90" />
            </motion.div>
        </section>
    );
}
