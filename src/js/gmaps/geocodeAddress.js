
import { fixMarkerSelected } from './fixMarkerSelected'

/**
 * Geocoder by original address name
 * https://google-developers.appspot.com/maps/documentation/javascript/examples/geocoding-simple
 */
export function geocodeAddress (geocoder, map, location, icon, infowindow) {
    geocoder.geocode({ 'address': location.address }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
             var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: icon
            });

             fixMarkerSelected(map, infowindow, location, marker)
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
