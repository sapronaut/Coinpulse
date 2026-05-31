import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ClientSearchProvider from "@/components/ClientSearchProvider"; // Import our new client bridge

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CoinPulse",
    description: "Crypto Screener App with a built-in High-Frequency Terminal & Dashboard",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap both Header and children so the event works seamlessly everywhere */}
        <ClientSearchProvider>
            <Header />
            {children}
        </ClientSearchProvider>
        </body>
        </html>
    );
}