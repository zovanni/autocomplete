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