import React, { useState, useEffect } from "react";
import { fetchWeather, fetchCurrentCity, fetchOneCall, URL_ICON } from "./api/fetchWeather";
import { GeoLocationPromise } from "./helper/GeoLocation";
import "./App.css";

const TIMER = 30 * 60 * 1000

const App = () => {
    const [query, setQuery] = useState(localStorage.getItem('WeatherApp-city'))
    const [weather, setWeather] = useState({})
    const [location, setLocation] = useState("")

    const search = async (e) => {
        if (e.key === "Enter") {
            await layoutData(query)
        }
    }

    const layoutData = async (query) => {
        const current = await fetchWeather(query)
        let location = {
            lat: current.coord.lat,
            lon: current.coord.lon
        }
        const onecall = await fetchOneCall(location)
        setWeather({ ...current, ...onecall });
        localStorage.setItem('WeatherApp-city', current.name)

        setQuery("")
    }

    const refreshCurrentWeather = async () => {
        setInterval(async () => {
            await layoutData(localStorage.getItem("WeatherApp-city"))
        }, TIMER)
    }

    const suggestLocation = async (lat, lon) => {
        const data = await fetchCurrentCity(lat, lon);
        setWeather(data);

    }
    const renderForecast = weather.daily && weather.daily.slice(0, 6).map((day) => {
        let datetime = new Date(day.dt * 1000)
        let temp = day.temp.day
        let humid = day.humidity
        let rain = day.rain
        let icon = URL_ICON + day.weather[0].icon + '@2x.png'
        let description = day.weather[0].description
        // let wind = day.wind_speed
        return (
            <>
                <div className="grid-item">
                    {datetime.toLocaleDateString('vi-vn')}
                </div>
                <div className="grid-item">
                    {temp}&deg;C
                </div>
                <div className="grid-item">
                    {humid}%
                </div>
                <div className="grid-item">
                    {rain}mm/h
                </div>
                <div className="grid-item">
                    <img className="icon-sm" src={icon} alt={description} />
                </div>
            </>
        )
    })

    const renderForecastDay = weather.hourly && weather.hourly.slice(0, 14).map((hour) => {
        let datetime = new Date(hour.dt * 1000)
        let temp = hour.temp
        let humid = hour.humidity
        let uv = hour.uvi
        let icon = URL_ICON + hour.weather[0].icon + '@2x.png'
        let description = hour.weather[0].description
        // let wind = day.wind_speed
        return (
            <>
                <div className="grid-item">
                    {datetime.toLocaleTimeString('vi-vn')}
                </div>
                <div className="grid-item">
                    {temp}&deg;C
                </div>
                <div className="grid-item">
                    {humid}%
                </div>
                <div className="grid-item">
                    {uv}
                </div>
                <div className="grid-item">
                    <img className="icon-sm" src={icon} alt={description} />
                </div>
            </>
        )
    })

    // Take action at UI loaded for the first time
    useEffect(() => {
        const fetchLocation = async () => await GeoLocationPromise()
        fetchLocation().then(res => {
            let lat = res.coords.latitude
            let lon = res.coords.longitude
            setLocation({ lat, lon })
        })

        query && layoutData(query)
        refreshCurrentWeather()
    }, [])

    // Take action on geolocation update 
    // (after device detected GPS location)
    useEffect(() => {
        console.log(location);
        if (location)
            suggestLocation(location.lat, location.lon)

    }, [location])

    // useEffect(() => {
    //     console.log(weather);
    // }, [weather])

    return (
        <div className="container">
            <div className="container-info">
                {weather.main && (
                    <div className="card current">
                        <div className="card-header">
                            <h2 className="city-name">
                                <span>{weather.name}</span>
                                <sup className="country">{weather.sys.country}</sup>
                            </h2>

                        </div>
                        <div className="card-body flex flex-col">
                            <div className="grid grid-2">
                                <div className="temperature grid-item">
                                    <span class="material-icons">
                                        thermostat
                                    </span>
                                    {weather.main.temp}
                                    <sup className="unit">&deg;C</sup>
                                </div>
                                <div className="humidity grid-item">
                                    <span class="material-icons">
                                        grain
                                    </span>
                                    {weather.main.humidity}
                                    <sup className="unit">%</sup>
                                </div>
                            </div>
                            <div className="grid grid-2">
                                <div className="grid-item grid grid-2">
                                    <div>Min</div>
                                    <div className="temp-min">
                                        {weather.main.temp_min} &deg;C
                                    </div>
                                    <div>Max</div>
                                    <div className="temp-max">
                                        {weather.main.temp_max} &deg;C
                                    </div>
                                    <div>Real feel</div>
                                    <div className="temp-feel">
                                        {weather.main.feels_like} &deg;C
                                    </div>
                                    <div>Wind speed</div>
                                    <div className="wind-speed">
                                        {weather.wind.speed} m/sec
                                    </div>
                                    <div>Direction</div>
                                    <div className="wind-deg">
                                        {weather.wind.deg}&deg;
                                    </div>
                                </div>
                                <div className="icon grid-item">
                                    <img src={URL_ICON + weather.weather[0].icon + `@2x.png`} alt={weather.weather[0].description} />
                                    <span>{weather.weather[0].description.toUpperCase()}</span>

                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {weather.daily && (
                    <div className="card forecast">
                        <div className="grid grid-5">
                            {renderForecast}
                        </div>
                    </div>
                )}

                {weather.hourly && (
                    <div className="card intraday">
                        <div className="grid grid-5">
                            {renderForecastDay}
                        </div>
                    </div>
                )}
            </div>
            

            <input
                type="text"
                className="search-box"
                placeholder="Find city ..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={search}
            />
        </div>
    );
};

export default App;
