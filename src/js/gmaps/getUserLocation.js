
import { initMap } from './initMap.js'
import { iMap } from './iMap'

export function getUserLocation () {

    var geoLocationUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key="
    var apiKeyGeoLocation = "AIzaSyC5P14BhDbJ4u2Ndz_CrUsJZM9mPGAWwT4"

    $.ajax({
        url: `${geoLocationUrl}${apiKeyGeoLocation}`,
        type: "post"
    }).done(initMap)
    // }).done( (data) => {
    //     iMap()
    // })
 }
