// Old distance
function s () {
    /**
     * Distance with select
     */
    let geocoder = new google.maps.Geocoder;
    let service = new google.maps.DistanceMatrixService;
    let $mode = $('#mode')

    $mode.change( () => {
        service.getDistanceMatrix({
            origins: [{ lat: location.lat, lng: location.lng }],
            destinations: fixedLocations,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        }, function(response, status) {
            let el = response.rows[0].elements
            let min = minBy(el, (obj) => obj.distance.value )

            let minDist = min.distance.value
            let minTime = min.duration.value
            let formattedMinDist = min.distance.text
            let formattedMinTime = min.duration.text

            let index = findIndex(el, (obj) => obj.distance.value == minDist )

            let $mapAddress = $('.address')
            $mapAddress.empty().append(`
                <h3>${fixedLocations[index].address}</h3>
                <p><b>Distância</b>: ${formattedMinDist}</p>
                <p><b>Tempo</b>: ${formattedMinTime}</p>
            `)
        })
    })
}
