import { useRef, memo } from "react";
import type { KeyboardEvent } from "react";
import type { Player } from "../services/types";
import { cn } from "../lib/utils";

const HighlightedText = ({
    text,
    highlight,
}: {
    text: string;
    highlight: string;
}) => {
    const splitKeepSeparator = (str: string, separator: string) => {
        const escaped = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex chars
        const regex = new RegExp(`(${escaped})`, "gi");
        return str.split(regex);
    };

    const input = text;
    let res = splitKeepSeparator(input, highlight as string);

    if (res.length > 1) {
        res = res.filter((element, index) => {
            // Remove the first element if it's an empty string
            return !(element === "" && index === 0);
        });
    }

    return res.map((element, index) => {
        return (
            <span
                className={cn(
                    "highlight",
                    element.toLowerCase() ===
                        (highlight as string).toLowerCase() &&
                        "bg-brand-primary-500"
                )}
            >
                {element}
            </span>
        );
    });
};

const SearchResults = ({
    results,
    playerRefs,
    isSelectingRef,
    setSearch,
    setSelectedPlayer,
    setSelectedIndex,
    selectedIndex,
    search,
}: {
    results: Player[];
    playerRefs: React.MutableRefObject<{
        [key: string]: HTMLDivElement | null;
    }>;
    isSelectingRef: React.MutableRefObject<boolean>;
    setSearch: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    selectedIndex: number;
    search: string | null;
}) => {
    return (
        <>
            <div role="listbox" aria-label="Search results">
                {results.map((result, index) => (
                    <div
                        role="option"
                        id={`option-${index}`}
                        aria-selected={selectedIndex === index}
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
                            selectedIndex === index && "bg-brand-primary-200"
                        )}
                    >
                        {HighlightedText({
                            text: result.title,
                            highlight: search as string,
                        })}
                    </div>
                ))}
            </div>
        </>
    );
};

export { SearchResults };
