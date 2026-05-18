'use client';

import { useEffect, useState, useRef } from 'react';
import { fetcher } from '@/lib/coingecko.actions';

export interface Trade {
    price: number;
    value: number;
    timestamp: number;
    type: 'buy' | 'sell';
    amount: number;
}

export type OHLCData = [number, number, number, number, number];

export interface ExtendedPriceData {
    usd: number;
    coin: string;
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
    timestamp: number;
}

interface UseCoinGeckoWebSocketProps {
    coinId: string;
    poolId?: string;
    liveInterval?: string;
}

interface UseCoinGeckoWebSocketReturn {
    price: ExtendedPriceData | null;
    trades: Trade[];
    ohlcv: OHLCData | null;
    isConnected: boolean;
}

export const useCoinGeckoWebSocket = ({
                                          coinId,
                                          liveInterval = 'hourly',
                                      }: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
    const [price, setPrice] = useState<ExtendedPriceData | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const prevPriceRef = useRef<number | null>(null);

    useEffect(() => {
        if (!coinId) return;

        setIsConnected(true);

        const fetchLatestData = async () => {
            try {
                // Pull data safely via standard HTTP parameters
                const priceRes = await fetcher<any>(`simple/price`, {
                    ids: coinId,
                    vs_currencies: 'usd',
                    include_market_cap: 'true',
                    include_24hr_vol: 'true',
                    include_24hr_change: 'true',
                    include_last_updated_at: 'true'
                });

                const coinData = priceRes?.[coinId];
                if (!coinData) return;

                const currentPrice = coinData.usd;
                const timestamp = (coinData.last_updated_at ?? Math.floor(Date.now() / 1000)) * 1000;

                setPrice({
                    usd: currentPrice,
                    coin: coinId,
                    price: currentPrice,
                    change24h: coinData.usd_24h_change ?? 0,
                    marketCap: coinData.usd_market_cap ?? 0,
                    volume24h: coinData.usd_24h_vol ?? 0,
                    timestamp: timestamp,
                });

                // Generate simulated user trading metrics for UI display movement
                if (prevPriceRef.current !== null && prevPriceRef.current !== currentPrice) {
                    const isUp = currentPrice > prevPriceRef.current;
                    const mockAmount = Math.random() * (2.0 - 0.05) + 0.05;

                    const simulatedTrade: Trade = {
                        price: currentPrice,
                        amount: Number(mockAmount.toFixed(4)),
                        value: Number((mockAmount * currentPrice).toFixed(2)),
                        timestamp: Date.now(),
                        type: isUp ? 'buy' : 'sell'
                    };

                    setTrades((prev) => [simulatedTrade, ...prev].slice(0, 7));
                }
                prevPriceRef.current = currentPrice;

                // Grab single day historical data arrays for candle overlay sync
                const ohlcRes = await fetcher<number[][]>(`coins/${coinId}/ohlc`, {
                    vs_currency: 'usd',
                    days: '1'
                });

                if (ohlcRes && ohlcRes.length > 0) {
                    const latestCandle = ohlcRes[ohlcRes.length - 1];
                    setOhlcv([
                        latestCandle[0],
                        latestCandle[1],
                        latestCandle[2],
                        latestCandle[3],
                        currentPrice,
                    ]);
                }

            } catch (error) {
                console.error("Data polling cycle execution failed:", error);
            }
        };

        fetchLatestData();

        // Execution interval set to 30 seconds to strictly protect rate limit allowances
        const pollInterval = setInterval(fetchLatestData, 30000);

        return () => {
            clearInterval(pollInterval);
            setIsConnected(false);
        };
    }, [coinId, liveInterval]);

    return {
        price,
        trades,
        ohlcv,
        isConnected,
    };
};