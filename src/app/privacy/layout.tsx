import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Homemade Chefs Privacy Policy - GDPR compliant. Learn how we collect, use, and protect your personal data.',
    robots: {
        index: true,
        follow: true,
    },
};

export { default } from './page';
