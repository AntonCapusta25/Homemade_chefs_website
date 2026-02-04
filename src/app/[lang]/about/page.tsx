import { getContentStatic } from '@/actions/cms';
import AboutHero from '@/components/AboutHero';
import MissionVisionSection from '@/components/MissionVisionSection';
import TeamSection from '@/components/TeamSection';
import CallToAction from '@/components/CallToAction';
import FAQCreative from '@/components/FAQCreative';
import Partners from '@/components/Partners';
import { Metadata } from 'next';

type Props = {
    params: { lang: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;

    // SEO for Netherlands B2B market
    if (lang === 'nl') {
        return {
            title: 'Over Ons - Missie & Team | Homemade Chefs',
            description: 'Leer het team kennen achter Homemade Chefs. Onze missie is om elke getalenteerde thuiskok in Nederland de tools en het platform te geven om een succesvol cateringbedrijf te starten.',
            openGraph: {
                title: 'Over Ons - Missie & Team | Homemade Chefs',
                description: 'Leer het team kennen achter Homemade Chefs. Wij helpen thuiskoks hun passie om te zetten in een bedrijf.',
            }
        }
    }

    return {
        title: 'About Us - Mission & Team | Homemade Chefs',
        description: 'Meet the team empowering culinary entrepreneurs. Our mission is to provide every talented home cook with the tools and platform to turn their passion into a thriving business.',
        openGraph: {
            title: 'About Us - Mission & Team | Homemade Chefs',
            description: 'Meet the team empowering culinary entrepreneurs. Turning home cooking into a thriving business.',
        }
    }
}

export default async function AboutPage() {
    const content = await getContentStatic();
    const ctaData = content.home?.cta;

    return (
        <div className="bg-[#FDFBF7] min-h-screen">
            {/* --- HERO SECTION --- */}
            <AboutHero />

            {/* --- MISSION & VISION --- */}
            <MissionVisionSection />

            {/* --- TEAM SECTION --- */}
            <TeamSection />

            {/* --- PARTNERS SECTION --- */}
            <Partners hideButton={true} />

            {/* --- FAQ SECTION --- */}
            <FAQCreative />

            {/* --- CTA SECTION --- */}
            <CallToAction
                title={ctaData?.title}
                subtitle={ctaData?.subtitle}
                buttonText={ctaData?.buttonText}
            />
        </div>
    );
}
