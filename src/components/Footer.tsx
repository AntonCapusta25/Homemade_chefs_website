"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-[#0F1E19] text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Section: Brand + Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20 mb-20">

                    {/* Brand */}
                    <div className="lg:w-1/3">
                        <div className="relative w-48 h-14 mb-8">
                            <Image
                                src="/logo-full.png"
                                alt="Homemade Logo"
                                fill
                                className="object-contain object-left invert opacity-90" // Invert color for dark bg
                            />
                        </div>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            {t('footer.tagline')}
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <SocialIcon href="https://www.instagram.com/homemade.bv/" icon={Instagram} label="Instagram" />
                            <SocialIcon href="https://x.com/Homemade___" icon={Twitter} label="Twitter" />
                            <SocialIcon href="https://www.facebook.com/homemademeals.net" icon={Facebook} label="Facebook" />
                            <SocialIcon href="https://www.tiktok.com/@homemademealsnl" icon={() => (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            )} label="TikTok" />
                            <SocialIcon href="https://nl.pinterest.com/HomemadeBV/" icon={() => (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                                </svg>
                            )} label="Pinterest" />
                            <SocialIcon href="https://youtube.com/@homemade-nl?si=9VNI_EKSR-n6P7pW" icon={() => (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            )} label="YouTube" />
                            <SocialIcon href="mailto:Chefs@homemademeals.net" icon={Mail} label="Email" />
                        </div>
                    </div>

                    {/* Newsletter */}
                    <NewsletterForm />
                </div>

                {/* Middle Section: Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-16 pb-16">
                    <div>
                        <h4 className="font-bold text-lg mb-6">{t('footer.platform')}</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><FooterLink href="#">{t('footer.browseMenu')}</FooterLink></li>
                            <li><FooterLink href="#">{t('footer.becomeChef')}</FooterLink></li>
                            <li><FooterLink href="#">{t('footer.howItWorks')}</FooterLink></li>
                            <li><FooterLink href="#">{t('footer.giftCards')}</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-6">{t('footer.company')}</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><FooterLink href="#">{t('footer.aboutUs')}</FooterLink></li>
                            <li><FooterLink href="#">{t('footer.careers')}</FooterLink></li>
                            <li><FooterLink href="#">{t('footer.press')}</FooterLink></li>
                            <li><FooterLink href="/blog">{t('nav.blog')}</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-6">{t('footer.support')}</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><FooterLink href="#">{t('footer.helpCenter')}</FooterLink></li>
                            <li><FooterLink href="#">{t('footer.safety')}</FooterLink></li>
                            <li><FooterLink href="#">{t('footer.terms')}</FooterLink></li>
                            <li><FooterLink href="#">{t('footer.privacy')}</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-6">{t('footer.downloadApp')}</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li>
                                <Link href="https://apps.apple.com/nl/app/homemade-b-v/id6547853214?l=en-GB" target="_blank" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 transition-all group">
                                    <div className="bg-white text-black p-1 rounded-full">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 2.052c-.636 0-1.74.52-2.355 1.258-.57.684-1.07 1.763-1.07 2.82 0 1.25.96 2.65 2.18 2.65.62 0 1.63-.48 2.274-1.296.657-.833.955-1.92.955-2.77 0-1.34-1.14-2.662-1.983-2.662zm-3.235 6.425c-1.3-.06-2.42.75-3.03.75-.62 0-1.55-.72-2.55-.72-1.32 0-2.53.76-3.21 1.93-1.37 2.37-.36 5.9 1 7.84.66.95 1.45 2.02 2.5 2.02.98 0 1.42-.64 2.65-.64 1.24 0 1.6.64 2.68.64 1.07 0 1.93-1.09 2.65-2.12.83-1.2 1.17-2.37 1.19-2.43-.02-.01-2.28-.88-2.3-3.48.02-2.17 1.78-3.22 1.86-3.26-.98-1.53-2.56-1.7-3.1-1.73z" /></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-gray-400">{t('footer.downloadOn')}</span>
                                        <span className="text-sm font-bold text-white leading-none">{t('footer.appStore')}</span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="https://play.google.com/store/apps/details?id=com.customer.homemademeals" target="_blank" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 transition-all group">
                                    <div className="bg-white text-black p-1 rounded-full">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-1.61-.758V2.572a.996.996 0 0 1 1.61-.758zm10.742 10.742L19.5 7.406l1.838 1.053c1.196.685 1.196 2.397 0 3.082l-1.838 1.053-5.149-5.148zM15.15 13.5l4.634 2.655-13.447 7.7a.996.996 0 0 1-1.579-.533L15.15 13.5zm-1.004-2.863L4.76 2.678a.992.992 0 0 1 1.58-.533l12.806 7.334-4.996 2.863z" /></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-gray-400">{t('footer.getItOn')}</span>
                                        <span className="text-sm font-bold text-white leading-none">{t('footer.googlePlay')}</span>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom: Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-gray-500">
                    <p>© 2025 Homemade Chefs. {t('footer.allRightsReserved')}</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
                        <Link href="#" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
                        <Link href="#" className="hover:text-white transition-colors">{t('footer.cookies')}</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}

function SocialIcon({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#F47A44] hover:scale-110 transition-all duration-300"
        >
            <Icon size={18} />
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-[#F47A44] hover:translate-x-1 transition-all inline-block">
            {children}
        </Link>
    );
}
