import mapPoint from './mapPoint';
import {distance, tourDistance, algo, googAlgo } from './traveling_salesman_algorithm';
import { stateCoords} from './coords.js';


$(() => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  let points = [];

  let map = initMap();
  let markers = [];
  markers = stateCoords.map(c => new google.maps.Marker({position: c, map: map}));
  let pathData = [];
  let currentPath;

  $("#canvas").mousedown(e => {
    let pos = getMousePos(canvas, e);
    points.push(new mapPoint(pos.x, pos.y))
    ctx.clearRect(0,0, canvas.width, canvas.height);
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x,point.y,2,0,2*Math.PI);
      ctx.stroke();
      ctx.beginPath();
    });
    // ctx.beginPath();
     // ctx.arc(pos.x,pos.y,10,0,2*Math.PI);
    // ctx.stroke();
    // points = algo(points);
    // connectPoints(ctx, points);
  });

  $("#hide-markers").click(function () {
    let currentMap;
    if (markers[0].map) {
      currentMap = null;
      $(this).html("Show Markers");
    } else {
      currentMap = map;
      $(this).html("Hide Markers");
    }
    markers.forEach(mark => mark.setMap(currentMap));
  });

  $('#run').click(() => {
    let routes = algo(points, ctx);
    // ctx.clearRect(0,0, canvas.width, canvas.height);
    // for (var i = 0; i < routes.length; i++) {
    //   setTimeout(connectPoints, i*250, ctx, routes[i])
    // }
    // connectPoints(ctx, points);
    connectPoints(ctx, routes[routes.length-1]);
  });

  $('#clear-map').click(() => {
    markers.forEach(mark => mark.setMap(null));
    markers = [];
    currentPath.setMap(null);
  });

  $('#runGoog').click(function () {
    $(this).attr("disabled", true);
    currentPath ? currentPath.setMap(null) : null;
    let p = markers.map(mark => ({lat: mark.position.lat(), lng: mark.position.lng()}));
    p.push({lat: markers[0].position.lat(), lng: markers[0].position.lng()})
    let route = new google.maps.Polyline({
      path: p,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    // route.setMap(map);
    let thePath = route.getPath();
    let algoAnswer = googAlgo(thePath.getArray());
    let paths = algoAnswer.routes;
    let distances = algoAnswer.distances;
    console.log(distances[distances.length-1]/ 1609.34);

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
    bestRoute.push(bestRoute[0]);
    let bestPath = new google.maps.Polyline({
      path: bestRoute,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    currentPath = bestPath;
    setTimeout(() => {bestPath.setMap(map);$(this).attr("disabled", false);}, paths.length * 250);
  });

  google.maps.event.addListener(map, 'click', function(event) {
    let marker = new google.maps.Marker({position: event.latLng, map: map});
    markers.push(marker);
    // if (markers.length === 48000) {
    //   let p = markers.map(mark => ({lat: mark.position.lat(), lng: mark.position.lng()}));
    //   p.push({lat: markers[0].position.lat(), lng: markers[0].position.lng()})
    //   let route = new google.maps.Polyline({
    //     path: p,
    //     geodesic: true,
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2
    //   });
    //   // route.setMap(map);
    //   let thePath = route.getPath();
    //   let paths = googAlgo(thePath.getArray());
    //   for (let i = 0; i < paths.length; i++) {
    //     let poly = new google.maps.Polyline({
    //       path: paths[i],
    //       geodesic: true,
    //       strokeColor: '#FF0000',
    //       strokeOpacity: 1.0,
    //       strokeWeight: 2
    //     });
    //     setTimeout(() => {poly.setMap(map); setTimeout(()=>{poly.setMap(null)}, 250)}, i*250);
    //   }

    //   // route.setMap(null);
    //   let bestRoute = paths[paths.length - 1];
    //   let bestPath = new google.maps.Polyline({
    //     path: bestRoute,
    //     geodesic: true,
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2
    //   });
    //   setTimeout(() => bestPath.setMap(map), paths.length * 250);
    // }
    
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
  let geocoder = new window.google.maps.Geocoder();

  let map = new window.google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 37.75334401310656, lng: -122.4203},
    scrollwheel: true
  });
  return map;
}


export const connectPoints = (context, points) => {
  // context.clearRect(0,0, canvas.width, canvas.height);
  // context.beginPath();
  context.fillStyle = randColor();
  let currPoints = points.slice(0);
  currPoints.push(points[0]);
  context.moveTo(currPoints[0].x, currPoints[0].y);
  for (let i = 1; i < currPoints.length - 1; i++) {
    let p2 = currPoints[i];
    context.lineTo(p2.x,p2.y);
    context.fill();
  }
  context.stroke();
  // context.closePath();

}


const randHex = () => '0123456789ABCDEF'[Math.floor(16*Math.random())];
const randColor = () => `#${[1,2,3,4,5,6].map(randHex).join('')}`
