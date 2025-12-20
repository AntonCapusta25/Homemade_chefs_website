"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

const SIGNUP_URL = "https://zol4dc90rf4.typeform.com/to/vRIdX1XK";

export default function PricingPlans() {
    const { t } = useLanguage();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    const plans = [
        {
            name: t('pricing.basicPlan'),
            price: 25,
            className: "bg-transparent border-2 border-[#0F1E19]",
            textColor: "text-[#0F1E19]",
            buttonStyle: "bg-[#0F1E19] text-white hover:bg-black",
            features: {
                orderManagement: true,
                kvkSupport: true,
                branding: billingCycle === 'yearly' ? true : false,
                training: billingCycle === 'yearly' ? false : false,
                cancelAnytime: billingCycle === 'monthly' ? t('pricing.monthNotice') : true,
                platformExclusive: true
            }
        },
        {
            name: t('pricing.proPlan'),
            price: 35,
            className: "bg-[#EBE9E1] border-2 border-[#EBE9E1]",
            textColor: "text-[#0F1E19]",
            buttonStyle: "bg-[#F47A44] text-white hover:bg-[#d6602d]",
            features: {
                orderManagement: true,
                kvkSupport: true,
                branding: true,
                training: true,
                cancelAnytime: true,
                platformExclusive: true
            }
        },
        {
            name: t('pricing.advancePlan'),
            price: 45,
            className: "bg-[#0F1E19] border-2 border-[#0F1E19]",
            textColor: "text-white",
            buttonStyle: "bg-white text-[#0F1E19] hover:bg-gray-100",
            popular: true,
            features: {
                orderManagement: true,
                kvkSupport: true,
                branding: true,
                training: true,
                cancelAnytime: true,
                platformExclusive: billingCycle === 'monthly' ? false : false
            }
        }
    ];

    const featureLabels = [
        { key: 'orderManagement', label: t('pricing.orderManagement') },
        { key: 'kvkSupport', label: t('pricing.kvkSupport') },
        { key: 'branding', label: t('pricing.brandingSupport') },
        { key: 'training', label: t('pricing.training') },
        { key: 'cancelAnytime', label: t('pricing.cancelAnytime') },
        { key: 'platformExclusive', label: t('pricing.platformExclusive') },
    ];

    return (
        <section className="py-24 bg-[#F47A44] text-[#0F1E19]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl md:text-5xl font-bold"
                    >
                        {t('pricing.title')}
                    </motion.h2>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-[#0F1E19]/80 font-medium">
                        {t('pricing.subtitle')}
                    </p>

                    {/* Tab Switcher */}
                    <div className="flex justify-center mt-8">
                        <div className="bg-[#0F1E19] p-1 rounded-full flex items-center relative gap-1">
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-[#F47A44] text-[#0F1E19]' : 'text-white hover:text-white/80'}`}
                            >
                                {t('pricing.yearly')}
                            </button>
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#F47A44] text-[#0F1E19]' : 'text-white hover:text-white/80'}`}
                            >
                                {t('pricing.monthly')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${plan.className} rounded-3xl p-8 shadow-xl relative hover:scale-105 transition-transform duration-300`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFD700] text-[#0F1E19] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <div className={`${plan.textColor} mb-6`}>
                                <h3 className="font-serif text-2xl font-bold mb-2">{plan.name}</h3>
                                {billingCycle === 'monthly' ? (
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black">€{plan.price}</span>
                                        <span className="text-lg opacity-70">/month</span>
                                    </div>
                                ) : (
                                    <div className="text-2xl font-black">
                                        {index === 0 ? '10%' : index === 1 ? '12%' : '14%'}
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {featureLabels.map((feature) => {
                                    const value = plan.features[feature.key as keyof typeof plan.features];
                                    return (
                                        <li key={feature.key} className="flex items-start gap-3">
                                            {typeof value === 'boolean' ? (
                                                value ? (
                                                    <Check className={`${plan.textColor} flex-shrink-0 mt-0.5`} size={20} strokeWidth={3} />
                                                ) : (
                                                    <X className={`${plan.textColor} opacity-30 flex-shrink-0 mt-0.5`} size={20} strokeWidth={2} />
                                                )
                                            ) : (
                                                <Check className={`${plan.textColor} flex-shrink-0 mt-0.5`} size={20} strokeWidth={3} />
                                            )}
                                            <span className={`${plan.textColor} text-sm font-medium`}>
                                                {feature.label}
                                                {typeof value === 'string' && value !== 'true' && (
                                                    <span className="block text-xs opacity-70 mt-1">({value})</span>
                                                )}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>

                            <Link
                                href={SIGNUP_URL}
                                target="_blank"
                                className={`${plan.buttonStyle} w-full py-4 rounded-full font-bold text-center transition-all shadow-lg hover:shadow-xl block`}
                            >
                                {t('pricing.getStarted')}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <p className="text-[#0F1E19]/70 text-sm mb-6">
                        * All plans include a risk-free 30-day trial period. No commitment required.
                    </p>
                    <Link
                        href="/pricing"
                        className="inline-block text-[#0F1E19] font-bold hover:underline"
                    >
                        View Full Pricing Details →
                    </Link>
                </div>
            </div>
        </section>
    );
}
