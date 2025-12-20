"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "What is Homemade?",
        answer: "Homemade is a innovative food delivery platform that transforms home kitchens into personal restaurants. We empower passionate home chefs to create and sell delicious, fresh meals directly to hungry customers in their local area. Think of it as turning your cooking passion into a flexible, rewarding business opportunity."
    },
    {
        question: "Do I need professional cooking credentials?",
        answer: "Not at all! You don't need to be a professionally trained chef. However, you do need to meet a few important requirements: Register with the KVK (Dutch Chamber of Commerce), follow food safety standards, and comply with NVWA regulations. What matters most is your cooking skill, passion, and ability to create delicious meals that people will love."
    },
    {
        question: "How do I get paid for my meals?",
        answer: "Getting paid is super simple: Fill out your payment details on the Homemade platform, set your meal prices, request payments whenever you want, and receive your funds within 2-4 business days. You have complete control over your earnings and can withdraw money as soon as you start selling meals."
    },
    {
        question: "How does packaging work requirements?",
        answer: "You're responsible for packaging your meals. We encourage: Eco-friendly packaging materials, professional and attractive presentation, and packaging that keeps food fresh and appetizing. Don't worry - we provide tips and guidance to help you choose the right packaging that will make your meals look as good as they taste."
    },
    {
        question: "How does delivery work?",
        answer: "You have can deliver meals yourself. Our platform lets you: Set your own delivery radius, choose your availability, communicate easily with customers, and manage delivery logistics smoothly."
    },
    {
        question: "How much can I earn per week/month?",
        answer: "Earnings vary, but many chefs on Homemade earn between €200 and €2,000+ per month. Your income depends on: Number of orders you fulfill, your meal pricing, how often you cook, your menu's popularity, and your local customer base."
    },
    {
        question: "How will customers find my meals?",
        answer: "We market your chef profile through: Our mobile app, social media campaigns, email marketing, and your Storefront on Homemademeals Food Delivery platform."
    },
    {
        question: "Can I choose my cooking schedule?",
        answer: "Absolutely! Homemade offers total flexibility: Cook as many or as few days as you want, set your own hours, take breaks whenever needed, and simply update your availability on the platform."
    },
    {
        question: "Is Homemade available everywhere?",
        answer: "Currently, we're active in the Netherlands, with thriving communities in: Amsterdam, Rotterdam, Enschede. And we're constantly expanding to new cities and regions."
    },
    {
        question: "What's the real experience of cooking on Homemade like?",
        answer: "It's more than just earning money - it's about: Working on your own terms, sharing meals you're passionate about, connecting with your local community, and turning your cooking love into a flexible income stream."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-[#EBE9E1]">
            <div className="max-w-4xl mx-auto px-6">

                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl md:text-5xl font-bold text-[#0F1E19]"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <p className="text-[#0F1E19]/70 text-lg">
                        Everything you need to know about becoming a Homemade chef.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                            >
                                <span className={`text-xl font-bold transition-colors ${openIndex === index ? 'text-[#F47A44]' : 'text-[#0F1E19]'}`}>
                                    {faq.question}
                                </span>
                                <span className={`flex-shrink-0 ml-4 p-2 rounded-full transition-colors ${openIndex === index ? 'bg-[#F47A44] text-white' : 'bg-[#EBE9E1] text-[#0F1E19]'}`}>
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 md:px-8 pb-8 pt-0 text-gray-600 leading-relaxed text-lg">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
