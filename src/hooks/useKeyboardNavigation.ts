import type { KeyboardEvent } from "react";
import type { Player } from "../services/types";

const useKeyboardNavigation = ({
    event,
    results,
    selectedIndex,
    setSelectedIndex,
    setSearch,
    setSelectedPlayer,
    playerRefs,
    isSelectingRef,
}: {
    event: KeyboardEvent<Element>;
    results: Player[];
    selectedIndex: number;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    setSearch: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    playerRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
    isSelectingRef: React.MutableRefObject<boolean>;
}) => {
    event = event || window.event;
    switch (event.key) {
        case "Enter":
            event.preventDefault();
            if (results[selectedIndex]) {
                isSelectingRef.current = true; // Set flag before programmatic setSearch
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

export { useKeyboardNavigation };