"use client";

import React, { useState, useEffect } from "react";
import { fetcher } from "@/lib/coingecko.actions";

export default function TrendingCoins() {
    const [trending, setTrending] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadTrending = async () => {
            try {
                // Safely fetch on the client side after mount
                const data = await fetcher<any>("search/trending");
                setTrending(data?.coins || []);
            } catch (err) {
                console.error("Failed to fetch trending coins:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadTrending();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full bg-[#1a1c1e] p-6 rounded-3xl border border-gray-800 animate-pulse space-y-4">
                <div className="h-5 w-32 bg-gray-700 rounded" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-800 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#1a1c1e] p-6 rounded-3xl border border-gray-800 shadow-xl">
            <h3 className="text-md font-bold text-gray-400 uppercase tracking-wider mb-4">Trending Coins</h3>
            <div className="space-y-3">
                {trending.slice(0, 5).map((item: any) => {
                    const coin = item.item;
                    return (
                        <div key={coin.id} className="flex items-center justify-between p-3 bg-[#111214] rounded-2xl border border-gray-800/50">
                            <div className="flex items-center space-x-3">
                                <img src={coin.small} alt={coin.name} className="w-6 h-6 rounded-full" />
                                <div>
                                    <p className="text-sm font-semibold text-white">{coin.name}</p>
                                    <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-mono text-white">#{coin.market_cap_rank || "N/A"}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}