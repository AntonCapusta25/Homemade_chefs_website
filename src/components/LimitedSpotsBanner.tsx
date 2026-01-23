"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { useLanguage } from '@/context/LanguageContext';

export default function LimitedSpotsBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
    const { t } = useLanguage();

    // Initialize logic
    useEffect(() => {
        // Show after 10 seconds
        const timer = setTimeout(() => {
            const hasSeen = sessionStorage.getItem("limited_spots_seen");
            if (!hasSeen) {
                setIsVisible(true);
                triggerConfetti();
            }
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    // Countdown logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const triggerConfetti = () => {
        const duration = 2000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: 9999999 };
        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 30 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.1, 0.9), y: random(0.8, 0.9) }, // Bottom area
                colors: ['#F47A44', '#0F1E19', '#ffffff']
            });
        }, 250);
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-5xl px-4 pointer-events-none"
            >
                <div className="bg-[#0F1E19] text-white rounded-xl md:rounded-2xl shadow-2xl p-1.5 md:px-6 md:py-3 flex flex-row items-center justify-between gap-1.5 md:gap-8 border border-[#F47A44]/20 pointer-events-auto relative overflow-hidden">

                    {/* 1. Left: Limited Spots Badge */}
                    <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                        <span className="relative flex h-2 w-2 md:h-3 md:w-3 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F47A44] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-[#F47A44]"></span>
                        </span>
                        <span className="font-bold text-[#F47A44] uppercase tracking-wider text-[10px] md:text-sm whitespace-nowrap">
                            Limited Spots
                        </span>
                    </div>

                    {/* 2. Center: Timer Only */}
                    <div className="flex flex-row items-center justify-center flex-1 text-center min-w-0">
                        <span className="font-serif font-bold text-lg md:text-xl leading-tight whitespace-nowrap hidden md:inline mr-4">Price Increasing Soon!</span>
                        <span className="text-xs md:text-xl text-[#F47A44] font-mono font-bold tracking-widest bg-black/20 px-2 py-1 md:px-3 md:py-1 rounded-md whitespace-nowrap">
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* 3. Right: Action + Close */}
                    <div className="flex items-center gap-1.5 md:gap-4 shrink-0">
                        <a
                            href="https://signup.homemadechefs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 md:px-6 md:py-2.5 bg-[#F47A44] hover:bg-[#E86825] text-white text-[10px] md:text-sm font-bold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1 md:gap-2 shadow-lg shadow-orange-900/20 whitespace-nowrap"
                        >
                            Start Cooking
                            <ArrowRight size={12} className="hidden md:block" />
                        </a>

                        <button
                            onClick={() => { setIsVisible(false); sessionStorage.setItem("limited_spots_seen", "true"); }}
                            className="p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
                            aria-label="Close"
                        >
                            <X size={14} className="text-white/60 md:w-[18px] md:h-[18px]" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
