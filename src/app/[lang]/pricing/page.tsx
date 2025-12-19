"use client";

import PricingHero from '@/components/pricing/PricingHero';
import PricingDetailedComparison from '@/components/pricing/PricingDetailedComparison';
import FAQCreative from '@/components/FAQCreative';
import CallToAction from '@/components/CallToAction';
// import LiveSupport from '@/components/LiveSupport';

export default function PricingPage() {
    return (
        <main className="flex flex-col min-h-screen bg-[#FDFBF7]">
            <PricingHero />
            <PricingDetailedComparison />
            <FAQCreative />
            <CallToAction />
            {/* <LiveSupport /> */}
        </main>
    );
}
