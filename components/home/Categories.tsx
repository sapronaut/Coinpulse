'use client';

import React, { useState, useEffect } from 'react';
import { fetcher } from '@/lib/coingecko.actions';

export default function Categories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadCategoriesData = async () => {
            try {
                // Safeguard the async fetch inside the side-effect hook execution cycle
                const data = await fetcher<any[]>('coins/categories');
                setCategories(data ?? []);
            } catch (err) {
                console.error("Failed to gather asset categories:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategoriesData();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full bg-[#1a1c1e] p-6 rounded-3xl border border-gray-800 shadow-xl animate-pulse">
                <div className="h-6 w-48 bg-gray-700 rounded mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-800 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#1a1c1e] p-6 rounded-3xl border border-gray-800 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Trending Crypto Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {categories?.slice(0, 4).map((category) => (
                    <div
                        key={category.id}
                        className="p-4 bg-[#111214] border border-gray-800 rounded-2xl flex flex-col justify-between hover:border-purple-500/50 transition-all cursor-pointer"
                    >
                        <div>
                            <p className="text-sm font-semibold text-white truncate">{category.name}</p>
                            <p className="text-xs text-gray-500 mt-1">Market Cap Change</p>
                        </div>
                        <span className={`text-sm font-mono mt-2 block ${(category.market_cap_change_24h ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(category.market_cap_change_24h ?? 0) >= 0 ? '+' : ''}
                            {category.market_cap_change_24h?.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}