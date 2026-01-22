"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";

export default function ChefInvitePopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

    // Initialize popup logic
    useEffect(() => {
        // Check if already seen/closed
        const hasSeenPopup = localStorage.getItem("chef_invite_seen");
        if (hasSeenPopup) return;

        // Show after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
            triggerConfetti();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Countdown timer logic
    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isVisible]);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem("chef_invite_seen", "true");
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999999 };

        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#F47A44', '#FFD700', '#ffffff'] // Orange, Gold, White
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#F47A44', '#FFD700', '#ffffff']
            });
        }, 250);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Popup Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white text-gray-500 rounded-full transition-all backdrop-blur-sm"
                        >
                            <X size={20} />
                        </button>

                        {/* Left Side - Content */}
                        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center items-start text-left z-10 bg-white">

                            {/* Badge */}
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-[#F47A44] font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#F47A44]" />
                                Limited Chef Spots
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-[1.1] mb-4">
                                Join as a <br />
                                <span className="text-[#F47A44]">Home Chef</span>
                            </h2>

                            <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-sm">
                                Start your own delivery business from your home kitchen today.
                            </p>

                            {/* Timer */}
                            <div className="flex items-center gap-4 mb-8 w-full">
                                <div className="bg-[#F8F9FA] px-4 py-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                    <Clock size={20} className="text-[#F47A44]" />
                                    <span className="font-mono font-bold text-2xl text-gray-900">{formatTime(timeLeft)}</span>
                                </div>
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide max-w-[80px] leading-tight">
                                    Until spots fill up
                                </span>
                            </div>

                            {/* CTA */}
                            <a
                                href="https://signup.homemadechefs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                    localStorage.setItem("chef_invite_clicked", "true");
                                    handleClose();
                                }}
                                className="group w-full md:w-auto px-8 py-4 bg-[#0F1E19] hover:bg-black text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl"
                            >
                                Register Now
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        {/* Right Side - Image */}
                        <div className="hidden md:block w-full md:w-1/2 relative bg-gray-100 min-h-[200px] md:min-h-full">
                            <Image
                                src="/chef-popup-authentic.png"
                                alt="Chef cooking"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
