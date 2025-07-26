import React, { useEffect, useState, useRef, useMemo } from "react";
import { PlayersServiceHandler } from "../services/types";
import type { KeyboardEvent } from "react";
import type { Player } from "../services/types";
import { cn, delay } from "../lib/utils";

const useSearch = ({
    search,
    setSearch,
    players,
    setResults,
    setLoading,
    isSelectingRef,
    setSelectedIndex,
}: {
    search: string;
    setSearch: (search: string) => void;
    players: Player[];
    setResults: (results: Player[]) => void;
    setLoading: (loading: boolean) => void;
    isSelectingRef: React.MutableRefObject<boolean>;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    useEffect(() => {
        if (!search) {
            setResults([]);
            return;
        }

        // Skip delay if we're programmatically selecting a result
        if (isSelectingRef.current) {
            isSelectingRef.current = false;
            return;
        }

        // Use a timeout to debounce the search and simulate delay
        setLoading(true);
        const timeoutId = setTimeout(async () => {
            await delay(500); // Simulate API delay
            const filteredPlayers = players.filter((player) =>
                player.title.toLowerCase().includes(search.toLowerCase())
            );
            setSelectedIndex(0);
            setResults(filteredPlayers);
            setLoading(false);
        }, 300); // Debounce delay

        // Cleanup function to cancel the timeout if search changes
        return () => clearTimeout(timeoutId);
    }, [search, players]);


}

export { useSearch };