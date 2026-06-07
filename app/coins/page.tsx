"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetcher } from "@/lib/coingecko.actions";
import DataTable from "@/components/DataTable";
import CandlestickChart from "@/components/CandlestickChart";
import Converter from "@/components/Converter";
import TrendingSidebar from "@/components/TrendingSidebar";

function CoinsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedCoinId = searchParams.get("id") || "bitcoin";

    const [coins, setCoins] = useState<any[]>([]);
    const [chartData, setChartData] = useState<number[][]>([]);
    const [isLoadingCoins, setIsLoadingCoins] = useState<boolean>(true);
    const [isLoadingChart, setIsLoadingChart] = useState<boolean>(false);

    const selectedCoinData = coins.find((c) => c.id === selectedCoinId);

    useEffect(() => {
        const loadCoins = async () => {
            try {
                const data = await fetcher<any[]>("coins/markets", {
                    vs_currency: "usd",
                    order: "market_cap_desc",
                    per_page: "20",
                    page: "1"
                });
                if (data) setCoins(data);
            } catch (err) {
                console.error("Failed to load market listings:", err);
            } finally {
                setIsLoadingCoins(false);
            }
        };
        loadCoins();
    }, []);

    useEffect(() => {
        if (!selectedCoinId) return;
        const loadChartCoordinates = async () => {
            setIsLoadingChart(true);
            try {
                const data = await fetcher<any>(`coins/${selectedCoinId}/ohlc`, {
                    vs_currency: "usd",
                    days: "7"
                });
                setChartData(data || []);
            } catch (err) {
                console.error(`Failed to fetch chart records for ${selectedCoinId}:`, err);
                setChartData([]);
            } finally {
                setIsLoadingChart(false);
            }
        };
        loadChartCoordinates();
    }, [selectedCoinId]);

    const handleSelectCoin = (id: string) => {
        router.push(`/coins?id=${id}`);
    };

    return (
        <main className="w-full max-w-[1600px] mx-auto p-4 md:p-6 min-h-screen text-white space-y-6">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Digital Asset Trading Desk</h1>
                <p className="text-sm text-gray-400 mt-1">Select an asset to view advanced telemetry and execution matrices.</p>
            </header>

            <div style={{ display: 'flex', gap: '24px', width: '100%', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                <div
                    className="bg-[#1a1c1e] p-5 rounded-3xl border border-gray-800 shadow-xl space-y-4"
                    style={{ flex: '2 1 600px', minWidth: '320px' }}
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-md font-semibold text-gray-300 capitalize tracking-wide">
                            {selectedCoinId} Market Value (7D)
                        </h3>
                        {isLoadingChart && (
                            <div className="w-4 h-4 border-2 border-t-purple-400 border-gray-700 rounded-full animate-spin" />
                        )}
                    </div>
                    <div className="min-h-[350px] flex items-center justify-center bg-[#111214] rounded-2xl border border-gray-900 overflow-hidden">
                        {chartData.length > 0 ? (
                            <CandlestickChart data={chartData} height={350} />
                        ) : (
                            <p className="text-xs text-gray-500">
                                {isLoadingChart ? "Re-aligning canvas arrays..." : "No coordinates found."}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-6" style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <div className="bg-[#1a1c1e] p-5 rounded-3xl border border-gray-800 shadow-xl">
                        <h3 className="text-md font-semibold text-gray-300 tracking-wide mb-4">Currency Converter Matrix</h3>
                        {selectedCoinData ? (
                            <Converter coinSymbol={selectedCoinData.symbol} currentPriceUsd={selectedCoinData.current_price} coinName={selectedCoinData.name} />
                        ) : (
                            <div className="py-2 text-center">
                                <Converter coinSymbol={selectedCoinId.substring(0, 4).toUpperCase()} currentPriceUsd={chartData[chartData.length - 1]?.[4] ?? 0} coinName={selectedCoinId} />
                            </div>
                        )}
                    </div>

                    <TrendingSidebar onSelectCoin={handleSelectCoin} />
                </div>

            </div>

            <div className="bg-[#1a1c1e] p-4 md:p-6 rounded-3xl border border-gray-800 shadow-xl overflow-x-auto">
                <h3 className="text-lg font-bold tracking-tight mb-4 px-2">Cryptocurrency Markets</h3>
                {isLoadingCoins ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-3">
                        <div className="w-8 h-8 border-4 border-t-purple-500 border-gray-800 rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">Assembling core asset structures...</p>
                    </div>
                ) : (
                    <DataTable
                        coins={coins}
                        onSelectCoin={handleSelectCoin}
                        selectedCoinId={selectedCoinId}
                    />
                )}
            </div>
        </main>
    );
}

export default function CoinsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-t-purple-500 border-gray-800 rounded-full animate-spin" />
            </div>
        }>
            <CoinsContent />
        </Suspense>
    );
}