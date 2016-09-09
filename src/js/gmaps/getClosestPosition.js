
export function getClosestPosition (map, origin, destination) {
    var rendererOptions = {
        map: map,
        suppressMarkers : true
    }
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    calculateAndDisplayRoute(directionsDisplay, directionsService, /*markerArray, stepDisplay,*/ map, origin, destination);

    $('.gmap__buttons--select-position').change( () => directionsDisplay.setDirections({routes: []}) )
 }

function calculateAndDisplayRoute(directionsDisplay, directionsService, /*markerArray, stepDisplay,*/ map, origin, destination) {

    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
