
import { initMap } from './initMap.js'

export function getUserLocation () {

    var geoLocationUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key="
    var apiKeyGeoLocation = "AIzaSyC5P14BhDbJ4u2Ndz_CrUsJZM9mPGAWwT4"

    $.ajax({
        url: `${geoLocationUrl}${apiKeyGeoLocation}`,
        type: "post"
    // }).done(initMap)
    }).done( (data) => {
        iMap()
    })
 }

function iMap() {
    var markerArray = [];
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 40.771, lng: -73.974}
    });

    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    var stepDisplay = new google.maps.InfoWindow;

    // Mostra a rota inicial e final
    calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);

    var onChangeHandler = function() {
        calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
    };

    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
    document.getElementById('mode').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map) {

    var selectedMode = document.getElementById('mode').value;

    // Remove todas as marcações
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        travelMode: google.maps.TravelMode[selectedMode]
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
