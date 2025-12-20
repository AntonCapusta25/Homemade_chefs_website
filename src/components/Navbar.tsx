"use client";
import React, { useState } from 'react';

import { motion, AnimatePresence, useScroll, useMotionValueEvent, Variants } from 'framer-motion';
import { ArrowRight, Globe, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { trackSignupClick } from '@/lib/fbPixel';

export default function Navbar() {
    const [hidden, setHidden] = React.useState(false);
    const { scrollY } = useScroll();

    // Language Context
    const { language, setLanguage, t } = useLanguage();
    const [isLangOpen, setIsLangOpen] = useState(false);

    const languages: { code: 'en' | 'nl' | 'fr'; label: string }[] = [
        { code: 'en', label: 'English' },
        { code: 'nl', label: 'Nederlands' },
        { code: 'fr', label: 'Français' },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
            setIsLangOpen(false); // close dropdown on scroll
        } else {
            setHidden(false);
        }
    });

    const pathname = usePathname();

    if (pathname.startsWith('/admin')) return null;

    // Mobile Menu Variants
    const menuVariants: Variants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: { duration: 0.5, ease: "easeInOut" }
        },
        open: {
            opacity: 1,
            y: "0%",
            transition: { duration: 0.5, ease: "easeInOut" }
        }
    };

    const linkVariants = {
        closed: { opacity: 0, y: 20 },
        open: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: 0.1 + i * 0.1, duration: 0.4 }
        })
    };

    return (
        <>
            <motion.nav
                variants={{
                    visible: { y: 0 },
                    hidden: { y: -100 }
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4"
            >
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-black/5 rounded-full px-6 py-3 flex items-center justify-between gap-6 md:gap-12 max-w-5xl w-full relative z-50">

                    {/* Logo */}
                    <Link href={language === 'en' ? '/' : `/${language}`} className="flex items-center gap-2 flex-shrink-0 group relative z-50">
                        <div className="relative w-24 md:w-28 h-7 md:h-8">
                            <Image
                                src="/logo-full.png"
                                alt="Homemade"
                                fill
                                className="object-contain object-left group-hover:opacity-80 transition-opacity"
                            />
                        </div>
                    </Link>

                    {/* Desktop Center Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink href="/pricing">{t('nav.pricing')}</NavLink>
                        <NavLink href="/blog">{t('nav.blog')}</NavLink>
                        <NavLink href="/learning">{t('nav.learning')}</NavLink>
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1.5 text-sm font-medium text-[#0F1E19] hover:text-[#F47A44] transition-colors"
                            >
                                <Globe size={18} />
                                <span className="uppercase">{language}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isLangOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-4 w-32 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2"
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setIsLangOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${language === lang.code ? 'text-[#F47A44] font-bold' : 'text-[#0F1E19]'}`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link
                            href="https://signup.homemadechefs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.preventDefault();
                                const url = trackSignupClick('navbar-desktop');
                                window.open(url, '_blank');
                            }}
                            className="bg-[#0F1E19] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#F47A44] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-black/10"
                        >
                            {t('nav.join')} <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                        className="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 bg-[#0F1E19] rounded-full text-white"
                    >
                        <motion.span
                            animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            className="w-5 h-0.5 bg-white block rounded-full transition-transform"
                        />
                        <motion.span
                            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-5 h-0.5 bg-white block rounded-full transition-opacity"
                        />
                        <motion.span
                            animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                            className="w-5 h-0.5 bg-white block rounded-full transition-transform"
                        />
                    </button>

                </div>
            </motion.nav>

            {/* Mobile Full Screen Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 bg-[#F4F1EE] z-40 flex flex-col items-center justify-center pt-24 pb-12 px-6"
                    >
                        {/* Mobile Links */}
                        <div className="flex flex-col items-center gap-8 mb-12">
                            {[
                                { href: '/pricing', label: t('nav.pricing') },
                                { href: '/blog', label: t('nav.blog') },
                                { href: '/learning', label: t('nav.learning') }
                            ].map((item, i) => (
                                <motion.div custom={i} variants={linkVariants} key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="font-serif text-4xl font-bold text-[#0F1E19] hover:text-[#F47A44] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile Language & CTA */}
                        <motion.div
                            variants={linkVariants}
                            custom={3}
                            className="flex flex-col items-center gap-6 w-full max-w-xs"
                        >
                            <div className="flex gap-4 p-2 bg-white rounded-full shadow-sm border border-gray-200">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${language === lang.code ? 'bg-[#0F1E19] text-white shadow-md' : 'text-gray-500 hover:text-[#0F1E19]'}`}
                                    >
                                        {lang.code}
                                    </button>
                                ))}
                            </div>

                            <Link
                                href="https://signup.homemadechefs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const url = trackSignupClick('navbar-mobile');
                                    window.open(url, '_blank');
                                }}
                                className="w-full bg-[#F47A44] text-white px-8 py-5 rounded-full text-lg font-bold hover:bg-[#E86825] transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20"
                            >
                                {t('nav.join')} <ArrowRight size={20} />
                            </Link>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}


function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();
    const { language } = useLanguage();

    // Add language prefix for NL/FR, keep root URLs for EN
    const localizedHref = language === 'en'
        ? href
        : `/${language}${href}`;

    // Check if current path matches (with or without language prefix)
    const pathWithoutLang = pathname.replace(/^\/(nl|fr)/, '') || '/';
    const isActive = pathWithoutLang === href || pathname === localizedHref;

    return (
        <Link
            href={localizedHref}
            className={`font-medium text-sm transition-colors relative group ${isActive ? 'text-[#F47A44] font-bold' : 'text-[#0F1E19] hover:text-[#F47A44]'}`}
        >
            {children}
            <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-[#F47A44] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
            />
        </Link>
    );
}
