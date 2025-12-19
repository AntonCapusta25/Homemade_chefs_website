"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useState, useEffect } from "react";

export default function LiveSupport() {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Show after 2 seconds
        const showTimer = setTimeout(() => setShowTooltip(true), 2000);

        // Hide after 8 seconds (6 seconds visibility)
        const hideTimer = setTimeout(() => setShowTooltip(false), 8000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-[350px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 font-sans"
                    >
                        <div className="bg-[#E76F3C] p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#E76F3C]" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Chat with us</h4>
                                    <p className="text-xs opacity-90">We typically reply in minutes</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 h-[300px] bg-slate-50 overflow-y-auto">
                            <div className="bg-white p-4 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-sm border border-gray-100 max-w-[85%] mb-4">
                                <p className="text-sm text-gray-600">Hi there! 👋 How can we help you start your cooking journey today?</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F3C]/50"
                                />
                                <button className="w-9 h-9 bg-[#E76F3C] text-white rounded-full flex items-center justify-center hover:bg-[#d65f2c] transition-colors">
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button matches the reference image style */}
            {/* Floating Trigger Button - Creative & Animated */}
            <motion.div
                className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
            >
                {/* Initial "We're online" tooltip that fades in/out */}
                <AnimatePresence>
                    {showTooltip && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 10, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white text-[#0F1E19] px-4 py-2 rounded-xl shadow-lg border border-gray-100 mb-2 relative mr-2"
                        >
                            <span className="font-bold text-sm">We&apos;re online! 👋</span>
                            <div className="absolute -bottom-1 right-4 w-3 h-3 bg-white border-r border-b border-gray-100 transform rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 bg-[#E76F3C] text-white rounded-full shadow-2xl flex items-center justify-center relative hover:bg-[#d65f2c] transition-colors"
                >
                    {/* Pulsing Ring */}
                    <span className="absolute inset-0 rounded-full border-2 border-[#E76F3C] animate-ping opacity-75" />

                    {/* Icon with subtle rotate/wiggle */}
                    {isOpen ? (
                        <X size={28} />
                    ) : (
                        <motion.div
                            animate={{
                                rotate: [0, -10, 10, -10, 10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        >
                            <MessageCircle size={28} fill="currentColor" className="text-white" />
                        </motion.div>
                    )}

                    {/* Status Dot */}
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                </motion.button>
            </motion.div>
        </>
    );
}
