'use client';

import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface MarketsTableProps {
    coins: any[];
    onSelectCoin: (id: string) => void;
    selectedCoinId: string;
}

export default function MarketsTable({ coins, onSelectCoin, selectedCoinId }: MarketsTableProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">24h Change</TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {coins?.map((coin) => {
                    const isSelected = selectedCoinId === coin.id;

                    const currentPrice = coin.current_price ?? 0;
                    const marketCap = coin.market_cap ?? 0;
                    const priceChange = coin.price_change_percentage_24h ?? 0;

                    return (
                        <TableRow
                            key={coin.id}
                            onClick={() => onSelectCoin?.(coin.id)}
                            className={`cursor-pointer transition-colors duration-150 ${
                                isSelected
                                    ? "bg-purple-500/10 hover:bg-purple-500/15 font-semibold text-purple-400"
                                    : "hover:bg-muted/50"
                            }`}
                        >
                            <TableCell className="font-mono">#{coin.market_cap_rank || coin.rank}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {coin.image && (
                                        <img src={coin.image} alt={coin.name} className="w-5 h-5 object-contain" />
                                    )}
                                    <span className="font-medium text-white">{coin.name}</span>
                                    <span className="text-xs text-gray-500 uppercase">{coin.symbol}</span>
                                </div>
                            </TableCell>

                            {/* Added suppressHydrationWarning as a final double-layered defense */}
                            <TableCell className="text-right font-mono text-white" suppressHydrationWarning>
                                $ {isMounted
                                ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : currentPrice.toFixed(2)
                            }
                            </TableCell>

                            <TableCell className={`text-right font-mono ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                                {priceChange >= 0 ? "+" : ""}
                                {priceChange.toFixed(2)}%
                            </TableCell>

                            {/* Added suppressHydrationWarning here as well */}
                            <TableCell className="text-right font-mono text-gray-300" suppressHydrationWarning>
                                $ {isMounted
                                ? marketCap.toLocaleString()
                                : marketCap.toFixed(0)
                            }
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
