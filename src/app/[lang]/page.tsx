import { getContentStatic } from '@/actions/cms';
import dynamic from 'next/dynamic';
import GrandHero from '@/components/GrandHero';
import Partners from '@/components/Partners';
import FeaturesHorizontalScroll from '@/components/FeaturesHorizontalScroll';

// Lazy load below-the-fold components to improve initial load time
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), {
  loading: () => <div className="min-h-screen" />
});
const EarningsCalculator = dynamic(() => import('@/components/EarningsCalculator'), {
  loading: () => <div className="min-h-screen" />
});
const FoodSafety = dynamic(() => import('@/components/FoodSafety'), {
  loading: () => <div className="min-h-screen" />
});
const GrowBusiness = dynamic(() => import('@/components/GrowBusiness'), {
  loading: () => <div className="min-h-screen" />
});
const PricingPlans = dynamic(() => import('@/components/PricingPlans'), {
  loading: () => <div className="min-h-screen" />
});
const FAQCreative = dynamic(() => import('@/components/FAQCreative'), {
  loading: () => <div className="min-h-screen" />
});
const CallToAction = dynamic(() => import('@/components/CallToAction'), {
  loading: () => <div className="min-h-[200px]" />
});

export default async function Home() {
  const content = await getContentStatic();
  const heroData = content.home?.hero;
  const ctaData = content.home?.cta;

  return (
    <div className="bg-[#FDFBF7] min-h-screen">

      {/* --- HERO SECTION: GRAND CINEMATIC --- */}
      {/* Now using translation keys instead of content.json */}
      <GrandHero />

      {/* --- FEATURE CARDS (HORIZONTAL SCROLL) --- */}
      <FeaturesHorizontalScroll />

      {/* --- EARNINGS CALCULATOR --- */}
      <div id="earnings">
        <EarningsCalculator />
      </div>

      {/* --- HOW IT WORKS --- */}
      <HowItWorks />

      {/* --- GROW YOUR BUSINESS --- */}
      <GrowBusiness />

      {/* --- FOOD SAFETY --- */}
      <FoodSafety />

      {/* --- PRICING PLANS --- */}
      <PricingPlans />

      {/* --- PARTNERS SECTION --- */}
      <Partners />


      {/* --- FAQ --- */}
      <FAQCreative />

      {/* --- CTA --- */}
      <CallToAction
        title={ctaData?.title}
        subtitle={ctaData?.subtitle}
        buttonText={ctaData?.buttonText}
      />

      {/* --- LIVE SUPPORT WIDGET --- */}
      {/* <LiveSupport /> */}

    </div>
  );
}
