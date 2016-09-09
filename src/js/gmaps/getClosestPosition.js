
export function getClosestPosition (map, origin, destination) {
    var markerArray = [];
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    var stepDisplay = new google.maps.InfoWindow;

    calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map, origin, destination);
 }

function calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map, origin, destination) {
    // Remove todas as marcações
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

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

function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
        stepDisplay.setContent(text)
        stepDisplay.open(map, marker)
    });
}
