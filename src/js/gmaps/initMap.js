
import { getClosestPosition } from './getClosestPosition'
import { geocodeAddress } from './geocodeAddress'
import { find, minBy, findIndex } from 'lodash'

export function initMap ({ location }) {
    let mapProp = {
        // Coordenadas do Centro do Brasil
        center: new google.maps.LatLng(-14.992798, -51.647273),
        zoom: 4,
        scrollwheel: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    let map = new google.maps.Map(document.getElementById("map"), mapProp)
    let infowindow = new google.maps.InfoWindow;

    // Geocoder
    var geocoder = new google.maps.Geocoder();

    /**
     * Localização do Usuário
     */
    let marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(location.lat, location.lng),
        clickable: false,
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
            address: 'Av. Pulista, 901 - Bela Vista - São Paulo - SP',
            city: 'Bela Vista'
        },
        {
            id: 3,
            lat: -23.6225865,
            lng: -46.6984903,
            address: 'Av. Roque Petroni Júnior, 1089 - Vila Gertrudes - São Paulo - SP',
            city: 'Vila Gertrudes'
        },
        // {
        //     id: 1,
        //     lat: -23.5625593,
        //     lng: -46.6918872,
        //     address: 'Praça Dos Omaguas, 34 - Pinheiros - São Paulo - SP',
        //     city: 'Pinheiros'
        // },
        // {
        //     id: 4,
        //     lat: -22.846867,
        //     lng: -47.06088,
        //     address: 'Av. Guillerme Campos, 500 - Santa Genebra - Campinas - SP',
        //     city: 'Campinas'
        // },
        // {
        //     id: 999,
        //     lat: -23.5059353,
        //     lng: -46.8759078,
        //     address: 'Rua Campos Sales - Barueri',
        //     city: 'Barueri'
        // },
        // {
        //     id: 321564,
        //     lat: -23.5289808,
        //     lng: -46.8874073,
        //     address: 'Av. Brigadeiro M. R. Jordão - Jardim Silveira - Barueri',
        //     city: 'Barueri'
        // }
    ]

    // Container de infos da distância
    let $mapAddress = $('.gmap__address')
    // Seleciona locais
    let $selectPosition = $('.gmap__buttons--select-position')

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
        $selectPosition.append(`<option value="${fixedLocations[i].id}">${fixedLocations[i].city}</option>`)
    }

    /**
     * Setar posição após o select
     */
    $selectPosition.change( () => {
        // Limpar div com distância do usuário caso exista
        $mapAddress.empty().hide()

        let $selected = parseInt($('.gmap__buttons--select-position option:selected').val())
        let currentLocation = find(fixedLocations, {'id': $selected})
        if ( $selected > -1 ) {
            let fixMarkerSelected = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
                icon: 'http://maps.google.com/mapfiles/kml/pal3/icon35.png'
            })
            map.setZoom(16)
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
    let $nearby = $('.gmap__buttons--nearby')
    let $map = $('#map')
    $nearby.on('click', () => {
        $selectPosition.val('localizate')

        /**
         * Get min distance
         */
        let geocoder = new google.maps.Geocoder;
        let service = new google.maps.DistanceMatrixService;

        service.getDistanceMatrix({
            origins: [{ lat: location.lat, lng: location.lng }],
            destinations: fixedLocations,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        }, function(response, status) {
            if ( status === 'OK' ) {
                let el = response.rows[0].elements
                let min = minBy(el, (obj) => obj.distance.value )

                let minDist = min.distance.value
                let minTime = min.duration.value
                let formattedMinDist = min.distance.text
                let formattedMinTime = min.duration.text

                let index = findIndex(el, (obj) => obj.distance.value == minDist )

                // Adiciona as informações
                $mapAddress.empty().show().append(`
                    <p class="gmap__address--title">${fixedLocations[index].address}</h3>
                    <p class="gmap__address--dist"><span>Distância</span>: ${formattedMinDist}</p>
                    <p class="gmap__address--time"><span>Tempo aproximado</span>: ${formattedMinTime}</p>
                `)

                // Mostra a rota inicial e final
                let origin = `${location.lat},${location.lng}`
                let destination = `${fixedLocations[index].address}`

                getClosestPosition(map, origin, destination)
            } else {
                window.alert('Não exitem rotas cadastradas')
            }
        })
    })
}
