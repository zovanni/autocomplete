import * as qs from "qs";


export interface QueryOptions {
    action: string;
    list: string;
    cmtitle: string;
    cmlimit: string;
    format: string;
    origin: string;
}


export interface BaseContent {
    documentId: string;
}

export interface DataService<T extends BaseContent> {
    /** Retrieves all entities of type `T`. */
    getAll(): Promise<T[]>;

    /** Retrieves a single entity by its unique identifier. */
    getById(id: string): Promise<T | null>;

    getBySlug(slug: string): Promise<T | null>;

}

export interface Player {
    documentId: string;
    name: string;
    slug: string;
    image: string;
    position: string;
}

export interface Players {
    data: Player[];
}

export interface PlayersResponse {
    data: Players[];
}

export interface PlayersService extends DataService<Player> {
    /** Retrieves all players. */
    getAll(): Promise<Player[]>;
    /** Retrieves a player by its slug with language support. */
    getBySlug(slug: string): Promise<Player | null>;
}

export class WikiConnector {
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

        // Use the Vite proxy instead of direct Wikipedia API
        const url = `${import.meta.env.VITE_REMOTE_BASE}${endpoint}?${query}`;

        if (log) {
            console.log('_________________________________________________________________');
            console.log('GET URL:', url);
        }

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Origin": "*",
                "Access-Control-Allow-Origin": "*"
            },
            // redirect: "follow" as RequestRedirect
        };

        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                console.error(response);
                // throw new Error(`Failed to fetch from ${endpoint}: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('\n\n')
            console.error(url)
            console.error(`Error fetching from ${endpoint}:`, error);
            console.error('\n\n')
            // throw error;
        }
    }

    async get(endpoint: string, queryOptions: QueryOptions, log: boolean = false): Promise<{ data: unknown[], meta: object }> {
        return this.fetchFromWiki(endpoint, queryOptions, log);
    }

}


class PlayersServiceHandler implements PlayersService {

    protected connector: WikiConnector;

    constructor() {
        this.connector = WikiConnector.getInstance();
    }

    async getAll(): Promise<Player[]> {

        const queryOptions: QueryOptions = {
            // https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Italian_male_tennis_players&cmlimit=500&format=jso
            // https://en.wikipedia.org/api/wikipedia/w/api.php?action=query&list=categorymembers&cmtitle=Category%3AItalian_male_tennis_players&cmlimit=500&format=json
            action: "query",
            list: "categorymembers",
            cmtitle: "Category:Italian_male_tennis_players",
            cmlimit: "500",
            format: "json",
            origin: "*",
        };

        const response = await this.connector.get(`/w/api.php`, queryOptions, true);
        return response.data as Player[];
    }

    async getById(): Promise<Player | null> {
        const response = await this.connector.get(`/w/api.php`, {});
        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data[0] as Player;
        }
        return null;
    }

    async getBySlug(slug: string): Promise<Player | null> {
        const response = await this.connector.get(`/w/api.php`, { filters: { slug } });
        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data[0] as Player;
        }
        return null;
    }

}

export { PlayersServiceHandler };