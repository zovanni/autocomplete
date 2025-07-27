import React, { useEffect, useMemo } from "react";
import type { Player } from "../services/types";
import { delay } from "../lib/utils";

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
    setSearch: React.Dispatch<React.SetStateAction<string>>
    players: Player[];
    setResults: (results: Player[]) => void;
    setLoading: (loading: boolean) => void;
    isSelectingRef: React.MutableRefObject<boolean>;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    // Memoize filtered results to prevent unnecessary re-computations
    const filteredPlayers = useMemo(() => {
        if (!search || search.trim().length < 2) return [];

        const searchTerm = search.toLowerCase().trim();
        return players.filter((player) =>
            player.title.toLowerCase().includes(searchTerm)
        );
    }, [search, players]);

    // Debounced search effect
    useEffect(() => {
        if (!search || search.trim().length < 2) {
            setResults([]);
            setLoading(false);
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
            try {
                await delay(500); // Simulate API delay
                setSelectedIndex(0);
                setResults(filteredPlayers);
                setLoading(false);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
                setLoading(false);
            }
        }, 300); // Debounce delay

        // Cleanup function to cancel the timeout if search changes
        return () => clearTimeout(timeoutId);
    }, [search, filteredPlayers, setResults, setLoading, setSelectedIndex, isSelectingRef]);
}

export { useSearch };