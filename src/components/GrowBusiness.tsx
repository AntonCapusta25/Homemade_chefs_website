"use client";

import { motion } from "framer-motion";
import { Headphones, BookOpen, Megaphone, Utensils, Tag, Calendar } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';

export default function GrowBusiness() {
    const { t } = useLanguage();

    const features = [
        { icon: Headphones, title: t('growBusiness.feature1'), delay: 0.1 },
        { icon: BookOpen, title: t('growBusiness.feature2'), delay: 0.2 },
        { icon: Megaphone, title: t('growBusiness.feature3'), delay: 0.3 },
        { icon: Utensils, title: t('growBusiness.feature4'), delay: 0.4 },
        { icon: Tag, title: t('growBusiness.feature5'), delay: 0.5 },
        { icon: Calendar, title: t('growBusiness.feature6'), delay: 0.6 }
    ];

    return (
        <section className="py-24 bg-[#EBE9E1]">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl md:text-5xl font-bold text-[#0F1E19] inline-block relative"
                    >
                        {t('growBusiness.title')}
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#0F1E19]" />
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: feature.delay, duration: 0.5 }}
                            whileHover={{ scale: 1.03, rotate: 1 }}
                            className="bg-[#E76F3C] text-[#0F1E19] rounded-[2rem] p-10 flex flex-col items-center justify-center text-center aspect-[4/3] shadow-lg cursor-pointer group"
                        >
                            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                <feature.icon size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold leading-tight max-w-[80%]">
                                {feature.title}
                            </h3>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <motion.a
                        href="https://calendly.com/homemademeals-info/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#0F1E19] text-[#EBE9E1] px-10 py-4 rounded-full font-bold text-lg hover:bg-black transition-colors shadow-xl inline-block"
                    >
                        {t('growBusiness.cta')}
                    </motion.a>
                </div>

            </div>
        </section>
    );
}
