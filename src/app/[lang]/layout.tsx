import { ReactNode } from 'react';
import { notFound } from 'next/navigation';

const locales = ['en', 'nl', 'fr'];

export async function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    // Validate that the incoming `lang` parameter is valid
    if (!locales.includes(lang)) {
        notFound();
    }

    return <>{children}</>;
}
