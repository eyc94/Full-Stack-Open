import React, { useState, useEffect } from "react";
import axios from "axios";

import Button from "./components/Button";

const App = () => {
    const [countryFilter, setCountryFilter] = useState("");
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        axios
            .get("https://restcountries.com/v3.1/all")
            .then(response => {
                console.log(response.data);
                setCountries(response.data);
            });
    }, []);

    const handleFilterChange = (event) => {
        setCountryFilter(event.target.value);
    };

    const countriesToShow = countries.filter(country =>
        country.name.common.toLowerCase().includes(countryFilter.toLowerCase())
    );

    if (countryFilter === "") {
        return (
            <div>
                Find Countries <input value={countryFilter} onChange={handleFilterChange} />
            </div>
        );
    }

    if (countriesToShow.length === 0) {
        return (
            <div>
                Find Countries <input value={countryFilter} onChange={handleFilterChange} />
                <div>No Matches!</div>
            </div>
        );
    }

    if (countriesToShow.length > 10) {
        return (
            <div>
                Find Countries <input value={countryFilter} onChange={handleFilterChange} />
                <div>Too many matches! Specify another filter.</div>
            </div>
        );
    }

    const keys = Object.keys(countriesToShow[0].languages);
    if (countriesToShow.length === 1) {
        return (
            <div>
                Find Countries <input value={countryFilter} onChange={handleFilterChange} />
                <h2>{countriesToShow[0].name.common}</h2>
                <div>Capital: {countriesToShow[0].capital[0]}</div>
                <div>Area: {countriesToShow[0].area}</div>
                <h3>Languages:</h3>
                <ul>
                    {keys.map(key =>
                        <li key={key}>{countriesToShow[0].languages[key]}</li>
                    )}
                </ul>
                <img src={countriesToShow[0].flags.png}></img>
            </div>
        );
    }

    return (
        <div>
            Find Countries <input value={countryFilter} onChange={handleFilterChange} />
            {countriesToShow.map(country =>
                <div key={country.name.common}>
                    {country.name.common}
                    <Button country={country} />
                </div>
            )}
        </div>
    );
};

export default App;
