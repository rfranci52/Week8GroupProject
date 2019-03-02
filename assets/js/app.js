var map;
var lat;
var lng;
var place;
var autocomplete;

function initMap() {
    // create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 2.8, lng: -187.3 },
        zoom: 3
    });

    placeMarker({ lat: -34.397, lng: 150.644 }, map);

    // detect map movement to get new coords
    map.addListener('dragend', function () {
        lat = map.getCenter().lat();
        lng = map.getCenter().lng();
        console.log(`${lat} and ${lng}`)
    });

    // creates autocomplete
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('input'));
    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    // handle autcomplete to get coords
    autocomplete.addListener('place_changed', function () {
        place = autocomplete.getPlace();
        map.setCenter(place.geometry.location);
        lat = map.getCenter().lat();
        lng = map.getCenter().lng();
        console.log(`${lat} and ${lng}`)
    });

    // Loop through the results array and place a marker for each
    // set of coordinates.
    window.eqfeed_callback = function (results) {
        for (var i = 0; i < results.features.length; i++) {
            var coords = results.features[i].geometry.coordinates;
            var latLng = new google.maps.LatLng(coords[1], coords[0]);
            placeMarker(latLng);
        }
    }

    var script = document.createElement('script');
    // This example uses a local copy of the GeoJSON stored at
    // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
    script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
    document.getElementsByTagName('head')[0].appendChild(script);
}


//place marker on map
function placeMarker(position) {
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        draggable: false,
    });

    var infowindow = new google.maps.InfoWindow({
        content: "A place!"
      });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    return marker;
}
        
