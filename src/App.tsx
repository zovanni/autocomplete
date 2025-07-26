import React, { useEffect, useState, useRef } from "react";
import { PlayersServiceHandler } from "./services/types";
import type { KeyboardEvent } from "react";
import type { Player } from "./services/types";
import { cn, delay } from "./lib/utils";
import { useSearch } from "./hooks/useSearch";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { SearchInput } from "./components/searchInput";

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

    console.log(loading);

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
                        {results.map((result, index) => (
                            <div
                                ref={(el) => (playerRefs.current[index] = el)}
                                onClick={() => {
                                    isSelectingRef.current = true; // Set flag before programmatic setSearch
                                    setSearch(result.title);
                                    setSelectedPlayer(result);
                                    setSelectedIndex(index);
                                }}
                                className={cn(
                                    "autocomplete-item",
                                    "bg-white p-2",
                                    "cursor-pointer",
                                    selectedIndex === index &&
                                        "bg-brand-primary-200"
                                )}
                            >
                                {(() => {
                                    const splitKeepSeparator = (
                                        str: string,
                                        separator: string
                                    ) => {
                                        const escaped = separator.replace(
                                            /[.*+?^${}()|[\]\\]/g,
                                            "\\$&"
                                        ); // escape regex chars
                                        const regex = new RegExp(
                                            `(${escaped})`,
                                            "gi"
                                        );
                                        return str.split(regex);
                                    };

                                    const input = result.title;
                                    let res = splitKeepSeparator(
                                        input,
                                        search as string
                                    );

                                    if (res.length > 1) {
                                        res = res.filter((element, index) => {
                                            // Remove the first element if it's an empty string
                                            return !(
                                                element === "" && index === 0
                                            );
                                        });
                                    }

                                    return res.map((element, index) => {
                                        return (
                                            <span
                                                className={cn(
                                                    "highlight",
                                                    element.toLowerCase() ===
                                                        (
                                                            search as string
                                                        ).toLowerCase() &&
                                                        "bg-brand-primary-500"
                                                )}
                                            >
                                                {element}
                                            </span>
                                        );
                                    });
                                })()}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
