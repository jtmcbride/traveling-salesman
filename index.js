import mapPoint from './mapPoint'
import {distance, tourDistance, algo, googAlgo } from './traveling_salesman_algorithm'


$(() => {
  let points = [];
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let map = initMap();
  let markers = [];
  let pathData = [];
  $("#canvas").mousedown(e => {
    let pos = getMousePos(canvas, e);
    points.push(new mapPoint(pos.x, pos.y))
    if(points.length > 1 ) {
      // console.log(distance(points[points.length-2], points[points.length-1]));
      // console.log(tourDistance(points));
    }
    ctx.clearRect(0,0, canvas.width, canvas.height);
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x,point.y,10,0,2*Math.PI);
      ctx.stroke();
    });
    // ctx.beginPath();
     // ctx.arc(pos.x,pos.y,10,0,2*Math.PI);
    // ctx.stroke();
    // points = algo(points);
    // connectPoints(ctx, points);
  });
  $('#run').click(() => {
    let routes = algo(points, ctx);
    console.log(points.length);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for (var i = 0; i < routes.length; i++) {
      setTimeout(connectPoints, i*250, ctx, routes[i])
    }
    // connectPoints(ctx, points);

  });
  google.maps.event.addListener(map, 'click', function(event) {
    let marker = new google.maps.Marker({position: event.latLng, map: map});
    markers.push(marker);
    console.log(marker);
    if (markers.length === 40) {
      let p = markers.map(mark => ({lat: mark.position.lat(), lng: mark.position.lng()}));
      let route = new google.maps.Polyline({
        path: p,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      // route.setMap(map);
      let thePath = route.getPath();
      let paths = googAlgo(thePath.getArray());
      console.log(paths);
      debugger
      console.log(google.maps.geometry.spherical.computeLength(thePath));
      for (let i = 0; i < paths.length; i++) {
        let poly = new google.maps.Polyline({
          path: paths[i],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        setTimeout(() => {poly.setMap(map); setTimeout(()=>{poly.setMap(null)}, 250)}, i*250);
      }

      // route.setMap(null);
      let bestRoute = paths[paths.length - 1];
      let bestPath = new google.maps.Polyline({
        path: bestRoute,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      setTimeout(() => bestPath.setMap(map), paths.length * 250);
    }
    
  });

});


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function initMap() {
  console.log("init")
  debugger;
  let geocoder = new window.google.maps.Geocoder();

  let map = new window.google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 37.75334401310656, lng: -122.4203},
    scrollwheel: true
  });
  return map;
}


export const connectPoints = (context, points) => {
  context.clearRect(0,0, canvas.width, canvas.height);
  context.beginPath();
  let currPoints = points.slice(0);
  currPoints.push(points[0]);
  for (let i = 0; i < currPoints.length - 1; i++) {
    let p1 = currPoints[i];
    let p2 = currPoints[i+1];
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x,p2.y);
    context.stroke();
  }
}
