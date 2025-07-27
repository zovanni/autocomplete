import * as qs from "qs";


export interface QueryOptions {
    action?: string;
    list?: string;
    cmtitle?: string;
    cmlimit?: string;
    format?: string;
    cmprop?: string;
}


export interface BaseContent {
    pageid: number;
}

export interface Player {
    // {pageid: 11983898, ns: 0, title: 'Fabio Fognini'}
    pageid: number;
    ns: number;
    title: string;
    type: 'page' | 'subcat';
    sortkeyprefix: string;
}

export interface Players {
    data: Player[];
}

export interface PlayersResponse {
    data: Players[];
}

export interface PlayersService<Player> {
    /** Retrieves all players. */
    getAll(): Promise<Player[]>;
    /** Retrieves a player by its slug with language support. */
    getByName(slug: string): Promise<Player | null>;
}

class WikiConnector {
    private static instance: WikiConnector;

    private constructor() { } // Previene istanziazione diretta

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
     * @returns 
     */
    private async fetchFromWiki<T>(endpoint: string, queryOptions: QueryOptions, log: boolean = false): Promise<{ data: T[], meta: object }> {
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

    async get(endpoint: string, queryOptions: QueryOptions, log: boolean = false): Promise<{ data: unknown[], meta: object }> {
        return this.fetchFromWiki(endpoint, queryOptions, log);
    }

}

class PlayersServiceHandler implements PlayersService<Player> {

    protected connector: WikiConnector;

    constructor() {
        this.connector = WikiConnector.getInstance();
    }

    async getAll(): Promise<Player[]> {

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
        const response = await this.connector.get(`/w/api.php`, queryOptions, true);

        // getting second results, female players
        const secondResponse = await this.connector.get(`/w/api.php`, {
            ...queryOptions,
            cmtitle: "Category:Italian_female_tennis_players",
        }, true);

        // merging results...
        const mergedResponse = [...(response as any).query.categorymembers, ...(secondResponse as any).query.categorymembers];

        // wiki does return sorted results, but we're sorting again because at this point
        // we have results from two different categories, we use sortkeyprefix
        const sortedResponse = mergedResponse.sort((a: Player, b: Player) => a.sortkeyprefix.localeCompare(b.sortkeyprefix));

        // finally, we filter out subcategories items
        const filteredResponse = sortedResponse.filter((item: Player) => item.type === 'page');

        return filteredResponse;

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

export { PlayersServiceHandler };