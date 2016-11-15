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
      console.log(distance(points[points.length-2], points[points.length-1]));
      console.log(tourDistance(points));
    }
    ctx.clearRect(0,0, map.width, map.height);
    ctx.beginPath();
    ctx.arc(pos.x,pos.y,10,0,2*Math.PI);
    ctx.stroke();
    points = algo(points);
    connectPoints(ctx, points);
  });
});


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}


function connectPoints(context, points) {
  for (let i = 0; i < points.length - 1; i++) {
    let p1 = points[i]
    let p2 = points[i+1]
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x,p2.y);
    context.stroke();
  }
}