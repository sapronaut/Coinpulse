"use client";

import React, { useState, useEffect } from "react";
import { fetcher } from "@/lib/coingecko.actions";

interface TrendingSidebarProps {
    onSelectCoin: (id: string) => void;
}

export default function TrendingSidebar({ onSelectCoin }: TrendingSidebarProps) {
    const [trending, setTrending] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Using CoinGecko's explicit trending search endpoint
                const data = await fetcher<any>("search/trending");
                // Extracting the item structures out of the trending coin wrapper object array
                const coinsList = data?.coins?.slice(0, 5).map((c: any) => c.item) || [];
                setTrending(coinsList);
            } catch (err) {
                console.error("Failed to load trending context metrics:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-[#1a1c1e] p-5 rounded-3xl border border-gray-800/80 shadow-xl space-y-4">
                <div className="w-24 h-4 bg-gray-800 rounded animate-pulse" />
                <div className="space-y-2">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="w-full h-16 bg-[#111214] border border-gray-900 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1c1e] p-5 rounded-3xl border border-gray-800/80 shadow-xl space-y-4">
            <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                Trending Coins
            </h3>

            <div className="space-y-2">
                {trending.map((coin) => (
                    <button
                        key={coin.id}
                        onClick={() => onSelectCoin(coin.id)}
                        className="w-full flex items-center justify-between p-3.5 bg-[#111214] hover:bg-gray-800/40 border border-gray-900 rounded-xl text-left transition-all group cursor-pointer"
                    >
                        <div className="flex items-center space-x-3">
                            <img
                                src={coin.small}
                                alt={coin.name}
                                className="w-7 h-7 object-contain rounded-full bg-neutral-900 border border-gray-800/60"
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-100 group-hover:text-purple-400 transition-colors">
                                    {coin.name}
                                </p>
                                <p className="text-[10px] text-gray-500 uppercase font-mono font-medium tracking-wide">
                                    {coin.symbol}
                                </p>
                            </div>
                        </div>

                        {/* Market Rank Tag Index */}
                        <span className="text-xs font-mono text-gray-400 font-medium">
                            #{coin.market_cap_rank || "—"}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}