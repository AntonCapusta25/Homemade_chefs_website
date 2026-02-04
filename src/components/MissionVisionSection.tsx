"use client";

import { motion } from "framer-motion";
import { Target, Globe, Gem } from "lucide-react";

export default function MissionVisionSection() {
    return (
        <section id="about-content" className="py-24 md:py-32 bg-[#FDFBF7]">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#0F1E19] rounded-[2.5rem] overflow-hidden relative p-8 md:p-10 flex flex-col justify-start text-left group hover:-translate-y-2 transition-transform duration-500 shadow-2xl"
                    >
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900 via-transparent to-transparent"></div>
                            <div className="absolute w-full h-full bg-[radial-gradient(#1f3d33_2px,transparent_2px)] bg-[size:30px_30px]"></div>
                        </div>
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#F47A44] rounded-full blur-[80px] opacity-20 mix-blend-screen pointer-events-none"></div>
                        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-teal-600 rounded-full blur-[80px] opacity-20 mix-blend-screen pointer-events-none"></div>

                        <div className="relative z-10 w-full">
                            <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-serif mb-6 text-white">Our Mission</h2>
                            <p className="text-lg text-white/80 leading-relaxed font-light">
                                To revolutionize food delivery by connecting passionate home chefs with their neighbors, creating a sustainable ecosystem that celebrates authentic homemade cuisine while strengthening community bonds and supporting local entrepreneurship.
                            </p>
                        </div>
                    </motion.div>

                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-[#0F1E19] rounded-[2.5rem] overflow-hidden relative p-8 md:p-10 flex flex-col justify-start text-left group hover:-translate-y-2 transition-transform duration-500 shadow-2xl"
                    >
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900 via-transparent to-transparent"></div>
                            <div className="absolute w-full h-full bg-[radial-gradient(#1f3d33_2px,transparent_2px)] bg-[size:30px_30px]"></div>
                        </div>
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#F47A44] rounded-full blur-[80px] opacity-20 mix-blend-screen pointer-events-none"></div>
                        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-teal-600 rounded-full blur-[80px] opacity-20 mix-blend-screen pointer-events-none"></div>

                        <div className="relative z-10 w-full">
                            <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-serif mb-6 text-white">Our Vision</h2>
                            <p className="text-lg text-white/80 leading-relaxed font-light">
                                A world where every neighborhood thrives through the power of shared meals, where home chefs are celebrated as culinary entrepreneurs, and where sustainable, community-driven food delivery is the norm rather than the exception.
                            </p>
                        </div>
                    </motion.div>

                    {/* Values Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="bg-[#0F1E19] rounded-[2.5rem] overflow-hidden relative p-8 md:p-10 flex flex-col justify-start text-left group hover:-translate-y-2 transition-transform duration-500 shadow-2xl"
                    >
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900 via-transparent to-transparent"></div>
                            <div className="absolute w-full h-full bg-[radial-gradient(#1f3d33_2px,transparent_2px)] bg-[size:30px_30px]"></div>
                        </div>
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#F47A44] rounded-full blur-[80px] opacity-20 mix-blend-screen pointer-events-none"></div>
                        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-teal-600 rounded-full blur-[80px] opacity-20 mix-blend-screen pointer-events-none"></div>

                        <div className="relative z-10 w-full">
                            <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                                <Gem className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-serif mb-6 text-white">Our Values</h2>
                            <p className="text-lg text-white/80 leading-relaxed font-light">
                                Community first, sustainability always, quality never compromised. We believe in authentic flavors, fair compensation for chefs, environmental responsibility, and the power of food to bring people together.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
