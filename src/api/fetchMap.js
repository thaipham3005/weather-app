import axios from 'axios'

export const URL = 'https://api.openweathermap.org/data/2.5/weather'
export const URL_ICON = 'https://openweathermap.org/img/wn/'

const API_KEY = '040ed582d0722bf39d54f31d2d138dff'

const fetchMap = async (query) => {
    const {data} = await axios.get(URL, {
        params: {
            
        }
    })
    return data
}

export default fetchMap

