import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import { LottieBackground } from "@/components/LottieBackground";
import { FireflyCursor } from "@/components/FireflyCursor";
import SmoothScroll from "@/components/SmoothScroll";

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-playfair",
    display: "swap",
});

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400"],
    variable: "--font-montserrat",
    display: "swap",
});

export const metadata: Metadata = {
    title: "ARD Biotech | Transforming Environmental Challenges into Agricultural Wealth",
    description:
        "Protect your crops from wildlife with Farm Fort—the 100% organic repellent that works where chemicals fail. Patented biotechnology converting waste into agricultural wealth.",
    keywords: [
        "Solution for wildlife crop destruction",
        "organic crop protection",
        "Farm Fort repellent",
        "wild pig prevention",
        "organic fertilizer Tamil Nadu",
        "ARD Biotech",
        "keratin fertilizer",
    ],
    authors: [{ name: "ARD Biotech LLP" }],
    openGraph: {
        title: "ARD Biotech | Transforming Environmental Challenges into Agricultural Wealth",
        description:
            "100% organic wildlife repellent and fertilizers for Tamil Nadu farmers.",
        type: "website",
        locale: "en_IN",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${playfair.variable} ${montserrat.variable} font-body antialiased bg-[#050505] text-white min-h-screen`}
            >
                <SmoothScroll>
                    {/* Lottie Paddy Animation Background */}
                    <LottieBackground />

                    {/* Firefly Cursor Effect */}
                    <FireflyCursor />

                    {/* Main Content */}
                    <main className="relative z-10 w-full overflow-x-hidden">
                        {children}
                    </main>
                </SmoothScroll>
            </body>
        </html>
    );
}
