import mapPoint from './mapPoint'
import {distance, tourDistance, algo } from './traveling_salesman_algorithm'


$(() => {
  let points = [];
  let map = document.getElementById("map");
  let ctx = map.getContext("2d");
  $("#map").mousedown(e => {
    let pos = getMousePos(map, e);
    points.push(new mapPoint(pos.x, pos.y))
    if(points.length > 1 ) {
      // console.log(distance(points[points.length-2], points[points.length-1]));
      // console.log(tourDistance(points));
    }
    ctx.clearRect(0,0, map.width, map.height);
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
    ctx.clearRect(0,0, map.width, map.height);
    for (var i = 0; i < routes.length; i++) {
      setTimeout(connectPoints, i*500, ctx, routes[i])
    }
    // connectPoints(ctx, points);

  });

});


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}


export const connectPoints = (context, points) => {
  context.clearRect(0,0, map.width, map.height);
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