import type { QueryOptions, Player, PlayersService as PlayersServiceInterface } from "./types";
import qs from "qs";

/**
 * Generic Wikipedia API response interface
 */
interface WikiApiResponse<T = any> {
    query?: {
        categorymembers?: T[];
        [key: string]: any;
    };
    error?: {
        code: string;
        info: string;
    };
    [key: string]: any;
}
class WikiConnector {
    private static instance: WikiConnector;

    private constructor() { } // Prevents direct instantiation

    static getInstance(): WikiConnector {
        if (!WikiConnector.instance) {
            WikiConnector.instance = new WikiConnector();
        }
        return WikiConnector.instance;
    }


    // Generic helper method to build query string
    private buildQueryString(options: QueryOptions): string {
        return qs.stringify(options);
    }

    /**
     * 
     * @todo error handling instad of direct throw
     * @param endpoint 
     * @param queryOptions 
     * @param log - if true, will log the url
     * @returns {query: { categorymembers: Player[] }}
     */
    private async fetchFromWiki<T>(endpoint: string, queryOptions: QueryOptions, log: boolean = false): Promise<WikiApiResponse> {
        const query = this.buildQueryString(queryOptions);

        // Use the Vite proxy instead of undefined VITE_REMOTE_BASE
        const url = `/api/wikipedia${endpoint}?${query}`;

        if (log) {
            console.log('_________________________________________________________________');
            console.log('GET URL:', url);
        }

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // Remove CORS headers - they don't work from client-side
            // redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                console.error(response);
                throw new Error(`Failed to fetch from ${endpoint}: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('\n\n')
            console.error(url)
            console.error(`Error fetching from ${endpoint}:`, error);
            console.error('\n\n')
            throw error;
        }
    }

    async get(endpoint: string, queryOptions: QueryOptions, log: boolean = false): Promise<WikiApiResponse> {
        return this.fetchFromWiki(endpoint, queryOptions, log);
    }

}

class PlayersService implements PlayersServiceInterface<Player> {

    protected connector: WikiConnector;

    constructor() {
        this.connector = WikiConnector.getInstance();
    }

    /**
     * @returns {Player[]}
     */
    async getAll(): Promise<Player[]> {

        try {
            /**
             * @see https://www.mediawiki.org/wiki/API:Categorymembers
             */
            const queryOptions: QueryOptions = {
                action: "query",
                list: "categorymembers",
                cmtitle: "Category:Italian_male_tennis_players",
                cmlimit: "500",
                format: "json",
                cmprop: "pageid|title|type|sortkeyprefix",
            };

            // getting first results, male players
            const response: WikiApiResponse<Player> = await this.connector.get(`/w/api.php`, queryOptions, true);

            // getting second results, female players
            const secondResponse: WikiApiResponse<Player> = await this.connector.get(`/w/api.php`, {
                ...queryOptions,
                cmtitle: "Category:Italian_female_tennis_players",
            }, true);

            // merging results...
            const malePlayers = response.query?.categorymembers || [];
            const femalePlayers = secondResponse.query?.categorymembers || [];
            const mergedResponse = [...malePlayers, ...femalePlayers];

            // wiki does return sorted results, but we're sorting again because at this point
            // we have results from two different categories, we use sortkeyprefix
            const sortedResponse = mergedResponse.sort((a: Player, b: Player) => a.sortkeyprefix.localeCompare(b.sortkeyprefix));

            // finally, we filter out subcategories items
            const filteredResponse = sortedResponse.filter((item: Player) => item.type === 'page');

            return filteredResponse;
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch players from Wikipedia API');
        }


    }

    async getById(): Promise<Player | null> {
        // const response = await this.connector.get(`/w/api.php`, {});
        // if (Array.isArray(response.data) && response.data.length > 0) {
        //     return response.data[0] as Player;
        // }
        return null;
    }

    async getByName(slug: string): Promise<Player | null> {
        // const response = await this.connector.get(`/w/api.php`, {});
        // if (Array.isArray(response.data) && response.data.length > 0) {
        //     return response.data[0] as Player;
        // }
        return null;
    }

}

export { PlayersService };