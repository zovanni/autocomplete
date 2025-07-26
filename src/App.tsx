import React, { useEffect, useState } from "react";
import { PlayersService, PlayersServiceHandler } from "./services/types";
import type { Player } from "./services/types";

import "./styles.css";

export default function App() {
    // const articlesService = getArticleService();
    // const latestArticles = await articlesService.getAll(lang);
    const [players, setPlayers] = useState<Player[]>([]);

    React.useEffect(() => {
        let isMounted = true;
        (async () => {
            const playersService = new PlayersServiceHandler();
            const res = await playersService.getAll();
            console.log(res);
            console.log(res);
            console.log(res);
          console.log(res);
          setPlayers(res);
        })();
    }, []);
  
  console.log(players);

    return (
        <div>
            <div className="autocomplete">
                <input type="text" placeholder="Search" />
                <div className="autocomplete-items">
                    <div className="autocomplete-item">Item 1</div>
                    <div className="autocomplete-item">Item 2</div>
                </div>
            </div>
        </div>
    );
}
