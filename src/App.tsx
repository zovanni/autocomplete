import React from "react";

import "./styles.css";

export default function App() {
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
