
/**
 * Geocoder by original address name
 * https://google-developers.appspot.com/maps/documentation/javascript/examples/geocoding-simple
 */
export function geocodeAddress (geocoder, resultsMap, address) {
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
