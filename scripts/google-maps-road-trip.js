		var directionsDisplay;  
		var directionsService = new google.maps.DirectionsService();  
		var map;  
    $('#map-canvas').height(300);

function initialize() {  
  directionsDisplay = new google.maps.DirectionsRenderer();  
  var iran = new google.maps.LatLng(35.727911, 51.424255);  
  var mapOptions = {  
    zoom:1,  
    mapTypeId: google.maps.MapTypeId.ROADMAP,  
    center: iran
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);  
  directionsDisplay.setMap(map);  
  calcRoute();
}  
  
function calcRoute() {  
  var start = new google.maps.LatLng(51.520560, 0);  
  var end = new google.maps.LatLng(-8.497190, 140.395918);  
  var request = {  
      origin:start,  
      destination:end,  
      travelMode: google.maps.DirectionsTravelMode.DRIVING  
  };  
  directionsService.route(request, function(response, status) {  
    if (status == google.maps.DirectionsStatus.OK) {  
      directionsDisplay.setDirections(response);  
    }  
  });  
}  
  
setTimeout(function(){
  initialize();
}, 2000);