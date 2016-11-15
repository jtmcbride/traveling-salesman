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


export const algo = (tour) => {
  let nfe = 1000
  let bestD = tourDistance(tour);
  for (var i = 0; i < nfe; i++) {
    let newTour = tour.slice(0);
    let idxA = Math.floor(Math.random() * tour.length);
    let idxB = Math.floor(Math.random() * tour.length);
    let a = tour[idxA];
    let b = tour[idxB];
    tour[idxA] = b;
    tour[idxB] = a;
    if (tourDistance(newTour) < bestD) {
      console.log(i)
      return newTour;
    }
  }
  return tour;
}
