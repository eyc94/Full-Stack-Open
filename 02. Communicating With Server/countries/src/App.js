import React, { useState, useEffect } from "react";

const App = () => {
    const [countryFilter, setCountryFilter] = useState("");

    const handleFilterChange = (event) => {
        setCountryFilter(event.target.value);
    };

    return (
        <div>
            Find Countries <input value={countryFilter} onChange={handleFilterChange} />
        </div>
    );

};

export default App;
