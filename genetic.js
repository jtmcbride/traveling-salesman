const googAlgo = (tour, points) => {
  let distances = [];
  let routes = [];
  shuffle(tour);
  let nfe = 10000
  let temp = 10
  let measureTour = tour.slice(0);
  measureTour.push(measureTour[0]);
  let bestD = google.maps.geometry.spherical.computeLength(measureTour.map(p => points[p]));
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
    if (temp > .001) {
      prob = Math.min(1, Math.pow(Math.E, (bestD - newTourDistance)/temp));
    } else {
      prob = 0;
    }
    let rand = Math.random();
    if (newTourDistance < bestD || rand < prob) {
       bestTour = newTour;
       bestD = newTourDistance;
       distances.push(bestD);
       if ( i % 10 === 0) {
        routes.push(bestTour);
      }
    }
    temp = 100 * Math.pow(.95, i);
  }
  routes.push(bestTour);
  distances.push(bestD);
  return {routes, distances};
}
