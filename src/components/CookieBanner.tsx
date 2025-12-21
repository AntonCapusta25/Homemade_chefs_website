"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export default function CookieBanner() {
    const { t } = useLanguage();
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always true, can't be disabled
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Show banner after a short delay
            setTimeout(() => setShowBanner(true), 1000);
        } else {
            // Load saved preferences
            const saved = JSON.parse(consent);
            setPreferences(saved);
            applyConsent(saved);
        }
    }, []);

    const applyConsent = (prefs: CookiePreferences) => {
        // Apply analytics consent (Google Analytics, etc.)
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                'analytics_storage': prefs.analytics ? 'granted' : 'denied',
                'ad_storage': prefs.marketing ? 'granted' : 'denied',
            });
        }

        // Apply marketing consent (Facebook Pixel, TikTok Pixel, etc.)
        if (!prefs.marketing) {
            // Disable marketing pixels if consent not given
            if (typeof window !== 'undefined') {
                (window as any).fbq = function () { };
                (window as any).ttq = function () { };
            }
        }
    };

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
        };
        setPreferences(allAccepted);
        localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
        applyConsent(allAccepted);
        setShowBanner(false);
        setShowSettings(false);
    };

    const handleRejectAll = () => {
        const onlyNecessary = {
            necessary: true,
            analytics: false,
            marketing: false,
        };
        setPreferences(onlyNecessary);
        localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
        applyConsent(onlyNecessary);
        setShowBanner(false);
        setShowSettings(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem('cookie-consent', JSON.stringify(preferences));
        applyConsent(preferences);
        setShowBanner(false);
        setShowSettings(false);
    };

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return; // Can't disable necessary cookies
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
                        onClick={() => !showSettings && setShowBanner(false)}
                    />

                    {/* Cookie Banner */}
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
                    >
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#0F1E19]/10 overflow-hidden">
                                {!showSettings ? (
                                    // Simple Banner View
                                    <div className="p-6 md:p-8">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-[#F47A44]/10 rounded-full flex items-center justify-center">
                                                <Cookie className="w-6 h-6 text-[#F47A44]" />
                                            </div>

                                            <div className="flex-grow">
                                                <h3 className="font-serif text-2xl font-bold text-[#0F1E19] mb-2">
                                                    {t('cookies.title')}
                                                </h3>
                                                <p className="text-[#0F1E19]/70 text-sm md:text-base mb-6 leading-relaxed">
                                                    {t('cookies.description')}
                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <button
                                                        onClick={handleAcceptAll}
                                                        className="px-6 py-3 bg-[#F47A44] hover:bg-[#E86825] text-white rounded-full font-bold transition-all hover:scale-105 shadow-lg"
                                                    >
                                                        {t('cookies.acceptAll')}
                                                    </button>
                                                    <button
                                                        onClick={handleRejectAll}
                                                        className="px-6 py-3 bg-[#0F1E19]/10 hover:bg-[#0F1E19]/20 text-[#0F1E19] rounded-full font-bold transition-all"
                                                    >
                                                        {t('cookies.rejectAll')}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowSettings(true)}
                                                        className="px-6 py-3 border-2 border-[#0F1E19]/20 hover:border-[#0F1E19]/40 text-[#0F1E19] rounded-full font-bold transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        {t('cookies.customize')}
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setShowBanner(false)}
                                                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-[#0F1E19]/10 flex items-center justify-center transition-colors"
                                            >
                                                <X className="w-5 h-5 text-[#0F1E19]/50" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Detailed Settings View
                                    <div className="p-6 md:p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-serif text-2xl font-bold text-[#0F1E19]">
                                                {t('cookies.settingsTitle')}
                                            </h3>
                                            <button
                                                onClick={() => setShowSettings(false)}
                                                className="w-8 h-8 rounded-full hover:bg-[#0F1E19]/10 flex items-center justify-center transition-colors"
                                            >
                                                <X className="w-5 h-5 text-[#0F1E19]/50" />
                                            </button>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            {/* Necessary Cookies */}
                                            <div className="p-4 bg-[#0F1E19]/5 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-[#0F1E19]">{t('cookies.necessary')}</h4>
                                                            <p className="text-xs text-[#0F1E19]/60">{t('cookies.alwaysActive')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="px-3 py-1 bg-green-500/20 text-green-700 text-xs font-bold rounded-full">
                                                        {t('cookies.required')}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[#0F1E19]/70 ml-13">
                                                    {t('cookies.necessaryDesc')}
                                                </p>
                                            </div>

                                            {/* Analytics Cookies */}
                                            <div className="p-4 bg-white border-2 border-[#0F1E19]/10 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                                                            <Cookie className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-[#0F1E19]">{t('cookies.analytics')}</h4>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => togglePreference('analytics')}
                                                        className={`w-12 h-6 rounded-full transition-colors ${preferences.analytics ? 'bg-[#F47A44]' : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'
                                                            }`} />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-[#0F1E19]/70 ml-13">
                                                    {t('cookies.analyticsDesc')}
                                                </p>
                                            </div>

                                            {/* Marketing Cookies */}
                                            <div className="p-4 bg-white border-2 border-[#0F1E19]/10 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                                                            <Cookie className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-[#0F1E19]">{t('cookies.marketing')}</h4>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => togglePreference('marketing')}
                                                        className={`w-12 h-6 rounded-full transition-colors ${preferences.marketing ? 'bg-[#F47A44]' : 'bg-gray-300'
                                                            }`}
                                                    >
                                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${preferences.marketing ? 'translate-x-6' : 'translate-x-0.5'
                                                            }`} />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-[#0F1E19]/70 ml-13">
                                                    {t('cookies.marketingDesc')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={handleSavePreferences}
                                                className="flex-1 px-6 py-3 bg-[#F47A44] hover:bg-[#E86825] text-white rounded-full font-bold transition-all hover:scale-105 shadow-lg"
                                            >
                                                {t('cookies.savePreferences')}
                                            </button>
                                            <button
                                                onClick={handleAcceptAll}
                                                className="flex-1 px-6 py-3 bg-[#0F1E19] hover:bg-black text-white rounded-full font-bold transition-all"
                                            >
                                                {t('cookies.acceptAll')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
