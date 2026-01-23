"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const frontierMembers = [
    { name: "Khaylan Lalla", role: "Sales Team" },
    { name: "Walid Sabihi", role: "Sales Team" },
    { name: "Audrey Mballa", role: "Marketing Team" },
    { name: "Nouran", role: "Video Editor" },
    { name: "Rajayogi Nandina", role: "UI/UX Designer" },
];

const teamMembers = [
    {
        name: "Mahmoud el Wakil",
        role: "CEO",
        bio: "Leading Homemade Chefs with a vision to empower home cooks globally. Mahmoud brings strategic leadership and a passion for culinary innovation to every aspect of the platform.",
        image: "/about/mahmoud-el-wakil.jpg",
    },
    {
        name: "Aisha Abdelwahab",
        role: "Marketing Manager",
        bio: "Driving the brand's growth and connecting with our community. Aisha leads our marketing strategies to share the Homemade Chefs story with the world.",
        image: "/about/aisha-abdelwahab.jpg",
    },
    {
        name: "Oleksandr Filippov",
        role: "Manager of Operations",
        bio: "Ensuring smooth day-to-day operations and chef success. Oleksandr coordinates the logistics and support systems that keep Homemade Chefs running efficiently.",
        image: "/about/oleksandr-filippov.jpg",
    },
    {
        name: "Mennatallah Yahia",
        role: "Marketing Specialist",
        bio: "Expert in digital campaigns and content creation. Mennatallah helps bring our chefs' stories to life through engaging social media strategies.",
        image: "/about/mennatallah-yahia.jpg",
    },
    {
        name: "Tia Yahya",
        role: "Chefs Onboarding Specialist",
        bio: "Guiding new chefs through their journey. Tia ensures a smooth onboarding experience, helping talented cooks turn their passion into a thriving business.",
        image: "/about/tia-yahya.jpg",
    },
    {
        name: "Nijs van der Laan",
        role: "Head Developer",
        bio: "Architecting the digital foundation of Homemade Chefs. Nijs leads the development team, ensuring our platform is robust, scalable, and always ready to serve our growing community.",
        image: "/about/nijs-van-der-laan.jpg",
    },
];

export default function TeamSection() {
    return (
        <section className="py-20 md:py-32 bg-[#F9F9F9]">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif text-[#0F1E19] mb-6">Meet Our Team</h2>
                        <div className="h-1.5 w-24 bg-[#E86825] mx-auto rounded-full mb-8" />
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                            The passionate individuals working behind the scenes to revolutionize the way we eat, cook, and connect.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
                        >
                            {/* Image Container with Flair */}
                            <div className="relative mb-8 mx-auto w-full max-w-[260px] aspect-[4/5]">
                                <div className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-white shadow-md">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="text-center">
                                <h3 className="text-2xl font-serif text-[#0F1E19] mb-2 group-hover:text-[#E86825] transition-colors">{member.name}</h3>
                                <p className="text-[#E86825] font-bold tracking-wider uppercase text-xs mb-4">{member.role}</p>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base opacity-90">
                                    {member.bio}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* On the Frontier Section */}
                <div className="mt-20 md:mt-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <h3 className="text-3xl md:text-3xl font-serif text-[#0F1E19] mb-4">On the Frontier</h3>
                        <div className="h-1 w-16 bg-[#E86825]/60 mx-auto rounded-full" />
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
                        {frontierMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                                className="bg-white px-8 py-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-w-[240px] flex flex-col items-center justify-center group"
                            >
                                <h4 className="font-serif text-lg text-[#0F1E19] group-hover:text-[#E86825] transition-colors mb-1">{member.name}</h4>
                                <p className="text-[#E86825] text-xs font-bold uppercase tracking-widest opacity-80">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
