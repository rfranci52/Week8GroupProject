var map;
var lat;
var lng;
var place;
var autocomplete;
// var healthTheme = [];


var items = [];
var healthTheme = [];
var healthDescription = [];
var distributionArr = [];
var healthIdentifier = [];
var healthLandingPage = [];
var healthDateModified = [];


getOpenData();

function getOpenData() {
    //JSON response for all APIs with "Health" theme
    var url = "https://data.cityofnewyork.us/data.json";
    $.ajax({
        url: url,
        method: "GET"
    }).then(function (response) {
        var dataArr = response.dataset;
        dataArr.forEach(function (element) {
            if (element.theme == 'Health') {
                items.push(element)
                healthTheme.push(element.theme);
                healthDescription.push(element.description);
                distributionArr.push(element.distribution[2]);
                healthIdentifier.push(element.identifier);
                healthLandingPage.push(element.landingPage)
                healthDateModified.push(element.modified)
            }
        })
        console.log(items);
        console.log(healthTheme);
        console.log(healthDescription);
        console.log(distributionArr);
        console.log(healthIdentifier);
        console.log(healthLandingPage);
        console.log(healthDateModified);
    })
    makeJSON();
}

//make usable JSON string from OpenData
function makeJSON(){
    var str1 = "https://data.cityofnewyork.us/api/views/rsgh-akpg";
    var res = str1.slice(40) + ".json";
    console.log(res);
    var str2 = "https://data.cityofnewyork.us/resource/"
    var concatStr = str2.concat(res);
    console.log(concatStr);
}

function initMap() {
    // create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.730610, lng: -73.935242 },
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
            // if (results[i].city === "Brooklyn") {
                // console.log(results[i]);
                // console.log(results[i].name_1, results[i].city)
                var lat = results[i].latitude;
                var lng = results[i].longitude;
                var latLng = new google.maps.LatLng(lat, lng);
                placeMarker(latLng);
            // }
        }
    })
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

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    return marker;
}

