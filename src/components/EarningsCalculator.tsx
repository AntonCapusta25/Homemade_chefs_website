"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useLanguage } from '@/context/LanguageContext';
import { trackSignupClick } from '@/lib/fbPixel';

export default function EarningsCalculator() {
    const { t } = useLanguage();
    const [pricePerMeal, setPricePerMeal] = useState(25);
    const [daysPerWeek, setDaysPerWeek] = useState(5);
    const [mealsPerDay, setMealsPerDay] = useState(10);

    const weekly = pricePerMeal * mealsPerDay * daysPerWeek;
    const monthly = weekly * 4.33;
    const yearly = weekly * 52;

    const earnings = {
        weekly: Math.round(weekly),
        monthly: Math.round(monthly),
        yearly: Math.round(yearly)
    };

    const benefits = [
        t('earnings.benefit1'),
        t('earnings.benefit2'),
        t('earnings.benefit3'),
        t('earnings.benefit4'),
        t('earnings.benefit5')
    ];

    return (
        <section className="py-24 bg-[#EBE9E1]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#0F1E19]">
                        {t('earnings.title')}
                    </h2>

                    <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-medium">
                        <p>{t('earnings.intro1')}</p>
                        <p>
                            {t('earnings.intro2')} <span className="text-[#F47A44] font-bold">{t('earnings.possibilities')}</span>
                        </p>
                    </div>

                    <div className="space-y-4 pt-2">
                        {benefits.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Check size={20} className="text-[#F47A44] flex-shrink-0" strokeWidth={3} />
                                <span className="text-gray-700 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-100"
                >
                    <div className="text-center mb-10">
                        <h3 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-2">{t('earnings.calcTitle')}</h3>
                        <p className="text-gray-500 font-medium">{t('earnings.calcSubtitle')}</p>
                    </div>

                    <div className="space-y-8 mb-10">
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label htmlFor="price-per-meal" className="font-bold text-[#1A1A1A] text-lg">{t('earnings.pricePerMeal')}</label>
                                <span className="text-[#F47A44] font-bold text-xl">€{pricePerMeal}</span>
                            </div>
                            <input
                                id="price-per-meal"
                                type="range"
                                min="10"
                                max="100"
                                step="1"
                                value={pricePerMeal}
                                onChange={(e) => setPricePerMeal(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F47A44]"
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-400 font-medium">
                                <span>€10</span>
                                <span>€100</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label htmlFor="days-per-week" className="font-bold text-[#1A1A1A] text-lg">{t('earnings.daysPerWeek')}</label>
                                <span className="text-[#F47A44] font-bold text-xl">{daysPerWeek} {t('earnings.days')}</span>
                            </div>
                            <input
                                id="days-per-week"
                                type="range"
                                min="1"
                                max="7"
                                value={daysPerWeek}
                                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F47A44]"
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-400 font-medium">
                                <span>1 {t('earnings.day')}</span>
                                <span>7 {t('earnings.days')}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <label htmlFor="meals-per-day" className="font-bold text-[#1A1A1A] text-lg">{t('earnings.mealsPerDay')}</label>
                                <span className="text-[#F47A44] font-bold text-xl">{mealsPerDay} {t('earnings.meals')}</span>
                            </div>
                            <input
                                id="meals-per-day"
                                type="range"
                                min="5"
                                max="50"
                                value={mealsPerDay}
                                onChange={(e) => setMealsPerDay(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F47A44]"
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-400 font-medium">
                                <span>5 {t('earnings.meals')}</span>
                                <span>50 {t('earnings.meals')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#F47A44] rounded-3xl p-8 text-center text-white shadow-xl mb-8">
                        <p className="text-white/90 font-medium mb-2 text-lg">{t('earnings.youCouldEarn')}</p>
                        <div className="font-serif text-7xl font-bold mb-2 tracking-tight">
                            €{earnings.monthly.toLocaleString()}
                        </div>
                        <p className="text-white/90 font-medium mb-8">{t('earnings.perMonth')}</p>

                        <div className="w-full h-px bg-white/30 mb-8" />

                        <div className="flex justify-between px-8">
                            <div className="text-center">
                                <p className="text-white/90 text-sm font-medium mb-1">{t('earnings.perWeek')}</p>
                                <p className="font-bold text-2xl">€{earnings.weekly.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-white/90 text-sm font-medium mb-1">{t('earnings.perYear')}</p>
                                <p className="font-bold text-2xl">€{earnings.yearly.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="https://signup.homemadechefs.com"
                        onClick={(e) => {
                            e.preventDefault();
                            const url = trackSignupClick('earnings-calculator');
                            window.open(url, '_blank');
                        }}
                        className="group block w-full bg-[#1A1A1A] text-white font-serif font-bold text-xl py-5 rounded-xl transition-all hover:bg-black hover:scale-[1.02] shadow-xl text-center"
                    >
                        {t('earnings.startEarningToday')}
                    </Link>

                </motion.div>

            </div>
        </section>
    );
}
