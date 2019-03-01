
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCAKCN7ddltoY8oeKcqsWH47oKxKM-Ck1w",
    authDomain: "week8groupproject.firebaseapp.com",
    databaseURL: "https://week8groupproject.firebaseio.com",
    projectId: "week8groupproject",
    storageBucket: "week8groupproject.appspot.com",
    messagingSenderId: "724198662406"
};
firebase.initializeApp(config);


//=======marker tracking with GeoFirebase=========
//Create a node at firebase location to add locations as child keys
var locationsRef = firebase.database().ref("locations");

// Create a new GeoFire key under users Firebase location
var geoFire = new GeoFire(locationsRef.push());

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
var lat, lng;


//--------------------------------------------------------

/**
 * Data object to be written to Firebase.
*/
var data = {
    sender: null,
    timestamp: null,
    lat: null,
    lng: null,
  
};

function makeInfoBox(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '2px';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginTop = '10px';
    controlUI.style.textAlign = 'center';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.padding = '6px';
    controlText.textContent = 'Display some text';
    controlUI.appendChild(controlText);
}

/**
 * Starting point for running the program. Authenticates the user.
* @param {function()} onAuthSuccess - Called when authentication succeeds.
*/
function initAuthentication(onAuthSuccess) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            data.sender = user.uid;
            onAuthSuccess();
        } else {
            // User is signed out.
            console.log('Logout...');
        }
    });
}

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.730610, lng: -73.935242 },
        zoom: 10,
        mapTypeId: 'satellite',
        styles: [{
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]  // Turn off POI.
        },
        {
            featureType: 'transit.station',
            stylers: [{ visibility: 'off' }]  // Turn off bus, train stations etc.
        }],
        disableDoubleClickZoom: true,
        streetViewControl: false,
    });

    //add marker to map 
    map.addListener('click', function (e) {
        placeMarker(e.latLng, map);
    });

    function placeMarker(position, map) {
        var marker = new google.maps.Marker({
            position: position,
            map: map
        });
        // map.panTo(position);
       
        
    }

    

    //   // Listen for markers and add the location of the marker to firebase.
    //   map.addListener('click', function (e) {
    //     data.lat = e.latLng.lat();
    //     data.lng = e.latLng.lng();
    //     data.marker.
    //     addToFirebase(data);
    // });


    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            var pos = { lat: lat, lng: lng };
            _setGeoFire();
            var locationsRef = firebase.database().ref("locations");
            locationsRef.on('child_added', function (snapshot) {
                var bounds = new google.maps.LatLngBounds(); // declaration 
                var data = snapshot.val();
                var marker = new google.maps.Marker({
                    position: {
                        lat: data.User.l[0],
                        lng: data.User.l[1]
                    },
                    map: map,


                });
                bounds.extend(marker.getPosition());
                marker.addListener('click', (function (data) {
                    return function (e) {
                        infoWindow.setContent(data.name + "<br>" + this.getPosition().toUrlValue(6) + "<br>" + data.message);
                        infoWindow.open(map, this);
                    }
                }(data)));
                map.fitBounds(bounds);
            });

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function _setGeoFire() {
        geoFire.set("User", [lat, lng]).then(function () {
            console.log("Location added");
        }).catch(function (error) {
            console.log(error);
        });
    }



    // Create the DIV to hold the control and call the makeInfoBox() constructor
    // passing in this DIV.
    var infoBoxDiv = document.createElement('div');
    makeInfoBox(infoBoxDiv, map);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);

    // Listen for clicks and add the location of the click to firebase.
    map.addListener('click', function (e) {
        data.lat = e.latLng.lat();
        data.lng = e.latLng.lng();
        addToFirebase(data);
    });
}


/**
 * Updates the last_message/ path with the current timestamp.
 * @param {function(Date)} addClick After the last message timestamp has been updated,
 *     this function is called with the current timestamp to add the
 *     click to the firebase.
 */
function getTimestamp(addClick) {

    var ref = firebase.database().ref('last_message/' + data.sender);

    ref.onDisconnect().remove();  // Delete reference from firebase on disconnect.

    ref.set(firebase.database.ServerValue.TIMESTAMP, function (err) {
        if (err) {  // Write to last message was unsuccessful.
            console.log(err);
        } else {  // Write to last message was successful.
            ref.once('value', function (snap) {
                addClick(snap.val());  // Add click with same timestamp.
            }, function (err) {
                console.warn(err);
            });
        }
    });
}

/**
 * Adds a click to firebase.
 * @param {Object} data The data to be added to firebase.
 *     It contains the lat, lng, sender and timestamp.
 */
function addToFirebase(data) {
    getTimestamp(function (timestamp) {
        // Add the new timestamp to the record data.
        data.timestamp = timestamp;
        /* firebase 2.3.2
        var ref = firebase.child('clicks').push(data, function(err) {
        if (err) {  // Data was not written to firebase.
            console.warn(err);
        }
        });
        */
        firebase.database().ref('clicks').push(data, function (err) {
            if (err) {  // Data was not written to firebase.
                console.warn(err);
            }
        });
    });
}
