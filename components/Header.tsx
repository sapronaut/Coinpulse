'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from 'react';

const Header = () => {
    const pathname = usePathname();

    // Broadcast a custom event across the window stream when clicked
    const handleOpenSearch = (e: React.MouseEvent) => {
        e.preventDefault();
        window.dispatchEvent(new Event("toggle-crypto-search"));
    };

    return (
        <header>
            <div className="main-container inner">
                <Link href='/'>
                    <Image src="/logo.svg" alt="CoinPulse logo" width={132} height={40} />
                </Link>
                <nav className="flex items-center gap-4">
                    <Link href='/' className={cn('nav-link', {
                        'is-active': pathname === '/',
                        'is-home' : true
                    })}>Home</Link>

                    {/* FIXED: Changed <p> to a fully functional button */}
                    <button
                        onClick={handleOpenSearch}
                        className={cn('nav-link cursor-pointer bg-transparent border-none outline-none p-0 text-left font-medium')}
                    >
                        Search Modal
                    </button>

                    <Link href="/coins" className={cn('nav-link', {
                        'is-active': pathname === '/coins',
                    })}>All Coins</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;