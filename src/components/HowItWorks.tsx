"use client";

import { motion } from 'framer-motion';
import { Store, Camera, CookingPot, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
    const { t } = useLanguage();

    const steps = [
        {
            id: 1,
            title: t('howItWorks.step1Title'),
            description: t('howItWorks.step1Desc'),
            icon: Store,
            color: "bg-orange-100 text-orange-600",
            image: "/hiw-profile-setup.png" // Create Your Profile
        },
        {
            id: 2,
            title: t('howItWorks.step2Title'),
            description: t('howItWorks.step2Desc'),
            icon: Camera,
            color: "bg-green-100 text-green-600",
            image: "/hiw-food-photo.png" // Post Your Menu
        },
        {
            id: 3,
            title: t('howItWorks.step3Title'),
            description: t('howItWorks.step3Desc'),
            icon: CookingPot,
            color: "bg-teal-100 text-teal-600",
            image: "/hiw-serving-food.png" // Cook & Connect
        },
        {
            id: 4,
            title: t('howItWorks.step4Title'),
            description: t('howItWorks.step4Desc'),
            icon: TrendingUp,
            color: "bg-yellow-100 text-yellow-600",
            image: "/hiw-earnings-growth.png" // Earn & Thrive
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <div className="flex justify-center mb-6">
                        <span className="inline-block py-1 ps-3 pe-3 rounded-full bg-orange-50 text-[#F47A44] text-xs font-bold tracking-widest uppercase border border-orange-100">
                            Start Your Journey
                        </span>
                    </div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-4xl md:text-5xl font-bold text-[#0F1E19] mb-4"
                    >
                        {t('howItWorks.title')}
                    </motion.h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        {t('howItWorks.subtitle')}
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Hidden on mobile) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 transform -translate-x-1/2" />

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Text Content */}
                                    <div className={`flex-1 text-center md:text-left ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className={`inline-flex p-3 rounded-2xl mb-4 ${step.color} ${isEven ? 'md:mr-0' : 'md:ml-0'}`}>
                                            <step.icon size={28} />
                                        </div>
                                        <h3 className="font-serif text-3xl font-bold text-[#0F1E19] mb-4">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto md:mx-0 ml-auto">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Number Badge (Center) */}
                                    <div className="relative flex-none">
                                        <div className="w-12 h-12 bg-[#F47A44] rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10 shadow-lg shadow-orange-200">
                                            {step.id}
                                        </div>
                                        <div className="absolute inset-0 bg-[#F47A44] rounded-full animate-ping opacity-20" />
                                    </div>

                                    {/* Image Card */}
                                    <div className="flex-1 w-full">
                                        <div className={`relative h-64 md:h-80 w-full rounded-3xl overflow-hidden shadow-xl group ${isEven ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform duration-500`}>
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
