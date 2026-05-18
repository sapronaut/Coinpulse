"use client";

import React, { useState, useEffect } from "react";

interface ConverterProps {
    coinSymbol: string;
    currentPriceUsd: number;
    coinName: string;
}

export default function Converter({ coinSymbol, currentPriceUsd, coinName }: ConverterProps) {
    const [cryptoAmount, setCryptoAmount] = useState<string>("1");
    const [usdAmount, setUsdAmount] = useState<string>(currentPriceUsd.toFixed(2));

    // Reset fields instantly if the user switches tokens inside the main table matrix
    useEffect(() => {
        setCryptoAmount("1");
        setUsdAmount(currentPriceUsd.toFixed(2));
    }, [currentPriceUsd, coinSymbol]);

    const handleCryptoChange = (value: string) => {
        setCryptoAmount(value);
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            setUsdAmount((numericValue * currentPriceUsd).toFixed(2));
        } else {
            setUsdAmount("");
        }
    };

    const handleUsdChange = (value: string) => {
        setUsdAmount(value);
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) && currentPriceUsd > 0) {
            setCryptoAmount((numericValue / currentPriceUsd).toFixed(6));
        } else {
            setCryptoAmount("");
        }
    };

    return (
        <div className="space-y-4 bg-[#111214] p-4 rounded-2xl border border-gray-900">
            {/* Crypto Field */}
            <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount ({coinSymbol.toUpperCase()})
                </label>
                <div className="relative flex items-center">
                    <input
                        type="number"
                        className="w-full bg-[#1a1c1e] text-white border border-gray-800 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-purple-500 transition-colors"
                        value={cryptoAmount}
                        onChange={(e) => handleCryptoChange(e.target.value)}
                        placeholder="0.00"
                    />
                    <span className="absolute right-3 text-xs uppercase font-bold text-gray-500">
                        {coinSymbol}
                    </span>
                </div>
            </div>

            {/* USD Field */}
            <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Equivalent Value (USD)
                </label>
                <div className="relative flex items-center">
                    <input
                        type="number"
                        className="w-full bg-[#1a1c1e] text-white border border-gray-800 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-purple-500 transition-colors"
                        value={usdAmount}
                        onChange={(e) => handleUsdChange(e.target.value)}
                        placeholder="0.00"
                    />
                    <span className="absolute right-3 text-xs font-bold text-gray-500">
                        USD ($)
                    </span>
                </div>
            </div>

            <p className="text-[10px] text-gray-500 text-center italic pt-1">
                Base conversion: 1 {coinSymbol.toUpperCase()} = ${currentPriceUsd.toLocaleString(undefined, {minimumFractionDigits: 2})} USD
            </p>
        </div>
    );
}