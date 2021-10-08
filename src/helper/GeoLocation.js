const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}

export const GeoLocationPromise = (res, rej) => {
    if (navigator.geolocation) {
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej, options)
        })
    } else {
        console.warn('Geolocation is not available on this device');
        return null
        // alert('Geolocation is not available on this device')
    }
}

const getLocation = () => {
    return GeoLocationPromise  
}
export default getLocation