"use client";

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import EditableElement from '@/components/admin/EditableElement';
import { useLanguage } from '@/context/LanguageContext';

interface BlogHeroProps {
    title?: string;
    subtitle?: string;
    videoUrl?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate?: (field: string, value: any) => void;
}

export default function BlogHero({ title, subtitle, videoUrl, onUpdate }: BlogHeroProps) {
    const { t } = useLanguage();
    const defaultVideo = "https://cdn.prod.website-files.com/67ca169b9408c827cc9df330%2F6808f23dcef8f60b0e578e45_Become%20a%20Home%20Chef%20in%20The%20Netherlands%20with%20Homemade%20and%20Start%20Your%20Home-Based%20Food%20Business-transcode.mp4";

    const displayTitle = title || t('blog.title');
    // Pre-processing to ensure the class is correct for valid HTML rendering if it comes from JSON like "class='highlight'"
    const processedTitle = displayTitle
        .replace("class='highlight'", 'class="text-transparent bg-clip-text bg-gradient-to-r from-[#F47A44] to-[#E66A38]"');

    const displaySubtitle = subtitle || t('blog.subtitle');

    return (
        <section className="relative w-full h-screen overflow-hidden bg-[#0F1E19]">
            {/* Video Background */}
            <div className="absolute inset-0 z-0 group">
                {/* Editable Video Overlay Trigger */}
                {onUpdate && (
                    <div
                        className="absolute top-4 right-4 z-50 bg-black/50 text-white px-3 py-1 rounded cursor-pointer hover:bg-[#F47A44] transition-colors text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100"
                        onClick={() => {
                            const url = prompt("Enter new Video URL:", videoUrl);
                            if (url && url !== videoUrl) onUpdate('hero.videoUrl', url);
                        }}
                    >
                        Edit Video URL
                    </div>
                )}

                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                    key={videoUrl} // Force re-render on url change
                >
                    <source src={videoUrl || defaultVideo} type="video/mp4" />
                </video>
                {/* Cinematic Bottom Gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0F1E19] via-[#0F1E19]/60 to-transparent" />
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 md:px-16 pb-12 md:pb-20">
                <div className="flex flex-col md:flex-row items-end justify-between w-full gap-10">

                    {/* Bottom Left: Big Headline */}
                    <div className="text-left order-1 md:order-1 max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {onUpdate ? (
                                <EditableElement
                                    tagName="h1"
                                    type="html"
                                    value={processedTitle}
                                    onChange={(val) => onUpdate('hero.title', val)}
                                    className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.9] tracking-tight outline-none"
                                />
                            ) : (
                                <h1
                                    className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.9] tracking-tight"
                                    dangerouslySetInnerHTML={{ __html: processedTitle }}
                                />
                            )}
                        </motion.div>
                    </div>

                    {/* Bottom Right: Intro & Description */}
                    <div className="max-w-xl text-right order-2 md:order-2 flex flex-col items-end">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 mb-6"
                        >
                            <span className="text-[#F47A44] font-bold tracking-[0.2em] text-sm uppercase">The Homemade Blog</span>
                            <span className="w-12 h-[1px] bg-[#F47A44]"></span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {onUpdate ? (
                                <EditableElement
                                    tagName="p"
                                    value={displaySubtitle}
                                    onChange={(val) => onUpdate('hero.subtitle', val)}
                                    className="text-lg md:text-xl text-white/90 leading-relaxed font-light text-right"
                                />
                            ) : (
                                <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
                                    {displaySubtitle}
                                </p>
                            )}
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Scroll Indicator - Moved slightly to not interfere */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 animate-bounce hidden md:block"
            >
                <ArrowDown size={24} />
            </motion.div>
        </section>
    );
}
