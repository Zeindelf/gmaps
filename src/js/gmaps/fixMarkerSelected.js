
export function fixMarkerSelected (infowindow, location) {
    marker.addListener('click', () => {
        let content = `
            <div style="padding: 4px 2px; color: blue;">
                <h3>Fixed Location</h3>
                <p>${location.address}</p>
            </div>
        `

        infowindow.setContent(content)
        infowindow.open(map, fixMarkerSelected)
    })
}
