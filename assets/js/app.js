var map;
var lat;
var lng;
var place;
var autocomplete;

function initMap() {
    // create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });

    placeMarker({lat: -34.397, lng: 150.644}, map);

    // detect map movement to get new coords
    map.addListener('dragend', function() {
        lat = map.getCenter().lat();
        lng = map.getCenter().lng();
        console.log(`${lat} and ${lng}`)
    });

    // creates autocomplete
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('input'));
    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    // handle autcomplete to get coords
    autocomplete.addListener('place_changed', function() {
        place = autocomplete.getPlace();
        map.setCenter(place.geometry.location);
        lat = map.getCenter().lat();
        lng = map.getCenter().lng();
        console.log(`${lat} and ${lng}`)
    });

     //add marker to map 
     map.addListener('dblclick', function (e) {
        placeMarker(e.latLng);        
    });

    //place marker on map
    function placeMarker(position) {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            draggable: false
        });
    
    }

   
}
