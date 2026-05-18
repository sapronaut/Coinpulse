"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SearchModal from "@/components/SearchModal";

export default function ClientSearchProvider({ children }: { children: React.ReactNode }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const router = useRouter();

    const handleSelectCoin = (id: string) => {
        router.push(`/coins?id=${id}`);
    };

    return (
        <>
            {children}
            {/* Mount the modal at the root level safely on the client side */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelectCoin={handleSelectCoin}
                setIsOpenOverride={setIsSearchOpen}
            />
        </>
    );
}