import React, { Suspense } from 'react';
import CoinOverview from '@/components/home/CoinOverview';
import TrendingCoins from '@/components/home/TrendingCoins';
import {
    CategoriesFallback,
    CoinOverviewFallback,
    TrendingCoinsFallback,
} from '@/components/home/fallback';
import Categories from '@/components/home/Categories';

const Page = async () => {
    return (
        <main className="main-container mx-auto p-4 md:p-6 space-y-6">

            {/* FIX: Bypassing the old home-grid styles using a clear side-by-side flex layout.
              This guarantees the Overview (Chart) takes up 70% and Trending takes up 30% width space.
            */}
            <div style={{ display: 'flex', gap: '24px', width: '100%', alignItems: 'stretch', flexWrap: 'wrap' }}>

                {/* LEFT COLUMN: Chart/Overview section (70% space) */}
                <div style={{ flex: '2 1 600px', minWidth: '320px' }}>
                    <Suspense fallback={<CoinOverviewFallback />}>
                        <CoinOverview />
                    </Suspense>
                </div>

                {/* RIGHT COLUMN: Trending Coins list container section (30% space) */}
                <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <Suspense fallback={<TrendingCoinsFallback />}>
                        <TrendingCoins />
                    </Suspense>
                </div>

            </div>

            {/* BOTTOM FULL WIDTH SECTION: Categories */}
            <section className="w-full mt-7 space-y-4">
                <Suspense fallback={<CategoriesFallback />}>
                    <Categories />
                </Suspense>
            </section>
        </main>
    );
};

export default Page;