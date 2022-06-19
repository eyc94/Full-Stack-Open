import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ country }) => {
    const [weather, setWeather] = useState(null);
    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.name.common}&appid=${apiKey}`)
            .then(response => {
                setWeather({
                    temperature: response.data.main.temp,
                    picture: response.data.weather[0].icon,
                    windSpeed: response.data.wind.speed
                });
            });
    }, [apiKey]);

    if (weather === null) {
        return (
            <div>
                Loading weather info...
            </div>
        );
    }

    return (
        <div>
            <div>Temperature: {weather.temperature - 273.15} Celcius</div>
            <img src={`http://openweathermap.org/img/wn/${weather.picture}@2x.png`}></img>
            <div>Wind: {weather.windSpeed} m/s</div>
        </div>
    );
};

export default Weather;
