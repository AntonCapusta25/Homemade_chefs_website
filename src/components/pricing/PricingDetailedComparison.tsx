"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const SIGNUP_URL = "https://signup.homemadechefs.com/";

export default function PricingDetailedComparison() {
    const { t } = useLanguage();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [activeTab, setActiveTab] = useState<'basic' | 'pro' | 'advance'>('pro');

    // Monthly pricing data
    const monthlyFeatures = [
        { name: t('pricing.orderManagement'), basic: true, pro: true, advance: true },
        { name: t('pricing.kvkSupport'), basic: true, pro: true, advance: true },
        { name: t('pricing.brandingSupport'), basic: false, pro: true, advance: true },
        { name: t('pricing.training'), basic: false, pro: true, advance: true },
        { name: t('pricing.cancelAnytime'), basic: t('pricing.monthNotice'), pro: true, advance: true },
        { name: t('pricing.platformExclusive'), basic: true, pro: true, advance: false },
    ];

    // Yearly pricing data
    const yearlyFeatures = [
        { name: t('pricing.orderManagement'), basic: true, pro: true, advance: true },
        { name: t('pricing.kvkSupport'), basic: true, pro: true, advance: true },
        { name: t('pricing.brandingSupport'), basic: true, pro: true, advance: true },
        { name: "B2B Catering", basic: false, pro: false, advance: true },
        { name: "Ad Creatives Per Month", basic: false, pro: "2 Posts", advance: "3+ Videos" },
        { name: "Homemade Feature Per Month", basic: false, pro: "Once", advance: "3 Times" },
    ];

    const features = billingCycle === 'monthly' ? monthlyFeatures : yearlyFeatures;

    const renderFeatureValue = (value: boolean | string | undefined) => {
        if (typeof value === 'boolean') {
            return value ? <Check className="text-green-600" strokeWidth={3} size={24} /> : <X className="text-gray-300" strokeWidth={2} size={24} />;
        }
        return <span className="font-bold text-[#0F1E19] text-sm">{value}</span>;
    };

    return (
        <section className="py-20 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16 px-4">
                    <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#0F1E19] mb-4 leading-tight">
                        {t('pricing.title')}
                    </h2>
                    <p className="text-[#0F1E19]/70 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                        {t('pricing.subtitle')}
                    </p>

                    {/* Billing Switcher */}
                    <div className="inline-flex items-center bg-white p-1.5 rounded-full border-2 border-gray-200 shadow-sm relative">
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-[#F47A44] to-[#E86825] rounded-full transition-all duration-300 shadow-md ${billingCycle === 'yearly' ? 'left-1.5' : 'left-[50%] translate-x-0'
                                }`}
                        />
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`relative z-10 w-32 py-3 rounded-full font-bold text-sm transition-colors duration-300 ${billingCycle === 'yearly' ? 'text-white' : 'text-[#0F1E19]/60 hover:text-[#F47A44]'
                                }`}
                        >
                            {t('pricing.yearly')}
                        </button>
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`relative z-10 w-32 py-3 rounded-full font-bold text-sm transition-colors duration-300 ${billingCycle === 'monthly' ? 'text-white' : 'text-[#0F1E19]/60 hover:text-[#F47A44]'
                                }`}
                        >
                            {t('pricing.monthly')}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE TABBED VIEW (< md) --- */}
                <div className="md:hidden">
                    {/* Tabs */}
                    <div className="flex bg-white rounded-xl p-1 mb-6 border border-gray-100 shadow-sm">
                        {(['basic', 'pro', 'advance'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === tab
                                    ? 'bg-[#0F1E19] text-white shadow-md'
                                    : 'text-gray-500 hover:text-[#0F1E19]'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Selected Plan Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                        <div className={`p-6 text-center ${activeTab === 'pro' ? 'bg-[#F47A44]/10' : 'bg-gray-50'}`}>
                            <h3 className="font-serif text-2xl font-bold text-[#0F1E19] mb-1">
                                {activeTab === 'basic' && t('pricing.basicPlan')}
                                {activeTab === 'pro' && t('pricing.proPlan')}
                                {activeTab === 'advance' && t('pricing.advancePlan')}
                            </h3>
                            {billingCycle === 'monthly' && (
                                <div className="text-3xl font-black text-[#F47A44] mb-2">
                                    {activeTab === 'basic' && '€25'}
                                    {activeTab === 'pro' && '€35'}
                                    {activeTab === 'advance' && '€45'}
                                    <span className="text-sm font-medium text-gray-500 ml-1">/mo</span>
                                </div>
                            )}
                        </div>

                        <div className="p-6 space-y-4">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                    <span className="text-sm font-medium text-gray-600 max-w-[60%]">{feature.name}</span>
                                    <div>
                                        {renderFeatureValue(feature[activeTab])}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>


                {/* --- DESKTOP TABLE VIEW (>= md) --- */}
                <div className="hidden md:block">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={billingCycle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100"
                        >
                            <div className="overflow-x-auto">
                                <div className="min-w-[800px] w-full overflow-x-auto">
                                    {/* Header Row */}
                                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 p-6 bg-gradient-to-r from-[#F47A44] to-[#E86825]">
                                        <div className="flex items-end pb-2">
                                            <h3 className="font-serif text-3xl font-bold text-white">{t('pricing.feature')}</h3>
                                        </div>

                                        {/* Plan Headers */}
                                        <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                            <div className="font-serif text-xl font-bold text-white mb-1">{t('pricing.basicPlan')}</div>
                                            {billingCycle === 'monthly' ? (
                                                <>
                                                    <div className="text-3xl font-black text-white">€25</div>
                                                    <div className="text-xs text-white/80">per month</div>
                                                </>
                                            ) : (
                                                <div className="text-3xl font-black text-white">10%</div>
                                            )}
                                        </div>

                                        <div className="text-center bg-white rounded-xl p-4 shadow-xl relative">
                                            <div className="font-serif text-xl font-bold text-[#F47A44] mb-1">{t('pricing.proPlan')}</div>
                                            {billingCycle === 'monthly' ? (
                                                <>
                                                    <div className="text-3xl font-black text-[#F47A44]">€35</div>
                                                    <div className="text-xs text-gray-600">per month</div>
                                                </>
                                            ) : (
                                                <div className="text-3xl font-black text-[#F47A44]">12%</div>
                                            )}
                                        </div>

                                        <div className="text-center bg-[#0F1E19] rounded-xl p-4 border border-white/20 relative">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFD700] text-[#0F1E19] text-xs font-black px-3 py-1 rounded-full">
                                                POPULAR
                                            </div>
                                            <div className="font-serif text-xl font-bold text-white mb-1">{t('pricing.advancePlan')}</div>
                                            {billingCycle === 'monthly' ? (
                                                <>
                                                    <div className="text-3xl font-black text-white">€45</div>
                                                    <div className="text-xs text-white/80">per month</div>
                                                </>
                                            ) : (
                                                <div className="text-3xl font-black text-white">14%</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <div className="p-6 space-y-3">
                                        {features.map((feature, i) => (
                                            <div
                                                key={i}
                                                className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 items-center bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="font-bold text-[#0F1E19] text-sm">
                                                    {feature.name}
                                                </div>

                                                {/* Basic */}
                                                <div className="flex justify-center items-center">
                                                    {renderFeatureValue(feature.basic)}
                                                </div>

                                                {/* Pro */}
                                                <div className="flex justify-center items-center bg-orange-50 -my-4 py-4 rounded-lg">
                                                    {renderFeatureValue(feature.pro)}
                                                </div>

                                                {/* Advance */}
                                                <div className="flex justify-center items-center">
                                                    {renderFeatureValue(feature.advance)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <Link
                        href={SIGNUP_URL}
                        target="_blank"
                        className="inline-block bg-gradient-to-r from-[#F47A44] to-[#E86825] text-white px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-[#F47A44]/40 transition-all duration-300 hover:scale-105"
                    >
                        {t('pricing.getStarted')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
