import React, { useState } from "react";

const Button = ({ country }) => {
    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(!show);
    };

    const keys = Object.keys(country.languages);

    if (show) {
        return (
            <>
                <button onClick={handleShow}>Hide</button>
                <h2>{country.name.common}</h2>
                <div>Capital: {country.capital[0]}</div>
                <div>Area: {country.area}</div>
                <h3>Languages:</h3>
                <ul>
                    {keys.map(key =>
                        <li key={key}>{country.languages[key]}</li>
                    )}
                </ul>
                <img src={country.flags.png}></img>
            </>
        );
    }

    return (
        <button onClick={handleShow}>Show</button>
    );
};

export default Button;
