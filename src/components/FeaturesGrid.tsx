"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { trackSignupClick } from '@/lib/fbPixel';

const features = [
    {
        title: "Create your website in seconds",
        badge: "Build your store",
        points: [
            "Build your store, menu, and pricing in one place.",
            "Upload photos, showcase your dishes, and start accepting orders."
        ],
        image: "/hero-real-2.png",
        color: "bg-orange-50",
        badgeColor: "bg-blue-100 text-blue-700"
    },
    {
        title: "Share Your Storefront and Get Orders Faster",
        badge: "Get your orders",
        points: [
            "Built-in tools turn your phone into a sales engine.",
            "From your first order to your 5,000th, Homemade simplifies sales."
        ],
        image: "/cinematic-serving.png",
        color: "bg-blue-50",
        badgeColor: "bg-purple-100 text-purple-700"
    },
    {
        title: "Track, Fulfill, and Grow with Ease",
        badge: "Manage everything",
        points: [
            "Manage pickup, scheduled orders, and track performance from your dashboard.",
            "Real-time order tracking for you and your customers"
        ],
        image: "/hero-real-4.png",
        color: "bg-purple-50",
        badgeColor: "bg-green-100 text-green-700"
    },
    {
        title: "Build Your Brand and Market Like a Pro",
        badge: "Build your brand",
        points: [
            "Create a professional storefront, logo, and branding.",
            "Use marketing tools to attract more customers and grow your business"
        ],
        image: "/branded-merch.png",
        color: "bg-green-50",
        badgeColor: "bg-orange-100 text-orange-700"
    }
];

export default function FeaturesGrid() {
    return (
        <section className="py-12 md:py-24 px-4 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0F1E19] mb-4">
                        Run Your Home Food Business<br />
                        <span className="text-[#F47A44]">the Easy Way with Homemade</span>
                    </h2>
                </div>

                <div className="space-y-16 md:space-y-24">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                            className={`flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            {/* Image Side */}
                            <div className="flex-1 w-full px-2 md:px-0">
                                <div className="relative group">
                                    <div className={`absolute inset-0 ${feature.color} rounded-[2rem] md:rounded-[3rem] transform rotate-3 group-hover:rotate-6 transition-transform duration-500`} />
                                    <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 bg-white aspect-[4/3] transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <Image
                                            src={feature.image}
                                            alt={feature.badge}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Floating Badge - Optimized for Mobile */}
                                    <div className={`absolute -top-4 md:-top-6 ${index % 2 === 0 ? 'left-4 md:-left-6' : 'right-4 md:-right-6'} ${feature.badgeColor} px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-xs md:text-base shadow-lg transform group-hover:scale-105 transition-transform duration-300 z-10 flex items-center gap-2 border border-white`}>
                                        {feature.badge}
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
                                <h3 className="font-serif text-2xl md:text-4xl font-bold text-[#0F1E19] leading-tight px-4 md:px-0">
                                    {feature.title}
                                </h3>

                                <div className="space-y-4 md:space-y-6 text-left inline-block md:block">
                                    {feature.points.map((point, i) => (
                                        <div key={i} className="flex gap-3 md:gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#F47A44]/10 flex items-center justify-center text-[#F47A44]">
                                                    <CheckCircle2 size={14} className="md:w-4 md:h-4" strokeWidth={3} />
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-base md:text-lg font-medium leading-relaxed">
                                                {point}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 md:mt-24 text-center">
                    <Link
                        href="https://signup.homemadechefs.com"
                        onClick={(e) => {
                            e.preventDefault();
                            const url = trackSignupClick('features-grid');
                            window.open(url, '_blank');
                        }}
                        className="inline-flex items-center justify-center gap-3 bg-[#0F1E19] text-white px-8 py-4 md:px-10 md:py-5 rounded-full text-lg md:text-xl font-bold hover:bg-[#F47A44] transition-all duration-300 shadow-xl hover:shadow-orange-500/25 hover:-translate-y-1 w-full md:w-auto"
                    >
                        Become a Home Chef Now! <ArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}
