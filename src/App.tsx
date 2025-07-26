import React, { useEffect, useState, useRef } from "react";
import { PlayersServiceHandler } from "./services/types";
import type { KeyboardEvent } from "react";
import type { Player } from "./services/types";
import { cn, delay } from "./lib/utils";
import { useSearch } from "./hooks/useSearch";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { SearchInput } from "./components/SearchInput";
import { SearchResults } from "./components/SearchResults";

export default function App() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [search, setSearch] = useState<string | null>(null);
    const [results, setResults] = useState<Player[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const playerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const autocompleteItemsRef = useRef<HTMLDivElement>(null);
    const isSelectingRef = useRef<boolean>(false); // Track user selection and avoid mocked up delay

    // initial call to get all players
    useEffect(() => {
        (async () => {
            const playersService = new PlayersServiceHandler();
            const res = await playersService
                .getAll()
                .then((response) => {
                    setPlayers(response);
                })
                .catch((err) => console.log(err));
        })();
    }, []);

    useSearch({
        search: search as string,
        setSearch,
        players,
        setResults,
        setLoading,
        isSelectingRef,
        setSelectedIndex,
    });

    useEffect(() => {
        playerRefs.current?.[selectedIndex]?.scrollIntoView({
            block: "center",
            inline: "nearest",
        });
    }, [selectedIndex]);

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-start h-screen bg-brand-primary text-primary py-20"
            )}
        >
            <div className="autocomplete w-2/3">
                <SearchInput
                    search={search as string}
					setSearch={setSearch}
					loading={loading}
					results={results}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					setSelectedPlayer={setSelectedPlayer}
					playerRefs={playerRefs}
					isSelectingRef={isSelectingRef}
					useKeyboardNavigation={useKeyboardNavigation}
                />

                {isSelectingRef?.current ? (
                    <div className={cn("autocomplete-item", "bg-white p-2 mt-6 p-6")}>
                        {selectedPlayer?.title}
                    </div>
                ) : (
                    <div
                        className="autocomplete-items max-h-[60vh] overflow-y-auto"
                        ref={autocompleteItemsRef}
                    >
                        {!results.length && !loading && search && (
                            <div
                                className={cn(
                                    "autocomplete-item",
                                    "bg-white p-2"
                                )}
                            >
                                No results found
                            </div>
                        )}
                        <SearchResults
                            results={results}
                            playerRefs={playerRefs}
                            isSelectingRef={isSelectingRef}
                            setSearch={setSearch}
                            setSelectedPlayer={setSelectedPlayer}
                            setSelectedIndex={setSelectedIndex}
                            selectedIndex={selectedIndex}
                            search={search as string}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
