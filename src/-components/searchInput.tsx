import { useCallback } from "react";
import type { KeyboardEvent } from "react";
import type { Player } from "../services/types";
import { cn } from "../lib/utils";

interface SearchInputProps {
    search: string;
    setSearch: (search: string | null) => void;
    loading: boolean;
    results: Player[];
    selectedIndex: number;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
    setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    playerRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
    isSelectingRef: React.MutableRefObject<boolean>;
    useKeyboardNavigation: (params: {
        event: KeyboardEvent<Element>;
        results: Player[];
        selectedIndex: number;
        setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
        setSearch: (search: string | null) => void;
        setSelectedPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
        playerRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>;
        isSelectingRef: React.MutableRefObject<boolean>;
    }) => void;
}

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
}: SearchInputProps) => {

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
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
    }, [useKeyboardNavigation, results, selectedIndex, setSelectedIndex, setSearch, setSelectedPlayer, playerRefs, isSelectingRef]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 100) {
            setSearch(value);
        }
    }, [setSearch]);

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
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide stroke-brand-primary-900 lucide-loader-circle-icon lucide-loader-circle"
                        aria-hidden="true"
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
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide stroke-brand-primary-900 lucide-search-icon lucide-search"
                        aria-hidden="true"
                    >
                        <path d="m21 21-4.34-4.34" />
                        <circle cx="11" cy="11" r="8" />
                    </svg>
                )}
            </div>
            <input
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                value={search || ""}
                type="text"
                placeholder="Search for tennis players..."
                className="bg-brand-primary-100 p-6 w-full indent-10"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-activedescendant={
                    selectedIndex >= 0 ? `option-${selectedIndex}` : undefined
                }
                aria-autocomplete="list"
                aria-label="Search for tennis players"
                maxLength={100}
            />
        </div>
    );
};

export { SearchInput };
