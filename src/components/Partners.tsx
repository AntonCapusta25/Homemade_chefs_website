import Image from "next/image";

// ... imports
interface PartnersProps {
    hideButton?: boolean;
}

export default function Partners({ hideButton = false }: PartnersProps) {
    // ... existing code ...
    const partners = [
        { name: "El Nino", logo: "/images/partners/el-nino.png", width: 160 },
        { name: "Upfront", logo: "/images/partners/upfront.png", width: 300 },
        { name: "Sure Mobility", logo: "/images/partners/sure-mobility.png", width: 400 },
        { name: "UTwente", logo: "/images/partners/utwente.png", width: 128 },
        { name: "Novel-T", logo: "/images/partners/novel-t.png", width: 160 },
        { name: "Create Tomorrow", logo: "/images/partners/create-tomorrow.png", width: 160 },
    ];

    const isLargeLogo = (name: string) => ["Sure Mobility", "Upfront"].includes(name);
    const isSmallLogo = (name: string) => ["UTwente", "Novel-T"].includes(name);

    const getLogoClasses = (name: string) => {
        if (isLargeLogo(name)) return "h-32 md:h-48";
        if (isSmallLogo(name)) return "h-10 md:h-16";
        return "h-16 md:h-24";
    };

    const getLogoHeight = (name: string) => {
        if (isLargeLogo(name)) return 192;
        if (isSmallLogo(name)) return 64;
        return 96;
    };

    return (
        <section className="py-24 bg-white overflow-hidden border-y border-gray-100">
            <div className="container mx-auto px-4 mb-20 text-center">
                <h3 className="font-serif text-3xl md:text-5xl text-[#0F1E19] relative inline-block">
                    Proudly Partnering With
                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#E86825]/20 rounded-full"></span>
                </h3>
            </div>

            <div className="relative flex overflow-hidden group">
                {/* Gradient overlays for smooth fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                {/* Marquee Container */}
                <div className="flex shrink-0 animate-marquee items-center gap-24 pr-24">
                    {/* First set of logos */}
                    {partners.map((partner, index) => (
                        <div
                            key={`partner-1-${index}`}
                            className="flex items-center justify-center shrink-0 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
                        >
                            <Image
                                src={partner.logo}
                                alt={`${partner.name} logo`}
                                width={partner.width}
                                height={getLogoHeight(partner.name)}
                                className={`${getLogoClasses(partner.name)} w-auto object-contain max-w-none`}
                            />
                        </div>
                    ))}

                    {/* Duplicate set for seamless loop */}
                    {partners.map((partner, index) => (
                        <div
                            key={`partner-2-${index}`}
                            className="flex items-center justify-center shrink-0 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
                        >
                            <Image
                                src={partner.logo}
                                alt={`${partner.name} logo`}
                                width={partner.width}
                                height={getLogoHeight(partner.name)}
                                className={`${getLogoClasses(partner.name)} w-auto object-contain max-w-none`}
                            />
                        </div>
                    ))}

                    {/* Third set to ensure no gaps on wide screens */}
                    {partners.map((partner, index) => (
                        <div
                            key={`partner-3-${index}`}
                            className="flex items-center justify-center shrink-0 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
                        >
                            <Image
                                src={partner.logo}
                                alt={`${partner.name} logo`}
                                width={partner.width}
                                height={getLogoHeight(partner.name)}
                                className={`${getLogoClasses(partner.name)} w-auto object-contain max-w-none`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {!hideButton && (
                <div className="flex justify-center mt-16">
                    <a
                        href="/about"
                        className="group px-8 py-3 bg-[#0F1E19] text-white font-bold rounded-full hover:bg-[#F47A44] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        More about us
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="group-hover:translate-x-1 transition-transform"
                        >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </a>
                </div>
            )}
        </section>
    );
}
