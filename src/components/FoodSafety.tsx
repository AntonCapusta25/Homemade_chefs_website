"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from '@/context/LanguageContext';
import { trackSignupClick } from '@/lib/fbPixel';

export default function FoodSafety() {
    const { t } = useLanguage();

    return (
        <section className="py-24 bg-[#EBE9E1] text-[#0F1E19]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto mb-16"
                >
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                        {t('foodSafety.title')}
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed md:px-12">
                        {t('foodSafety.subtitle')}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-16 items-start">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center text-center space-y-6"
                    >
                        <div className="relative w-28 h-28 md:w-32 md:h-32 mb-2 hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/images/food-safety/utensils.png"
                                alt={t('foodSafety.whyTitle')}
                                fill
                                className="object-contain drop-shadow-md"
                            />
                        </div>
                        <h3 className="font-serif text-2xl font-bold">{t('foodSafety.whyTitle')}</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {t('foodSafety.whyText')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col items-center text-center space-y-6"
                    >
                        <div className="relative w-28 h-28 md:w-32 md:h-32 mb-2 hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/images/food-safety/shield.png"
                                alt={t('foodSafety.trustTitle')}
                                fill
                                className="object-contain drop-shadow-md"
                            />
                        </div>
                        <h3 className="font-serif text-2xl font-bold">{t('foodSafety.trustTitle')}</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {t('foodSafety.trustText')}
                        </p>
                    </motion.div>

                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    <Link
                        href="https://calendly.com/homemademeals-info/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0F1E19] text-[#EBE9E1] px-10 py-5 rounded-full font-bold text-lg hover:bg-black transition-all hover:scale-105 shadow-xl"
                    >
                        {t('foodSafety.cta')} <ArrowRight size={20} />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
