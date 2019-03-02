var map;
var lat;
var lng;
var place;
var autocomplete;

function initMap() {
    // create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
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




        // var url = "https://api.nasa.gov/planetary/earth/imagery/?lon=" + log +
        //     "&lat=40.826562&date=2017-2-02&cloud_score=True&dim=0.5&api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo";
        // var url = "https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo";

        // var log = $("#nasaSubmit").val().trim();

        var long = $("#nasaSubmit").on("click", function () {
            var log = $("nasaform").val();
            console.log(log)

            console.log(url)
            // log = $(log)



            var url =

                "https://api.nasa.gov/planetary/earth/imagery/?lon=" + lng +
                "&lat=" + lat + "&date=2017-2-02&cloud_score=True&dim=0.025&api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo";

            console.log("https://api.nasa.gov/planetary/earth/imagery/?lon=" + lng +
                "&lat=" + lat + "&date=2017-2-02&cloud_score=True&dim=0.5&api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo")











            $.ajax({
                url: url,
                success: function (result) {
                    if ("copyright" in result) {
                        $("#copyright").text("Image Credits: " + result.copyright);
                    } else {
                        $("#copyright").text("Image Credits: " + "Public Domain");
                    }

                    if (result.media_type == "video") {
                        $("#apod_img_id").css("display", "none");
                        $("#apod_vid_id").attr("src", result.url);
                    } else {
                        $("#apod_vid_id").css("display", "none");
                        $("#apod_img_id").attr("src", result.url);
                    }
                    $("#reqObject").text(url);
                    $("#returnObject").text(JSON.stringify(result, null, 4));
                    $("#apod_explaination").text(result.explanation);
                    $("#apod_title").text(result.title);
                }
            })



        });
    })
}
// })
// });