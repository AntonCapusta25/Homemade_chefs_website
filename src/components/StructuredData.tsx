'use client';

export function OrganizationSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Homemade Chefs',
        url: 'https://homemadechefs.com',
        logo: 'https://homemadechefs.com/logo-full.png',
        description: 'Platform for home chefs to sell meals and grow their culinary business',
        sameAs: [
            'https://www.facebook.com/homemademeals.net',
            'https://www.instagram.com/homemade.bv/',
            'https://x.com/Homemade___',
            'https://www.tiktok.com/@homemademealsnl',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            email: 'Chefs@homemademeals.net',
            contactType: 'Customer Service',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface BlogPostSchemaProps {
    title: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified: string;
    slug: string;
    language: string;
}

export function BlogPostSchema({ title, description, image, datePublished, dateModified, slug, language }: BlogPostSchemaProps) {
    const baseUrl = 'https://homemadechefs.com';
    const url = language === 'en' ? `${baseUrl}/blog/${slug}` : `${baseUrl}/${language}/blog/${slug}`;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: description,
        image: image,
        datePublished: datePublished,
        dateModified: dateModified,
        url: url,
        author: {
            '@type': 'Organization',
            name: 'Homemade Chefs',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Homemade Chefs',
            logo: {
                '@type': 'ImageObject',
                url: 'https://homemadechefs.com/logo-full.png',
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

interface BreadcrumbItem {
    name: string;
    url?: string;
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            ...(item.url && { item: item.url }),
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
