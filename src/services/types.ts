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
    /** e.g. { "ns": 0, "title": "Fabio Fognini", "sortkeyprefix": "Fognini, Fabio", "type": "page"} */
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
    /** Retrieves a player by its slug */
    getByName(slug: string): Promise<Player | null>;
}