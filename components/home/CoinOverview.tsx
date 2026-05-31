import React from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { CoinOverviewFallback } from './fallback';
import CandlestickChart from '@/components/CandlestickChart';

// 1. Define explicit type interfaces to map the CoinGecko API data shapes
interface CoinDetailsData {
    name: string;
    symbol: string;
    image: {
        large: string;
    };
    market_data: {
        current_price: {
            usd: number;
        };
    };
}

// CoinGecko OHLC structure is an array of numbers: [time, open, high, low, close]
type OHLCData = [number, number, number, number, number];

const CoinOverview = async () => {
    try {
        // FIXED SYNTAX: Removed leading slashes from endpoints to prevent double slashes (//) in the final requested URL layout.
        const [coin, coinOHLCData] = await Promise.all([
            fetcher<CoinDetailsData>('coins/bitcoin', {
                localization: 'false',
                tickers: 'false',
                market_data: 'true',
                community_data: 'false',
                developer_data: 'false',
                sparkline: 'false',
            }),
            fetcher<OHLCData[]>('coins/bitcoin/ohlc', {
                vs_currency: 'usd',
                days: '1',
            }),
        ]);

        return (
            <div id="coin-overview" className="bg-[#1a1c1e] p-6 rounded-3xl border border-gray-800 shadow-xl">
                {/* Passing down the data to your lightweight-charts client wrapper */}
                <CandlestickChart data={coinOHLCData} coinId="bitcoin">
                    <div className="header flex items-center gap-4 pt-2 text-left mb-6">
                        <Image
                            src={coin.image.large}
                            alt={coin.name}
                            width={56}
                            height={56}
                            className="rounded-full"
                        />
                        <div className="info text-left">
                            <p className="text-gray-400 text-sm font-medium">
                                {coin.name} / {coin.symbol.toUpperCase()}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-0.5">
                                {formatCurrency(coin.market_data.current_price.usd)}
                            </h1>
                        </div>
                    </div>
                </CandlestickChart>
            </div>
        );
    } catch (error) {
        console.error('Error fetching coin overview:', error);
        return <CoinOverviewFallback />;
    }
};

export default CoinOverview;