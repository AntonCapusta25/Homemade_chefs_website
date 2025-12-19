import { getContentStatic } from '@/actions/cms';
import GrandHero from '@/components/GrandHero';
import HowItWorks from '@/components/HowItWorks';
import CallToAction from '@/components/CallToAction';
import FeaturesHorizontalScroll from '@/components/FeaturesHorizontalScroll';
import EarningsCalculator from '@/components/EarningsCalculator';
import FoodSafety from '@/components/FoodSafety';
import GrowBusiness from '@/components/GrowBusiness';
// import LiveSupport from '@/components/LiveSupport';
import PricingPlans from '@/components/PricingPlans';
import FAQCreative from '@/components/FAQCreative';

export default async function Home() {
  const content = await getContentStatic();
  const heroData = content.home?.hero;
  const ctaData = content.home?.cta;

  return (
    <div className="bg-[#FDFBF7] min-h-screen">

      {/* --- HERO SECTION: GRAND CINEMATIC --- */}
      {/* Passing simplified props just for demo, ideally we update component to accept full object */}
      <GrandHero
        title={heroData?.title}
        subtitle={heroData?.subtitle}
        primaryCta={heroData?.ctaPrimary}
        secondaryCta={heroData?.ctaSecondary}
      />

      {/* --- FEATURE CARDS (HORIZONTAL SCROLL) --- */}
      <FeaturesHorizontalScroll />

      {/* --- HOW IT WORKS --- */}
      <HowItWorks />

      {/* --- EARNINGS CALCULATOR --- */}
      <div id="earnings">
        <EarningsCalculator />
      </div>

      {/* --- FOOD SAFETY --- */}
      <FoodSafety />

      {/* --- GROW YOUR BUSINESS --- */}
      <GrowBusiness />

      {/* --- PRICING PLANS --- */}
      <PricingPlans />


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
