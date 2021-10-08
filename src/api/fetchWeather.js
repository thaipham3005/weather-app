import axios from 'axios'

export const URL = 'https://api.openweathermap.org/data/2.5/weather'
export const URL_CITY = 'https://api.openweathermap.org/data/2.5/find'
export const URL_ONECALL = 'https://api.openweathermap.org/data/2.5/onecall'
export const URL_ICON = 'https://openweathermap.org/img/wn/'

const API_KEY = '040ed582d0722bf39d54f31d2d138dff'

export const fetchWeather = async (query) => {
    const { data } = await axios.get(URL, {
        params: {
            q: query,
            units: 'metric',
            APPID: API_KEY, 
            lang: 'vi'
        }
    })

    return data
}

export const fetchCurrentCity = async (lat,lon) => {
    const { data } = await axios.get(URL_CITY, {
        params: {
            lat: lat,
            lon: lon,
            cnt: 1,
            units: 'metric',
            APPID: API_KEY, 
            lang: 'vi'
        }
    })

    return data
}

export const fetchOneCall = async (location) => {
    const { data } = await axios.get(URL_ONECALL, {
        params: {
            lat: location.lat,
            lon: location.lon,
            units: 'metric',
            APPID: API_KEY,
            lang: 'vi'
        }
    })

    return data
}