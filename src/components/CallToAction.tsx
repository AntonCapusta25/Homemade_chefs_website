"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Smartphone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { trackSignupClick, trackAppDownload } from '@/lib/fbPixel';

interface CallToActionProps {
    title?: string;
    subtitle?: string;
    buttonText?: string;
}

export default function CallToAction({ title, subtitle, buttonText }: CallToActionProps) {
    const { t } = useLanguage();

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#0F1E19] rounded-[3rem] overflow-hidden relative min-h-[500px] flex items-center justify-center text-center px-6 md:px-12"
                >
                    {/* ... background elements ... */}
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900 via-transparent to-transparent" />
                        <div className="absolute w-full h-full bg-[radial-gradient(#1f3d33_2px,transparent_2px)] bg-[size:30px_30px]"></div>
                    </div>

                    {/* Gradient Orbs */}
                    <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#F47A44] rounded-full blur-[120px] opacity-40 mix-blend-screen" />
                    <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-teal-600 rounded-full blur-[120px] opacity-40 mix-blend-screen" />

                    <div className="relative z-10 max-w-4xl mx-auto py-20">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium tracking-wider uppercase mb-8 border border-white/10"
                        >
                            {t('cta.limitedSpots')}
                        </motion.span>

                        <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                            {title || <>{t('cta.headline').split('\n')[0]}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47A44] to-orange-300">{t('cta.headline').split('\n')[1]}</span></>}
                        </h2>

                        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                            {subtitle || t('cta.subheadline')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="https://signup.homemadechefs.com"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const url = trackSignupClick('cta-section');
                                    window.open(url, '_blank');
                                }}
                                className="w-full sm:w-auto px-8 py-5 bg-[#F47A44] hover:bg-[#E86825] text-white rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 group"
                            >
                                {buttonText || t('cta.getStarted')}
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="https://play.google.com/store/apps/details?id=com.customer.homemademeals"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackAppDownload('google-play')}
                                className="w-full sm:w-auto px-8 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <Smartphone size={20} />
                                {t('cta.downloadApp')}
                            </Link>
                        </div>

                        <p className="mt-8 text-sm text-gray-500">
                            {t('cta.noCredit')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
