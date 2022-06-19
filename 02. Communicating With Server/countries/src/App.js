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
            });
    }, []);

    const handleFilterChange = (event) => {
        setCountryFilter(event.target.value);
    };

    const countriesToShow = countries.filter(country =>
        country.name.common.toLowerCase().includes(countryFilter.toLowerCase())
    );

    return (
        <div>
            Find Countries <input value={countryFilter} onChange={handleFilterChange} />
            {countriesToShow.map(country =>
                <div key={country.name.common}>{country.name.common}</div>
            )}
        </div>
    );

};

export default App;
