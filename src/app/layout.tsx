import type { Metadata } from "next";
import Script from "next/script";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google"; // Trendy fonts
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Providers from "../components/Providers";
import CookieBanner from "../components/CookieBanner";

// import ChefInvitePopup from "../components/ChefInvitePopup";
// import LimitedSpotsBanner from "../components/LimitedSpotsBanner";
import { OrganizationSchema } from "../components/StructuredData";

const serifFont = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: 'swap', // Prevent invisible text during font load
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap', // Prevent invisible text during font load
});

export const metadata: Metadata = {
  title: {
    default: 'Start Your Home Food Business in Netherlands | Homemade Chefs',
    template: '%s | Homemade Chefs',
  },
  description: 'The #1 platform to start your catering or food delivery business from home in the Netherlands. Sell homemade meals, manage orders, and grow your culinary brand with 0 startup costs.',
  keywords: ['start catering business', 'sell food from home', 'home chef netherlands', 'cooking business', 'homemade food delivery', 'culinary entrepreneur', 'hobby chef platform', 'Netherlands'],
  authors: [{ name: 'Homemade Chefs' }],
  creator: 'Homemade Chefs',
  publisher: 'Homemade Chefs',
  metadataBase: new URL('https://homemadechefs.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'nl': '/nl',
      'fr': '/fr',
    },
  },
  openGraph: {
    title: 'Start Your Home Food Business in Netherlands | Homemade Chefs',
    description: 'The #1 platform to start your catering or food delivery business from home in the Netherlands. Sell homemade meals, manage orders, and grow your culinary brand with 0 startup costs.',
    url: 'https://homemadechefs.com',
    siteName: 'Homemade Chefs',
    images: [
      {
        url: '/logo-full.png',
        width: 1200,
        height: 630,
        alt: 'Homemade Chefs Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Homemade Chefs | Turn Your Kitchen Into a Business',
    description: 'Join 50+ chefs earning from home cooking',
    images: ['/logo-full.png'],
    creator: '@Homemade___',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/icon.png?v=2', type: 'image/png', sizes: '1024x1024' },
    ],
    apple: [
      { url: '/icon.png?v=2', sizes: '1024x1024', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Preconnect to analytics domains to reduce third-party load time */}
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://analytics.tiktok.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="preconnect" href="https://scripts.clarity.ms" />
        <link rel="dns-prefetch" href="https://vfkmcamplptlkgurnnzi.supabase.co" />
      </head>
      <body className={`${serifFont.variable} ${sansFont.variable} font-sans antialiased min-h-screen flex flex-col bg-[#FDFBF7]`} suppressHydrationWarning>
        <OrganizationSchema />
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          {/* <ChefInvitePopup /> */}
          {/* <LimitedSpotsBanner /> */}
        </Providers>

        {/* Analytics scripts loaded after page interactive to improve performance */}
        <Script
          id="clarity-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "unqjzm6rq9");
            `,
          }}
        />

        <Script
          id="facebook-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s) {
                if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1146527360462374');
                fbq('track', 'PageView');
            `,
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1146527360462374&ev=PageView&noscript=1" />`,
          }}
        />

        <Script
          id="tiktok-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
                var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
                ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                ttq.load('D53F2MBC77UEGQ0DRUIG');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      </body>
    </html>
  );
}
