
import { getClosestPosition } from './getClosestPosition'
import { geocodeAddress } from './geocodeAddress'
import { unique } from '../utils/unique'

import { find, minBy, findIndex } from 'lodash'

export function initMap ({ location }) {
    let mapProp = {
        // Coordenadas do Centro do Brasil
        center: new google.maps.LatLng(-14.992798, -51.647273),
        zoom: 4,
        scrollwheel: true,
        disableDefaultUI: true,
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

    let fixedLocations = [
        {
            id: 1,
            address: 'Praça Dos Omaguas, 34 - Pinheiros - São Paulo - SP',
            city: 'Pinheiros',
            state: 'SP',
        },
        {
            id: 2,
            address: 'Av. Pulista, 901 - Bela Vista - São Paulo - SP',
            city: 'Bela Vista',
            state: 'SP',
        },
        {
            id: 3,
            address: 'Av. Roque Petroni Júnior, 1089 - Vila Gertrudes - São Paulo - SP',
            city: 'Vila Gertrudes',
            state: 'SP',
        },
        {
            id: 4,
            address: 'Av. Guillerme Campos, 500 - Santa Genebra - Campinas - SP',
            city: 'Campinas',
            state: 'SP',
        },
        {
            id: 5,
            address: 'Rodovia BR-356, 3049 - BELVEDERE - Belo Horizonte - MG',
            city: 'Belo Horizonte',
            state: 'MG',
        },
        {
            id: 6,
            address: 'AV. DAS AMÉRICAS, 4666 - BARRA DA TIJUCA - RIO DE JANEIRO - RJ',
            city: 'Barra da Tijuca',
            state: 'RJ',
        },
        {
            id: 7,
            address: 'RUA PROF. PEDRO VIRIATO PARIGOT DE SOUZA, 600 - BARIGUI - CURITIBA - PR',
            city: 'Curitiba',
            state: 'PR',
        },
        {
            id: 8,
            address: 'SAI/SO ÁREA 6580 LUC 149P, - GUARÁ - BRASILIA - DF',
            city: 'Brasília',
            state: 'DF',
        },
        {
            id: 9,
            address: 'AV DIARIO DE NOTICIAS, 300 - CRISTAL - PORTO ALEGRE - RS',
            city: 'Porto Alegre',
            state: 'RS',
        },
        {
            id: 10,
            address: 'AV. CORONEL FERNANDO FERREIRA LEITE, 1540 - JD. CALIFORNIA - RIBEIRÃO PRETO - SP',
            city: 'Ribeirão Preto',
            state: 'SP',
        },
        {
            id: 11,
            address: 'AVE JAMEL CECILIO, 3300 - JARDIM GOIAS - GOIANIA - GO',
            city: 'Goiânia',
            state: 'GO',
        },
    ]

    // Container de infos da distância
    let $mapAddress = $('.gmap__address')
    // Seleciona locais
    let $selectPosition = $('.gmap__buttons--select-position')

    /**
     * Posições fixas
     */
    let stateLocations = []

    // Cria o array com os Estados de cada elemento (contém repetições)
    for ( let i = 0; i < fixedLocations.length; i++ ) {
        stateLocations.push(fixedLocations[i].state)
    }

    // Filtra o array para conter somente um Estado (não contém repetições)
    let states = unique(stateLocations)
    let stateGroup = {}

    for ( let i = 0; i < states.length; i ++ ) {
        geocodeAddress(geocoder, map, fixedLocations[i], 'http://maps.google.com/mapfiles/kml/pal3/icon35.png', infowindow)

        /**
         * Cria o select de localização com OptGroup com base no Estado
         */
        stateGroup = $selectPosition.append(`<optgroup label="${states[i]}">`)

        for ( let j = 0; j < fixedLocations.length; j++ ) {
            if ( states[i] === fixedLocations[j].state ) {
                stateGroup.append(`<option value="${fixedLocations[j].id}">${fixedLocations[j].city}</option>`)
            }
        }
    }

    /**
     * Setar posição após o select
     */
    $selectPosition.change( () => {
        // Limpar e esconder a div com a distância do usuário caso exista
        $mapAddress.empty().hide()

        let $selected = parseInt($('.gmap__buttons--select-position option:selected').val())
        let currentLocation = find(fixedLocations, {'id': $selected})
        if ( $selected > -1 ) {
            let geocodeMarker = geocodeAddress(geocoder, map, currentLocation, 'http://maps.google.com/mapfiles/kml/pal3/icon35.png', infowindow)
            map.setZoom(16)
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
        let service = new google.maps.DistanceMatrixService;
        let destinations = []

        fixedLocations.forEach(function(val, index) {
            destinations.push(val.address)
        });

        service.getDistanceMatrix({
            origins: [{ lat: location.lat, lng: location.lng }],
            destinations: destinations,
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
