"use client";

import React, { useState, useEffect } from "react";
import { fetcher } from "@/lib/coingecko.actions";
import DataTable from "@/components/DataTable";

// 1. Keep your fallback loaders completely synchronous
export function TrendingCoinsFallback() {
    return (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 border-4 border-t-purple-500 border-gray-800 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Streaming market index matrix...</p>
        </div>
    );
}

// 2. CRITICAL: TrendingCoins must NOT be an async function since it is a Client Component
export default function Page() {
    const [trendingCoins, setTrendingCoins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // 3. Move the async data fetching logic INSIDE a useEffect hook
    useEffect(() => {
        const loadTrendingAssets = async () => {
            try {
                // Fetch top trending markets or coins
                const data = await fetcher<any[]>("coins/markets", {
                    vs_currency: "usd",
                    order: "gecko_desc",
                    per_page: "10",
                    page: "1"
                });
                if (data) setTrendingCoins(data);
            } catch (err) {
                console.error("Failed to compile dashboard metrics:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadTrendingAssets();
    }, []);

    // Placeholder actions for the table interaction layers
    const handleSelectCoin = (id: string) => {
        console.log("Navigating to asset tracking profile:", id);
    };

    return (
        <main className="w-full max-w-[1600px] mx-auto p-4 md:p-6 min-h-screen text-white">
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Trending Market Matrix</h2>
                    <span className="text-xs bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/20 font-medium">
                        Live Data Feed
                    </span>
                </div>

                <div className="bg-[#1a1c1e] p-4 md:p-6 rounded-3xl border border-gray-800 shadow-xl overflow-x-auto">
                    {isLoading ? (
                        <TrendingCoinsFallback />
                    ) : (
                        /* CRITICAL: We pass string matching metrics rather than passing raw functions
                          to protect the serialization parameters across client states!
                        */
                        <DataTable
                            coins={trendingCoins}
                            onSelectCoin={handleSelectCoin}
                            selectedCoinId=""
                        />
                    )}
                </div>
            </section>
        </main>
    );
}