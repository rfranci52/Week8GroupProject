var map;
var lat;
var lng;
var place;
var autocomplete;

function initMap() {
    // create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.730610,
            lng: -73.935242
        },
        zoom: 13
    });

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



    // call to nyc open data to get list of flu vaccine locations
    var url = "https://data.cityofnewyork.us/resource/8nqg-ia7v.json";
    $.ajax({
        url: url,
        method: "GET"
    }).then(function (results) {
        for (var i = 0; i < results.length; i++) {
            var lat = results[i].latitude;
            var lng = results[i].longitude;
            var latLng = new google.maps.LatLng(lat, lng);
            placeMarker(latLng);
        }




        //place marker on map
        function placeMarker(position) {
            var marker = new google.maps.Marker({
                position: position,
                map: map,
                draggable: false,
            });
            var name_2 = results[i].name_2;
            var name_1 = results[i].name_1;
            var space = $("<br></br>")
            var phone = results[i].phone;
            var street_1 = results[i].street_1;
            var phone = results[i].phone;
            var phone = results[i].phone;



            var infowindow = new google.maps.InfoWindow({
                content: name_2 + name_1 + phone + street_1





            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });

            return marker;
        }
    })

}