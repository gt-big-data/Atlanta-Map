var map;
function initMap() {
  var georgiaTech = {lat: 33.7756, lng: -84.3963};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: georgiaTech,
    mapTypeControlOptions: {
      mapTypeIds: ['styled_map']
    }
  });
  var curr_markers = {};
  var infowindow = new google.maps.InfoWindow();

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
                position: {lat: parseFloat(buses[i].latitude), lng: parseFloat(buses[i].longitude)},
                map: map
          });

          var latitude = parseFloat(buses[i].latitude);
          var longitude = parseFloat(buses[i].longitude);

          var message = '<div><strong>' + buses[i].timepoint
            + '</strong><br>@ ' + buses[i].msg_time + '<br>Route '
            + buses[i].route + '<br>' + '(' + latitude + ' , ' + longitude
            + ')' + '</div>';

          console.log(buses[i]);

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
  xhttp.open("GET", "http://localhost:5000/get_buses", true);
  xhttp.send();


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

  var getDistance = function(start_long, start_lat, end_long, end_lat) {
      // Option 1
      url = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
      url += 'origins=' + start_long + ',' + start_lat + '&destinations='
          + end_long + ',' + end_lat + '&key=' + key;
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





function changeDay() {
  document.getElementById("time-stylesheet").setAttribute("href", "day.css");
  document.getElementById('headerMarta').className = "navbar navbar-expand-sm navbar-light bg-light";
  document.getElementById('navLogo').src = "marta.png";
  var dayMapType = new google.maps.StyledMapType(
    [],
  {name: 'Day Map'});

  map.mapTypes.set('styled_map', dayMapType);
  map.setMapTypeId('styled_map');
}
function changeNight() {
  document.getElementById("time-stylesheet").setAttribute("href", "night.css");
  document.getElementById('headerMarta').className = "navbar navbar-expand-sm navbar-dark bg-dark";
  document.getElementById('navLogo').src = "marta-white.png";
  var nightMapType = new google.maps.StyledMapType(
    [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#263c3f'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#6b9a76'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#2f3948'}]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#17263c'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#515c6d'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#17263c'}]
    }
  ],
  {name: 'Night Map'});

  map.mapTypes.set('styled_map', nightMapType);
  map.setMapTypeId('styled_map');
}
