import React, { useEffect, useState, useRef } from "react";
import { PlayersService, PlayersServiceHandler } from "./services/types";
import type { KeyboardEvent } from "react";
import type { Player } from "./services/types";
import { cn } from "./lib/utils";

const useSearch = (
    players: Player[],
    search: string | null,
    results: Player[],
    setResults: (results: Player[]) => void,
    selectedIndex: number,
    setSelectedIndex: (index: number) => void
) => {
    useEffect(() => {
        if (!search) {
            setResults([]);
        }
        if (search) {
            const filteredPlayers = players.filter((player) =>
                player.title.toLowerCase().includes(search.toLowerCase())
            );
            setSelectedIndex(0);
            setResults(filteredPlayers);
        }
    }, [search]);
};

const useKeyboardNavigation = (
    event: KeyboardEvent<Element>,
    results: Player[],
    selectedIndex: number,
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,
    setResults: React.Dispatch<React.SetStateAction<Player[]>>,
    setSearch: React.Dispatch<React.SetStateAction<string | null>>,
    setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>,
    playerRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>
) => {
    event = event || window.event;
    switch (event.key) {
        case "Enter":
            event.preventDefault();
            if (results[selectedIndex]) {
                setSearch(results[selectedIndex].title);
                setSelectedPlayer(results[selectedIndex]);
            }
            break;
        case "ArrowUp":
            event.preventDefault();
            setSelectedIndex((prevIndex: number) =>
                prevIndex > 0 ? prevIndex - 1 : results.length - 1
            );
            setSelectedPlayer(
                selectedIndex > 0
                    ? results[selectedIndex - 1]
                    : results[results.length - 1]
            );
            break;
        case "ArrowDown":
            event.preventDefault();
            setSelectedIndex((prevIndex: number) =>
                prevIndex < results.length - 1 ? prevIndex + 1 : 0
            );

            setSelectedPlayer(
                selectedIndex < results.length - 1
                    ? results[selectedIndex + 1]
                    : results[0]
            );
            break;
    }
};

export default function App() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [search, setSearch] = useState<string | null>(null);
    const [results, setResults] = useState<Player[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const playerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const autocompleteItemsRef = useRef<HTMLDivElement>(null);

    useSearch(
        players,
        search,
        results,
        setResults,
        selectedIndex,
        setSelectedIndex
    );

    useEffect(() => {
        (async () => {
            const playersService = new PlayersServiceHandler();
            const res = await playersService.getAll();
            setPlayers(res);
        })();
    }, []);

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
                <input
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        useKeyboardNavigation(
                            e as KeyboardEvent<Element>,
                            results,
                            selectedIndex,
                            setSelectedIndex,
                            setResults,
                            setSearch,
                            setSelectedPlayer,
                            playerRefs
                        );
                    }}
                    value={search || ""}
                    type="text"
                    placeholder="Search"
                    className="bg-brand-primary-100 p-6 w-full"
                />
                {results.length === 1 &&
                    results[0] === selectedPlayer &&
                    selectedPlayer.title === search &&
                    "djkaskdjkasjksaklj"}
                <div
                    className="autocomplete-items max-h-[60vh] overflow-y-auto"
                    ref={autocompleteItemsRef}
                >
                    {results.map((result, index) => (
                        <div
                            ref={(el) => (playerRefs.current[index] = el)}
                            onClick={() => {
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
                            {result.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
