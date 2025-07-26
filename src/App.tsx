import React, { useEffect, useState, useRef } from "react";
import { PlayersServiceHandler } from "./services/types";
import type { KeyboardEvent } from "react";
import type { Player } from "./services/types";
import { cn, delay } from "./lib/utils";
import { useSearch } from "./hooks/useSearch";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

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
                <div className="relative">
                    <div className={cn("loading w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2", search && loading && "animate-spin")}>
                        {loading ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide stroke-brand-primary-900 lucide-loader-circle-icon lucide-loader-circle"
                            >
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide stroke-brand-primary-900 lucide-search-icon lucide-search"
                            >
                                <path d="m21 21-4.34-4.34" />
                                <circle cx="11" cy="11" r="8" />
                            </svg>
                        )}
                    </div>
                    <input
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            useKeyboardNavigation({
                                event: e as KeyboardEvent<Element>,
                                results,
                                selectedIndex,
                                setSelectedIndex,
                                setSearch,
                                setSelectedPlayer,
                                playerRefs,
                                isSelectingRef,
                            });
                        }}
                        value={search || ""}
                        type="text"
                        placeholder="Search"
                        className="bg-brand-primary-100 p-6 w-full indent-10
						"
                    />
                </div>

                {isSelectingRef?.current ? (
                    selectedPlayer?.title
                ) : (
                    <div
                        className="autocomplete-items max-h-[60vh] overflow-y-auto"
                        ref={autocompleteItemsRef}
                    >
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
