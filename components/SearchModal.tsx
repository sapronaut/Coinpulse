"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetcher } from "@/lib/coingecko.actions";

interface SearchModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSelectCoin?: (id: string) => void;
}

export default function SearchModal({ isOpen = false, onClose, onSelectCoin }: SearchModalProps) {
    // Manage visibility internally so it responds instantly to both clicks and hotkeys
    const [isVisible, setIsVisible] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // 1. Listen for clicks from the Header and keyboard shortcuts
    useEffect(() => {
        const openModal = () => {
            setIsVisible(true);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsVisible((prev) => !prev);
            }
            if (e.key === "Escape") {
                setIsVisible(false);
            }
        };

        window.addEventListener("toggle-crypto-search", openModal);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("toggle-crypto-search", openModal);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Sync with an external isOpen prop just in case it's passed down
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    // Handle scroll locking and auto-focusing the search input
    useEffect(() => {
        if (isVisible) {
            setTimeout(() => inputRef.current?.focus(), 50);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            setQuery("");
            setResults([]);
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isVisible]);

    // 2. Handle API searching with a built-in debounce timer
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await fetcher<any>(`search`, { query: query });
                setResults(data?.coins?.slice(0, 6) || []);
            } catch (err) {
                console.error("Failed to fetch autocomplete records:", err);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleCloseModal = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    return (
        // z-[9999] guarantees it cuts through the navbar, background layout, and tables
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] px-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={handleCloseModal}
        >
            {/* Search Overlay Window Panel */}
            <div
                className="w-full max-w-lg bg-[#18191b] border border-gray-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()} // Stops overlay from snapping shut when clicking inside the box
            >
                {/* Search Bar Input Row */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-800/50 bg-[#141517]">
                    <div className="flex items-center flex-1">
                        <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full bg-transparent text-gray-200 text-sm outline-none placeholder-gray-500 font-normal"
                            placeholder="Search for a token by name or symbol..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-3 ml-2">
                        {isLoading && (
                            <div className="w-3.5 h-3.5 border-2 border-t-purple-400 border-gray-700 rounded-full animate-spin" />
                        )}
                        <button
                            onClick={handleCloseModal}
                            className="text-gray-500 hover:text-gray-300 transition-colors p-1 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Auto-Complete Results Drawer Layout */}
                <div className="p-2 max-h-[380px] overflow-y-auto space-y-0.5 bg-[#18191b]">
                    {query.trim() === "" ? (
                        <div className="py-12 text-center text-xs text-gray-500 font-medium tracking-wide">
                            Type a token name to search...
                        </div>
                    ) : results.length === 0 && !isLoading ? (
                        <div className="py-12 text-center text-xs text-gray-400 font-medium">
                            No matching crypto assets discovered.
                        </div>
                    ) : (
                        results.map((coin) => (
                            <button
                                key={coin.id}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/40 text-left transition-all duration-150 group cursor-pointer"
                                onClick={() => {
                                    if (onSelectCoin) {
                                        onSelectCoin(coin.id);
                                    } else {
                                        // Fallback redirect if used on static routes out-of-box
                                        window.location.href = `/coins?id=${coin.id}`;
                                    }
                                    handleCloseModal();
                                }}
                            >
                                <div className="flex items-center space-x-3.5">
                                    <img
                                        src={coin.thumb}
                                        alt={coin.name}
                                        className="w-7 h-7 object-contain rounded-full bg-neutral-900 border border-gray-800/50"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-100 group-hover:text-purple-400 transition-colors">
                                            {coin.name}
                                        </p>
                                        <p className="text-xs text-gray-500 uppercase font-mono tracking-wider font-medium">
                                            {coin.symbol}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-xs font-mono text-gray-400 bg-[#202225] px-2 py-1 rounded-md border border-gray-800/60">
                                        #{coin.market_cap_rank || "—"}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}