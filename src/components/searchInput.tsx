import type { KeyboardEvent } from "react";
import type { Player } from "../services/types";
import { cn } from "../lib/utils";

const SearchInput = ({
    search,
    setSearch,
    loading,
    results,
    selectedIndex,
    setSelectedIndex,
    setSelectedPlayer,
    playerRefs,
    isSelectingRef,
    useKeyboardNavigation,
}: {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string | null>>;
    loading: boolean;
    results: Player[];
    selectedIndex: number;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    playerRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
    isSelectingRef: React.MutableRefObject<boolean>;
    useKeyboardNavigation: ({
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
    }) => void;
}) => {
    return (
        <div className="relative">
            <div
                className={cn(
                    "loading w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2",
                    search && loading && "animate-spin"
                )}
            >
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
                className="bg-brand-primary-100 p-6 w-full indent-10"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-activedescendant={
                    selectedIndex >= 0 ? `option-${selectedIndex}` : undefined
                }
                aria-autocomplete="list"
                aria-label="Search for tennis players"
            />
        </div>
    );
};

export { SearchInput };
