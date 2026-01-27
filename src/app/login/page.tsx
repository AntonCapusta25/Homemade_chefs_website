"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChefHat, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login delay
        setTimeout(() => {
            // In a real app, this would set a session. 
            // For this UI demo, we'll just redirect to the learning page
            // potentially passing a query param to simulate 'logged in' state if needed,
            // or we just assume the user 'feels' logged in.
            document.cookie = "mock_logged_in=true; path=/";
            router.push('/learning');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-[#0F1E19]">

            <div className="flex-1 flex flex-col md:flex-row">

                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 z-10">
                    <div className="w-full max-w-md">
                        <Link href="/" className="inline-block mb-12">
                            <div className="relative w-32 h-10">
                                <Image
                                    src="/logo-full.png"
                                    alt="Homemade"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>

                        <div className="mb-10">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F47A44]/10 text-[#F47A44] text-xs font-bold uppercase tracking-wider mb-4">
                                <ChefHat size={14} /> Chef Profile
                            </span>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-[#0F1E19]">
                                Welcome Back, Chef.
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Access your premium learning resources, progress tracking, and exclusive tools.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#0F1E19] mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="chef@example.com"
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-gray-200 focus:border-[#F47A44] focus:ring-4 focus:ring-[#F47A44]/10 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="block text-sm font-bold text-[#0F1E19]">Password</label>
                                    <a href="#" className="text-sm text-gray-400 hover:text-[#F47A44]">Forgot?</a>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-6 py-4 rounded-xl bg-white border border-gray-200 focus:border-[#F47A44] focus:ring-4 focus:ring-[#F47A44]/10 outline-none transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#0F1E19] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#F47A44] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl"
                            >
                                {isLoading ? (
                                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-500">
                                Don't have a Chef Profile? <Link href="/pricing" className="text-[#0F1E19] font-bold hover:underline decoration-[#F47A44] decoration-2 underline-offset-4">Get Access</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Visual */}
                <div className="hidden md:block w-1/2 bg-[#0F1E19] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#F47A44] blur-[100px]"></div>
                        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#2A4A3C] blur-[80px]"></div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="relative w-full max-w-lg aspect-square">
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-[2rem] border border-white/10 shadow-2xl p-8 flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-full bg-[#F47A44] flex items-center justify-center mb-6">
                                        <Lock className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-white font-serif text-3xl font-bold mb-4">Premium Resources</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        "The learning modules on Homemade have transformed how I manage my kitchen. The templates alone are worth the subscription."
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-500 overflow-hidden relative">
                                        {/* Placeholder Avatar */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600"></div>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">Chef Marco P.</p>
                                        <p className="text-[#F47A44] text-sm">Head of Culinary</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
