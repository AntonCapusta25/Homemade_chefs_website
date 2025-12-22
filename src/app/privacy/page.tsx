import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#FDFBF7]">
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
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        GDPR Compliant
                    </p>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Introduction
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Welcome to Homemade Chefs! Your privacy and the protection of your personal data are paramount
                            to us. This Privacy Policy informs you about how we collect, use, protect, and share your
                            personal data when you use our platform, homemadechefs.com, and is designed to meet our
                            obligations under the General Data Protection Regulation (GDPR).
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Controller
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Homemade Chefs B.V. ("Homemade Chefs", "we", "us", or "our") is the controller responsible for your
                            personal data.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Contact Details
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-2">Our full details are:</p>
                        <ul className="list-none space-y-2 text-gray-700 ml-4">
                            <li><strong>Full name of legal entity:</strong> Homemade Chefs B.V.</li>
                            <li><strong>Email address:</strong> <a href="mailto:info@homemadechefs.com" className="text-[#F47A44] hover:underline">info@homemadechefs.com</a></li>
                            <li><strong>Postal address:</strong> Witbreuksweg 383, Enschede, The Netherlands</li>
                            <li><strong>Telephone number:</strong> +31 (0)6 40090902</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            If you have any questions about this Privacy Policy or our privacy practices, please contact us
                            using the details provided.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            The Data We Collect About You
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may collect, use, store, and transfer various kinds of personal data about you which we
                            have grouped together as follows:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li><strong>Identity Data:</strong> includes first name, last name, username, or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address, and telephone numbers.</li>
                            <li><strong>Financial Data:</strong> includes bank account and payment card details.</li>
                            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                            <li><strong>Profile Data:</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback, and survey responses.</li>
                            <li><strong>Usage Data:</strong> includes information about how you use our website, products, and services.</li>
                            <li><strong>Marketing and Communications Data:</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            How We Use Your Personal Data
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li>To register you as a new chef or customer</li>
                            <li>To process and deliver your orders</li>
                            <li>To manage payments, fees, and charges</li>
                            <li>To provide customer support and respond to your inquiries</li>
                            <li>To improve our website, products, and services</li>
                            <li>To send you marketing communications (with your consent)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Lawful Basis for Processing
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We process your personal data on the following bases:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for a specific purpose.</li>
                            <li><strong>Contract:</strong> Processing is necessary for the performance of a contract with you or to take steps at your request before entering into such a contract.</li>
                            <li><strong>Legal Obligation:</strong> Processing is necessary for compliance with a legal obligation to which we are subject.</li>
                            <li><strong>Legitimate Interests:</strong> Processing is necessary for the purposes of the legitimate interests pursued by us or a third party, except where such interests are overridden by your interests or fundamental rights and freedoms.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Your Rights Under GDPR
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You have rights under data protection laws in relation to your personal data, including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li><strong>Right to Access:</strong> Request access to your personal data</li>
                            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
                            <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                            <li><strong>Right to Restrict Processing:</strong> Request restriction of processing your personal data</li>
                            <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                            <li><strong>Right to Data Portability:</strong> Request transfer of your data to another organization</li>
                            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where we rely on consent</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            If you wish to exercise any of these rights, please contact us using the details provided above.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Data Security
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We have implemented appropriate security measures designed to secure your personal data from accidental loss
                            and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers behind firewalls.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Data Retention
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We will retain your personal data only for as long as necessary to fulfill the purposes we
                            collected it for, including for the purposes of satisfying any legal, accounting, or reporting
                            requirements. To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure, and applicable legal requirements.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Cookies
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Our website uses cookies to distinguish you from other users and to provide you with a good experience. By continuing to browse the site, you are agreeing to our use of cookies. You can manage your cookie preferences through our cookie banner or your browser settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Third-Party Links
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Changes to the Policy
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may update this policy from time to time and will notify you of any changes by posting the
                            new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our website, prior to the change becoming effective.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0F1E19] mb-4">
                            Governing Law and Jurisdiction
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            This Privacy Policy is governed by and construed in accordance with the laws of The
                            Netherlands. Any disputes relating to this privacy policy shall be subject to the exclusive jurisdiction of the courts of The Netherlands.
                        </p>
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
