export const connectPoints = (context, points) => {
  // context.beginPath()
  for (let i = 0; i < points.length - 1; i++) {
    let p1 = points[i];
    let p2 = points[i+1];
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x,p2.y);
    context.stroke();
  }
}

export const distance = (pointOne, pointTwo) => {
  return Math.sqrt(Math.pow(pointOne.x - pointTwo.x, 2) + Math.pow(pointOne.y - pointTwo.y, 2))
}


export const tourDistance = (tour) => {
  let d = 0;
  tour.forEach((a, i) => {
    if (i < tour.length  - 1) {
      d += distance(a, tour[i+1]);
    }
  });
  return d + distance(tour[0], tour[tour.length - 1]);
}

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}


export const algo = (tour, context) => {
  let ans = [];
  let routes = [];
  shuffle(tour);
  let nfe = 100000
  let temp = 10
  let bestD = tourDistance(tour);
  let bestTour = tour;
  let prob;
  for (var i = 0; i < nfe; i++) {
    let newTour = bestTour.slice(0);
    let idxA = Math.floor(Math.random() * tour.length);
    let idxB = Math.floor(Math.random() * tour.length);
    let low = Math.min(idxA, idxB)
    let high = Math.max(idxA, idxB)
    // let a = newTour[idxA];
    // let b = newTour[idxB];
    newTour.splice(low, high-low, ...newTour.slice(low,high).reverse());
    // newTour[idxA] = b;
    // newTour[idxB] = a;
    let newTourDistance = tourDistance(newTour);
    if (temp > .001) {
      prob = Math.min(1, Math.pow(Math.E, (bestD - newTourDistance)/temp));
    } else {
      prob = 0;
    }
    let rand = Math.random();
    if (newTourDistance < bestD || rand < prob) {
       bestTour = newTour;
       bestD = newTourDistance;
       ans.push(bestD);
       if ( i % 10 === 0) {
        // context.clearRect(0,0, 1000, 1000);
        // connectPoints(context, bestTour);
        routes.push(bestTour);
      }
    }
    temp = 100 * Math.pow(.95, i);
  }
  routes.push(bestTour);
  return routes;
}

export const googAlgo = (tour, nfe) => {
  let distances = [];
  let routes = [];
  shuffle(tour);
  let count = 0;
  nfe = 20000;
  let temp = 10000;
  let measureTour = tour.slice(0);
  measureTour.push(measureTour[0]);
  let bestD = google.maps.geometry.spherical.computeLength(measureTour);
  let bestTour = tour;
  let prob;
  for (let i = 0; i < nfe; i++) {
    let newTour = bestTour.slice(0);
    let idxA = Math.floor(Math.random() * tour.length);
    let idxB = Math.floor(Math.random() * tour.length);
    let low = Math.min(idxA, idxB)
    let high = Math.max(idxA, idxB)
    newTour.splice(low, high-low, ...newTour.slice(low,high).reverse());
    let measureNewTour = newTour.slice(0);
    measureNewTour.push(measureNewTour[0]);
    let newTourDistance = google.maps.geometry.spherical.computeLength(measureNewTour);
    if (temp > .0001) {
      prob = Math.min(1, Math.pow(Math.E, (bestD - newTourDistance)/temp));
    } else {
      prob = 0;
    }
    let rand = Math.random();
    if (rand < prob) { count++ }
    if ((newTourDistance < bestD || rand < prob) && newTourDistance !== bestD) {
       // debugger
       bestTour = newTour;
       bestD = newTourDistance;
       distances.push(bestD);
       if ( i % 10 === 0) {
        routes.push(bestTour);
      }
    }
    temp = 100 * Math.pow(.99, i);
  }
  routes.push(bestTour);
  distances.push(bestD);
  return {routes, distances};
}
