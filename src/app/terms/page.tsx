import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-24">
            <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center text-[#F47A44] hover:text-[#E86825] transition-colors mb-8 font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>

                {/* Content */}
                <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F1E19] mb-8">
                        Terms of Service
                    </h1>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            By accessing and using Homemade Chefs ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            These Terms of Service ("Terms") govern your use of our website located at homemadechefs.com and any related services provided by Homemade Chefs B.V.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            2. Use License
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Permission is granted to temporarily download one copy of the materials on Homemade Chefs for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or for any public display</li>
                            <li>Attempt to reverse engineer any software contained on the website</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            This license shall automatically terminate if you violate any of these restrictions and may be terminated by Homemade Chefs at any time.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            3. User Responsibilities
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            As a chef using our platform, you agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Provide accurate and complete information about your culinary business</li>
                            <li>Comply with all applicable food safety regulations and standards in The Netherlands</li>
                            <li>Maintain proper hygiene and safety standards in your kitchen</li>
                            <li>Respect customer privacy and data protection requirements (GDPR)</li>
                            <li>Use the platform in accordance with local laws and regulations</li>
                            <li>Maintain valid food handling certifications and licenses as required</li>
                            <li>Accurately represent your menu items, ingredients, and allergen information</li>
                            <li>Fulfill orders in a timely and professional manner</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            4. Food Safety and Compliance
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You acknowledge that you are solely responsible for ensuring compliance with all applicable food safety regulations, including but not limited to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>HACCP (Hazard Analysis and Critical Control Points) principles</li>
                            <li>Local health department requirements and inspections</li>
                            <li>Food allergen labeling and disclosure requirements</li>
                            <li>Proper food storage, handling, and preparation standards</li>
                            <li>Temperature control and food safety protocols</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Homemade Chefs provides tools and resources but does not guarantee compliance. You are solely responsible for maintaining all necessary permits, licenses, and certifications.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            5. Account Registration
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            6. Payments and Fees
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            By using our platform, you agree to pay all applicable fees as described in our pricing plans. Fees are subject to change with 30 days' notice. You are responsible for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Providing valid payment information</li>
                            <li>Paying all subscription fees on time</li>
                            <li>Any applicable taxes or transaction fees</li>
                            <li>Maintaining accurate billing information</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            7. Privacy Policy
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Your privacy is important to us. Please review our <Link href="/privacy" className="text-[#F47A44] hover:underline">Privacy Policy</Link>, which also governs your use of the Service, to understand our practices. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            8. Prohibited Uses
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You may not use our Service:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                            <li>To submit false or misleading information</li>
                            <li>To upload or transmit viruses or any other type of malicious code</li>
                            <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                            <li>To interfere with or circumvent the security features of the Service</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            9. Intellectual Property
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            The Service and its original content, features, and functionality are and will remain the exclusive property of Homemade Chefs B.V. and its licensors. The Service is protected by copyright, trademark, and other laws of both The Netherlands and foreign countries.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            10. Service Availability
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We reserve the right to withdraw or amend our Service, and any service or material we provide via the Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Service is unavailable at any time or for any period. From time to time, we may restrict access to some parts of the Service, or the entire Service, to users, including registered users.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            11. Limitation of Liability
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            In no event shall Homemade Chefs B.V., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>Your use or inability to use the Service</li>
                            <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                            <li>Any interruption or cessation of transmission to or from the Service</li>
                            <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our Service by any third party</li>
                            <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the Service</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            12. Indemnification
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You agree to defend, indemnify, and hold harmless Homemade Chefs B.V. and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses arising from your use of and access to the Service, or your violation of these Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            13. Termination
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            14. Changes to Terms
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            15. Governing Law
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            These Terms shall be governed and construed in accordance with the laws of The Netherlands, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            16. Contact Information
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <ul className="list-none space-y-2 text-gray-700 ml-4">
                            <li><strong>Email:</strong> <a href="mailto:legal@homemadechefs.com" className="text-[#F47A44] hover:underline">legal@homemadechefs.com</a></li>
                            <li><strong>Address:</strong> Homemade Chefs B.V., Witbreuksweg 383, Enschede, The Netherlands</li>
                            <li><strong>Phone:</strong> +31 (0)6 40090902</li>
                        </ul>
                    </section>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500 text-center">
                            Last updated: December 22, 2025
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
