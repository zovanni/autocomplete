import { memo } from "react";
import type { Player } from "../services/types";
import { cn } from "../lib/utils";

const HighlightedText = memo(
    ({ text, highlight }: { text: string; highlight: string }) => {
        // Early exit
        if (!highlight || !text) return <span>{text}</span>;

        const splitKeepSeparator = (str: string, separator: string) => {
            const escaped = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(`(${escaped})`, "gi");
            return str.split(regex);
        };

        let res = splitKeepSeparator(text, highlight);

        if (res.length > 1) {
            res = res.filter((element, index) => {
                // Remove the first element if it's an empty string
                return !(element === "" && index === 0);
            });
        }

        return (
            <>
                {res.map((element, index) => (
                    <span
                        key={index}
                        className={cn(
                            "highlight",
                            element.toLowerCase() === highlight.toLowerCase() &&
                                "bg-brand-primary-500"
                        )}
                    >
                        {element}
                    </span>
                ))}
            </>
        );
    }
);

HighlightedText.displayName = "HighlightedText";

const SearchResults = memo(
    ({
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
        setSearch: (search: string | null) => void;
        setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
        setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
        selectedIndex: number;
        search: string;
    }) => {
        if (!results.length) return null;

        return (
            <div role="listbox" aria-label="Search results">
                {results.map((result, index) => (
                    <div
                        key={result.pageid}
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
                        <HighlightedText
                            text={result.title}
                            highlight={search}
                        />
                    </div>
                ))}
            </div>
        );
    }
);
export { SearchResults };
