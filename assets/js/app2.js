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
    var url = "https://data.cityofnewyork.us/resource/inaf-e6a5.json";
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
            var location_address = results[i].location_address;
            var zip_code = results[i].zip_code;
            var name_1 = results[i].name_1;
            var space = $("<br></br>")
            var phone = results[i].phone;

            var service_type = results[i].service_type;
            var website = results[i].website;



            var infowindow = new google.maps.InfoWindow({
                content: location_address + zip_code + phone + service_type + website





            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });

            return marker;
        }
    })

}