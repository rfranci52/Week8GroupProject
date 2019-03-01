var map;
var lat;
var lng;

function initMap() {
    // create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });

    // detect map movement to get new coords
    map.addListener('dragend', function() {
        lat = map.getCenter().lat();
        lng = map.getCenter().lng();
        console.log(`${lat} and ${lng}`)
    });

    service = new google.maps.places.Autocomplete(document.getElementById('input'));
}
