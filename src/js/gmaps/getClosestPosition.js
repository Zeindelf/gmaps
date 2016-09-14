
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

/**
 * Google maps closest position
 */
// function getUserLocation () {
//     var geoLocationUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=";
//     var apiKeyGeoLocation = "AIzaSyC5P14BhDbJ4u2Ndz_CrUsJZM9mPGAWwT4";
//     var url = geoLocationUrl + apiKeyGeoLocation;

//     $.ajax({
//         url: url,
//         type: "post"
//     }).then( initStoreLocation, function (err) {
//         window.alert('Por favor, atualize a página.');
//     });
// };

// function initStoreLocation (response) {
//     var service = new google.maps.DistanceMatrixService;
//     var destinations = [];

//     $.each(lojas, function(index, val) {
//         destinations.push(val[0].coord);
//     });

//     service.getDistanceMatrix({
//         origins: [{ lat: response.location.lat, lng: response.location.lng }],
//         destinations: destinations,
//         travelMode: google.maps.TravelMode.DRIVING,
//         unitSystem: google.maps.UnitSystem.METRIC,
//         avoidHighways: false,
//         avoidTolls: false
//     }, function(response, status) {
//         if ( status === 'OK' ) {
//             var el = response.rows[0].elements;

//             var dist = []
//             $.each(el, function(index, val) {
//                 dist[index] = val.distance.value;
//             })

//             var minDist = 0;
//             var indexMinDist = 0;
//             $.each(dist, function(index, val) {
//                 if ( index == 0 ) {
//                     minDist = val;
//                     return;
//                 }

//                 if ( minDist > val ) {
//                     minDist = val;
//                     indexMinDist = index;
//                 }
//             });

//             var i = 0;
//             var indexNamed = '';
//             $.each(lojas, function(index, val) {
//                 if ( i == indexMinDist ) {
//                     indexNamed = index;
//                 }

//                 i++;
//             });

//             closestStore(lojas[indexNamed], el[indexMinDist]);
//         } else {
//             window.alert('Não exitem rotas cadastradas');
//         }
//     });
// };

// closestStore = function (store, dist) {
//     var $storeName = $('#x-store-name span');
//     var $storeAddress = $('#x-store-address');
//     var $storeDistance = $('#x-store-distance span');
//     var $storeImage = $('.x-group-banner-stores > div.x-right .x-img');

//     $storeName.text(store[0].nome);
//     $storeAddress.text(store[0].endereco);
//     $storeDistance.text('A loja FNAC está a ' + dist.distance.text + ' de você!');
//     $storeImage.css('background-image', 'url("' + store[0].img + '")')
// };
