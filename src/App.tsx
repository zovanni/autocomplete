import { useEffect, useState, useRef } from "react";
import { PlayersService } from "./services/factory";
import type { Player } from "./services/types";
import { cn, delay } from "./lib/utils";
import { useSearch } from "./hooks/useSearch";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { SearchInput } from "./components/searchInput";
import { SearchResults } from "./components/searchResults";

export default function App() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [search, setSearch] = useState<string>("");
    const [results, setResults] = useState<Player[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [firstLoading, setFirstLoading] = useState<boolean>(false); // for players from remote API
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const playerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const autocompleteItemsRef = useRef<HTMLDivElement>(null);
    const isSelectingRef = useRef<boolean>(false); // Track user selection and avoid mocked up delay

    // initial call to get all players
    useEffect(() => {
        (async () => {
            try {
                setFirstLoading(true);
                setLoading(true);
                setError(null);
                await delay(1000);
                const playersService = new PlayersService();
                const response = await playersService.getAll();
                setPlayers(response);
                setFirstLoading(false);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load players:", err);
                setError(
                    "Failed to load tennis players. Please try again later."
                );
                setFirstLoading(false);
                setLoading(false);
            }
        })();
    }, []);

    useSearch({
        search,
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

    const handleSearchChange = (newSearch: string | null) => {
        setSearch(newSearch || "");
        if (!newSearch) {
            setSelectedPlayer(null);
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-brand-primary text-primary">
                <div className="text-center p-8 bg-white shadow-lg max-w-md min-w-90">
                    <div className="text-red-600 text-lg font-semibold mb-4">
                        Error
                    </div>
                    <div className="text-gray-700 mb-4">
                        {error || "Error loaging players"}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-brand-primary-500 text-white px-4 py-2 hover:bg-brand-primary-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-start h-screen bg-brand-primary text-primary py-20"
            )}
        >
            {firstLoading ? (
                <div className="flex flex-col items-center justify-center h-screen bg-brand-primary text-primary">
                    <div
                        className={cn(
                            "loading animate-spin flex items-center justify-center"
                        )}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="90"
                            height="90"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide stroke-white lucide-loader-circle-icon lucide-loader-circle"
                            aria-hidden="true"
                        >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    </div>
                </div>
            ) : (
                <div className="autocomplete w-2/3">
                    <SearchInput
                        search={search}
                        setSearch={handleSearchChange}
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
                        <div
                            className={cn(
                                "autocomplete-item",
                                "bg-white mt-6 p-6"
                            )}
                        >
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
                                        "bg-white p-2 text-gray-500 text-center"
                                    )}
                                >
                                    {(() => {
                                        if (search.length > 1) {
                                            return `No players found for "${search}"`;
                                        } else {
                                            return `Type at least 2 characters to search for a player`;
                                        }
                                    })()}
                                </div>
                            )}
                            {results.length > 0 && (
                                <SearchResults
                                    results={results}
                                    playerRefs={playerRefs}
                                    isSelectingRef={isSelectingRef}
                                    setSearch={handleSearchChange}
                                    setSelectedPlayer={setSelectedPlayer}
                                    setSelectedIndex={setSelectedIndex}
                                    selectedIndex={selectedIndex}
                                    search={search}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
