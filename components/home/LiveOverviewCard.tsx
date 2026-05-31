'use client';

import React from 'react';
import { useCoinGeckoWebSocket } from '@/hooks/useCoinGeckoWebSocket';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import CandlestickChart from '@/components/CandlestickChart';

interface LiveOverviewCardProps {
    coinId: string;
    initialData?: number[][];
}

export default function LiveOverviewCard({ coinId, initialData = [] }: LiveOverviewCardProps) {
    // 1. Establish the free-tier 30s short polling fallback stream
    const { price, ohlcv, isConnected } = useCoinGeckoWebSocket({ coinId });

    if (!price) {
        return <p className="text-gray-500 text-sm animate-pulse text-left">Synchronizing real-time dashboard data...</p>;
    }

    const isUp = price.change24h >= 0;

    return (
        <div className="bg-[#1a1c1e] p-6 rounded-3xl border border-gray-800 shadow-xl space-y-6">
            <div className="space-y-4 text-left">
                {/* Asset Headline Row */}
                <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                        Live Metric Ticker
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isConnected ? 'POLLING ACTIVE' : 'OFFLINE'}
                    </span>
                </div>

                {/* Price Presentation & Interactive Percentage Badge */}
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                        {formatCurrency(price.usd)}
                    </span>
                    <span className={`flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-md font-bold ${isUp ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {formatPercentage(price.change24h)}
                    </span>
                </div>

                {/* Bottom Supplementary Metadata Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800/60">
                    <div>
                        <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Today</p>
                        <p className={`text-sm font-bold mt-0.5 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                            {formatPercentage(price.change24h)}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Market Cap</p>
                        <p className="text-sm font-bold text-white mt-0.5">
                            {price.marketCap > 1_000_000_000
                                ? `${(price.marketCap / 1_000_000_000).toFixed(2)}B`
                                : formatCurrency(price.marketCap)}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">24h Volume</p>
                        <p className="text-sm font-bold text-white mt-0.5">
                            {price.volume24h > 1_000_000_000
                                ? `${(price.volume24h / 1_000_000_000).toFixed(2)}B`
                                : formatCurrency(price.volume24h)}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Render the trading canvas and bind the matching historical/live props */}
            <div className="w-full pt-4 border-t border-gray-800/60">
                <CandlestickChart data={initialData as any} liveOhlcv={ohlcv} coinId={coinId} />
            </div>
        </div>
    );
}