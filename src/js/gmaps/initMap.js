
import { find, minBy, findIndex } from 'lodash'

export function initMap ({ location }) {
    let mapProp = {
        center: new google.maps.LatLng(location.lat, location.lng),
        zoom: 4,
        scrollwheel: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    let map = new google.maps.Map(document.getElementById("map"), mapProp)
    let infowindow = new google.maps.InfoWindow;

    /**
     * Localização do Usuário
     */
    let marker = new google.maps.Marker({
        map: map,
        position: mapProp.center,
        icon: 'http://maps.google.com/mapfiles/kml/pal3/icon63.png'
    })
    marker.addListener('click', () => {
        let userContent = `
            <div style="padding: 4px 2px; color: red;">
                <h3>User Location</h3>
            </div>
        `

        infowindow.setContent(userContent)
        infowindow.open(map, marker)
    })

    let fixedLocations = [
        {
            id: 2,
            lat: -23.5659064,
            lng: -46.6515637,
            address: 'AV. PAULISTA, 901 TÉRREO MEZ. E 1º SUBSOLO, - BELA VISTA - SÃO PAULO - SP',
            city: 'Bela Vista'
        },
        {
            id: 3,
            lat: -23.6225865,
            lng: -46.6984903,
            address: 'AVENIDA ROQUE PETRONI JÚNIOR, 1089 - VILA GERTRUDES - SÃO PAULO - SP',
            city: 'Vila Gertrudes'
        },
        {
            id: 1,
            lat: -23.5625593,
            lng: -46.6918872,
            address: 'PRAÇA DOS OMAGUÁS, 34 - PINHEIROS - SÃO PAULO - SP',
            city: 'Pinheiros'
        },
        {
            id: 4,
            lat: -22.846867,
            lng: -47.06088,
            address: 'AV. GUILHERME CAMPOS, 500 - SANTA GENEBRA - CAMPINAS - SP',
            city: 'Campinas'
        },
        {
            id: 999,
            lat: -23.5059353,
            lng: -46.8759078,
            address: 'RUA CAMPOS SALES',
            city: 'Barueri'
        },
        {
            id: 321564,
            lat: -23.5289808,
            lng: -46.8874073,
            address: 'AV. BRIGADEIRO M. R. JORDÃO',
            city: 'Barueri'
        }
    ]

    /**
     * Posições fixas
     */
    for ( let i = 0; i < fixedLocations.length; i ++ ) {
        let fixMarker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(fixedLocations[i].lat, fixedLocations[i].lng),
            icon: 'http://maps.google.com/mapfiles/kml/pal3/icon35.png'
        })
        fixMarker.addListener('click', () => {
            let fixedContent = `
                <div style="padding: 4px 2px; color: blue;">
                    <h3>Fixed Location</h3>
                    <p>${fixedLocations[i].address}</p>
                </div>
            `

            infowindow.setContent(fixedContent)
            infowindow.open(map, fixMarker)
        })

        /**
         * Criar select de localização
         */
        let $selectPosition = $('.select-position')
        $selectPosition.append(`
            <option value="${fixedLocations[i].id}">${fixedLocations[i].city}</option>
        `)
    }

    /**
     * Setar posição após o select
     */
    let $select = $('select.select-position')
    $select.change( () => {
        let $selected = parseInt($('select.select-position option:selected').val())
        let currentLocation = find(fixedLocations, {'id': $selected})
        if ( $selected > -1 ) {
            let fixMarkerSelected = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
                icon: 'http://maps.google.com/mapfiles/kml/pal3/icon35.png'
            })
            map.setZoom(14)
            map.setCenter(fixMarkerSelected.getPosition())

            fixMarkerSelected.addListener('click', () => {
                let fixedContent = `
                    <div style="padding: 4px 2px; color: blue;">
                        <h3>Fixed Location</h3>
                        <p>${currentLocation.address}</p>
                    </div>
                `

                infowindow.setContent(fixedContent)
                infowindow.open(map, fixMarkerSelected)
            })
        }
    })

    /**
     * Localização mais próxima
     */
    let $nearby = $('.nearby')
    let $map = $('#map')
    $nearby.on('click', (ev) => {
        $map.fadeOut('fast', () => {
            map.setZoom(14)
            map.setCenter(marker.getPosition())
        }).fadeIn()
    })

    /**
     * Distance
     */
    var geocoder = new google.maps.Geocoder;
    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
        origins: [{ lat: location.lat, lng: location.lng }],
        destinations: [
            { lat: fixedLocations[0].lat, lng: fixedLocations[0].lng },
            { lat: fixedLocations[1].lat, lng: fixedLocations[1].lng },
            { lat: fixedLocations[2].lat, lng: fixedLocations[2].lng },
            { lat: fixedLocations[3].lat, lng: fixedLocations[3].lng },
            { lat: fixedLocations[4].lat, lng: fixedLocations[4].lng },
            { lat: fixedLocations[5].lat, lng: fixedLocations[5].lng }
        ],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function(response, status) {

        let el = response.rows[0].elements
        window.console.log('Elemento', el)

        let minDist = minBy(el, (obj) => obj.distance.value )
        window.console.log('Distância mínima', minDist)

        let index = findIndex(el, (obj) => obj.distance.value == minDist.distance.value )
        window.console.log('Index', index)

        window.console.log('Menor distância:', response.destinationAddresses[index])
    });
 }
