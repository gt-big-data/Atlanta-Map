var map;
var markers = [];

function initMap() {
    populateDropDown();
    var georgiaTech = {
        lat: 33.7756,
        lng: -84.3963
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: georgiaTech
    });

    var curr_markers = {};
    var infowindow = new google.maps.InfoWindow();

    //need this variable in order for geojsons to work correctly
    var features = null;
    var enabled = false;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var buses = JSON.parse(this.responseText);
            var new_markers = {};
            for (var i = 0; i < buses.length; i++) {
                var busID = parseInt(buses[i].vehicle);
                if (busID in curr_markers) {
                    new_markers[busID] = curr_markers[busID];
                    new_markers[busID].setPosition(new google.maps.LatLng(buses[i].latitude, buses[i].longitude));
                    delete curr_markers[busID];
                } else {
                    var marker = new google.maps.Marker({
                        position: {
                            lat: parseFloat(buses[i].latitude),
                            lng: parseFloat(buses[i].longitude)
                        },
                        map: map,
                        icon: "imgs/BusIcon.svg"
                    });
                    markers.push(marker);

                    //each marker has a listener
                    marker.addListener('click', function() {
                        if (features != null) {
                            for (var i = 0; i < features.length; i++)
                                map.data.remove(features[i]);
                        }


                        //Replace the url below with the database call
                        //I think you'll have to format the url string yourself using the marker's position data
                        if (enabled) {
                            $.getJSON('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/atlanta.geojson', function(data) {
                                features = map.data.addGeoJson(data);
                            });
                        }
                    });

                    var latitude = parseFloat(buses[i].latitude);
                    var longitude = parseFloat(buses[i].longitude);

                    var messageColor = parseInt(buses[i].adherence) < 0 ? '236, 37, 39' : '105,189,71';
                    var message = '<div><strong>' + buses[i].timepoint +
                        '</strong><br>@ ' + buses[i].msg_time + '<br>Route ' +
                        buses[i].route + '<br>' + '(' + latitude + ' , ' + longitude +
                        ')' + '<br><br>' +
                        '<svg height="12" width="200">' +
                        '<line x1="0" y1="0" x2="200" y2="0" style=' +
                        '"stroke:rgb(' + messageColor + ');stroke-width:10" />' +
                        '</svg>' +
                        '</div>';

                    attachInfo(marker, message);

                    new_markers[busID] = marker;
                }
                delete curr_markers[busID];
            }

            var remove_list = Object.keys(curr_markers);
            for (var i = 0; i < remove_list.length; i++) {
                curr_markers[remove_list[i]].setMap(null);
                delete curr_markers[remove_list[i]];
            }
            curr_markers = new_markers;
        }
    };

    //added remove button in case the user doens't want to see any geojsons displayed
    google.maps.event.addDomListener(document.getElementById('removeBtn'), 'click', function() {
        if (features != null) {
            for (var i = 0; i < features.length; i++)
                map.data.remove(features[i]);
        }
    });

    google.maps.event.addDomListener(document.getElementById('enable'), 'click', function() {
        enabled = !enabled;
    });

    map.data.setStyle({
        icon: 'atlanta.json',
        strokeColor: '#ffa500',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ffa500',
        fillOpacity: 0.35
    });

    xhttp.open("GET", "http://localhost:5000/get_buses", true);
    xhttp.send();

    var colors = ['#ec2527', '#ffa500', '#0093d0', '#69bd47'];

    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var incidents = JSON.parse(this.responseText);
            var arr = JSON.parse(this.responseText);
            var list = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].shape_pt_sequence == 1) {
                    var flightPath = new google.maps.Polyline({
                        path: list,
                        geodesic: true,
                        strokeColor: colors[Math.floor(Math.random() * 4)],
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    flightPath.setMap(map);
                    list = [];
                } else {
                    list.push({
                        lat: arr[i].shape_pt_lat,
                        lng: arr[i].shape_pt_lon
                    });
                }
            }
        }
    };
    xhttp2.open("GET", "data/routes.json", true);
    xhttp2.send();
    var ajax_call = function() {
        xhttp.open("GET", "http://localhost:5000/get_buses", true);
        xhttp.send();
    };

    var attachInfo = function(marker, info) {
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(info);
            infowindow.open(map, marker);
        });
    };

    //not sure what this does
    var getDistance = function(start_long, start_lat, end_long, end_lat) {
        // Option 1
        url = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
        url += 'origins=' + start_long + ',' + start_lat + '&destinations=' +
            end_long + ',' + end_lat + '&key=' + 'AIzaSyBpWRyIAxW2rc8HgZssAWARXef2c7qEGgU';
        r = requests.get(url);
        js = r.json();

        //Option 2
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: start,
            destinations: end,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }, callback);
        // Call Back not implemented yet
    }
    getDistance(40, 70, 90, 100);

    var interval = 1000 * 60 * 1; // where X is your every X minutes
    setInterval(ajax_call, interval);
};

function populateDropDown() {
    var dropdown = document.getElementById("dropdown");
    var i;
    for (i = 1; i < 14; i++) {
        var option = document.createElement('a');
        option.setAttribute('class', 'dropdown-item');
        option.setAttribute('href', '#');
        option.innerText = 'Route ' + i;
        dropdown.appendChild(option);
    }
}

function changeDay() {
    document.getElementById("time-stylesheet").setAttribute("href", "css/day.css");
    document.getElementById('headerMarta').className = "navbar navbar-expand-sm navbar-light bg-light";
    document.getElementById('navLogo').src = "imgs/marta.png";
    var dayMapType = new google.maps.StyledMapType(
        [], {
            name: 'Day Map'
        });
    markers.forEach(marker => marker.setIcon("imgs/BusIcon.svg"));
    map.mapTypes.set('styled_map', dayMapType);
    map.setMapTypeId('styled_map');
}

function changeNight() {
    document.getElementById("time-stylesheet").setAttribute("href", "css/night.css");
    document.getElementById('headerMarta').className = "navbar navbar-expand-sm navbar-dark bg-dark";
    document.getElementById('navLogo').src = "imgs/marta-white.png";
    var nightMapType = new google.maps.StyledMapType(
        [{
                elementType: 'geometry',
                stylers: [{
                    color: '#242f3e'
                }]
            },
            {
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#242f3e'
                }]
            },
            {
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#746855'
                }]
            },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{
                    color: '#263c3f'
                }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#6b9a76'
                }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{
                    color: '#38414e'
                }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#212a37'
                }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#9ca5b3'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{
                    color: '#746855'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#1f2835'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#f3d19c'
                }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{
                    color: '#2f3948'
                }]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{
                    color: '#17263c'
                }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#515c6d'
                }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#17263c'
                }]
            }
        ], {
            name: 'Night Map'
        });

    markers.forEach(marker => marker.setIcon("imgs/BusIcon-white.png"));

    map.mapTypes.set('styled_map', nightMapType);
    map.setMapTypeId('styled_map');
}
