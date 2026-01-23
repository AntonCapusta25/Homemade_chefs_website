import AboutPage from '../[lang]/about/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - Mission & Team | Homemade Chefs',
    description: 'Meet the team empowering culinary entrepreneurs. Our mission is to provide every talented home cook with the tools and platform to turn their passion into a thriving business.',
    openGraph: {
        title: 'About Us - Mission & Team | Homemade Chefs',
        description: 'Meet the team empowering culinary entrepreneurs. Turning home cooking into a thriving business.',
    }
};

export default function Page() {
    return <AboutPage />;
}
