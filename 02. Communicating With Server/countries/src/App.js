import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [countryFilter, setCountryFilter] = useState("");
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        axios
            .get("https://restcountries.com/v3.1/all")
            .then(response => {
                setCountries(response.data);
            })
    }, []);

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
