
//1. initMap() executes to display map without markers
//2. getOpenData() synchronously runs
    //*waits 9.5 seconds for JSON response (cut down on this apparent load time by storing JSON locally or adding UX features), traverses and selects object properties from the JSON file, and then stores arrays in openData object
//3. makeJSON() is called after getOpenData finishes execution. Builds array of JSON API urls to be utilzied by renderButtons() and placeMarker()
    //*var jsonURL is populated with an array of JSON URLs
//4. renderButtons() executes, getting data from openData.titles and rendering into front-end buttons/checkboxes
//5. clicking button/checkbox executes placeMarker() function
//6 placeMarker() function executes, placing markers using lat/lng data from selectedAPI


var map;
var lat;
var lng;
var place;
var autocomplete;
var jsonURL = ["https://data.cityofnewyork.us/api/views/72ss-25qh/rows.json"];

var openData = {
    items: [],
    theme: [],
    title: [],
    description: [],
    identifier: [],
    landingPage: [],
    dateModified: [],
}


getOpenData();
renderButtons();


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
                openData.items.push(element);
                openData.theme.push(element.theme);
                openData.title.push(element.title);
                openData.description.push(element.description);
                openData.identifier.push(element.identifier);
                openData.landingPage.push(element.landingPage);
                openData.dateModified.push(element.modified);
            }
        })
        console.log(openData.items);
        console.log(openData.theme);
        console.log(openData.title);
        console.log(openData.description);
        console.log(openData.identifier);
        console.log(openData.landingPage);
        console.log(openData.dateModified);
    })
    
}

//make usable JSON string from OpenData -- possibly fire to click button?
function makeJSON() {
    var str1 = [];
    for (i = 0; i < openData.identifier.length; i++) {
        str1.push(openData.identifier[i]);
        var res = str1[i].slice(40) + ".json";
        console.log(res);
        var str2 = "https://data.cityofnewyork.us/resource/"
        jsonURL.push(str2.concat(res));
        console.log(jsonURL);
    }
 
}

function renderButtons() {
    $("#selectAPI").empty();
    for (var i = 0; i < openData.title.length; i++) {
        var button = $("<button>");
        button.addClass("api");
        button.attr("data-name", openData.title[i]);
        button.text(openData.title[i]);
        $("#selectAPI").append(button);
    }

}

function initMap(callback) {
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


