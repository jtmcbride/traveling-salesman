/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.connectPoints = undefined;
	
	var _mapPoint = __webpack_require__(1);
	
	var _mapPoint2 = _interopRequireDefault(_mapPoint);
	
	var _traveling_salesman_algorithm = __webpack_require__(2);
	
	var _coords = __webpack_require__(3);
	
	var _coords2 = _interopRequireDefault(_coords);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	$(function () {
	  //canvas setup
	  var canvas = document.getElementById("canvas");
	  var ctx = canvas.getContext("2d");
	
	  var points = [];
	
	  // map setup
	  var map = initMap();
	  var markers = _coords2.default[2].map(function (c) {
	    return new google.maps.Marker({ position: c, map: map });
	  });
	  // markers = stateCoords.map(c => new google.maps.Marker({position: c, map: map}));
	  var pathData = [];
	  var currentPath = void 0;
	
	  // setup tabs
	  $('#route-tab').click(function () {
	    $('#paint').css("display", "none");
	    $('#route').css("display", "block");
	    $(this).addClass("active");
	    $('#paint-tab').removeClass("active");
	  });
	
	  $('#paint-tab').click(function () {
	    $('#route').css("display", "none");
	    $('#paint').css("display", "block");
	    $(this).addClass("active");
	    $('#route-tab').removeClass("active");
	  });
	
	  // add points to the canvas
	  $("#canvas").mousedown(function (e) {
	    var pos = getMousePos(canvas, e);
	    points.push(new _mapPoint2.default(pos.x, pos.y));
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    points.forEach(function (point) {
	      ctx.beginPath();
	      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
	      ctx.stroke();
	      ctx.beginPath();
	    });
	    // ctx.beginPath();
	    // ctx.arc(pos.x,pos.y,10,0,2*Math.PI);
	    // ctx.stroke();
	    // points = algo(points);
	    // connectPoints(ctx, points);
	  });
	
	  // $('#draw').click(() => {
	  //   $('#canvas').hover((evt) => {
	  //     console.log(evt.clientX);
	  //   });
	  //   $('#canvas').mousemove(evt => console.log(evt.clientX))
	  // });
	
	  // toggle display of map markers
	  $("#hide-markers").click(function () {
	    var currentMap = void 0;
	    if (markers[0].map) {
	      currentMap = null;
	    } else {
	      currentMap = map;
	    }
	    markers.forEach(function (mark) {
	      return mark.setMap(currentMap);
	    });
	  });
	
	  // run algorithm for canvas
	  $('#run').click(function () {
	    var routes = (0, _traveling_salesman_algorithm.algo)(points, ctx);
	    // ctx.clearRect(0,0, canvas.width, canvas.height);
	    // for (var i = 0; i < routes.length; i++) {
	    //   setTimeout(connectPoints, i*250, ctx, routes[i])
	    // }
	    // connectPoints(ctx, points);
	    connectPoints(ctx, routes[routes.length - 1]);
	  });
	
	  $('#clear-map').click(function () {
	    markers.forEach(function (mark) {
	      return mark.setMap(null);
	    });
	    markers = [];
	    currentPath ? currentPath.setMap(null) : null;
	  });
	
	  $('#presets').change(function () {
	    markers.forEach(function (mark) {
	      return mark.setMap(null);
	    });
	    if ($(this).val() == 0) {
	      markers = [];
	    } else {
	      markers = _coords2.default[$(this).val()].map(function (c) {
	        return new google.maps.Marker({ position: c, map: map });
	      });
	    }
	    currentPath ? currentPath.setMap(null) : null;
	    if ($(this).val() == 2) {
	      map.setZoom(11);map.setCenter({ lat: 37.75534401310656, lng: -122.4203 });
	    } else {
	      map.setZoom(2);
	    }
	  });
	
	  // run algorithm for points on the map
	  $('#runGoog').click(function () {
	
	    // diasable button until animation is complete
	    if (markers.length > 0) {
	      (function () {
	        $(":input").attr("disabled", true);
	        // $("")
	
	        currentPath ? currentPath.setMap(null) : null;
	        var p = markers.map(function (mark) {
	          return { lat: mark.position.lat(), lng: mark.position.lng() };
	        });
	        markers.forEach(function (mark) {
	          return mark.setMap(null);
	        });
	        p.push({ lat: markers[0].position.lat(), lng: markers[0].position.lng() });
	        var route = new google.maps.Polyline({
	          path: p,
	          geodesic: true,
	          strokeColor: '#FF0000',
	          strokeOpacity: 1.0,
	          strokeWeight: 2
	        });
	        // route.setMap(map);
	        var thePath = route.getPath();
	        var algoAnswer = (0, _traveling_salesman_algorithm.googAlgo)(thePath.getArray(), parseInt($('#display-num-evals').html()));
	        var paths = algoAnswer.routes;
	        var distances = algoAnswer.distances;
	        // console.log(distances[distances.length-1]/ 1609.34);
	
	        var _loop = function _loop(i) {
	          var poly = new google.maps.Polyline({
	            path: paths[i],
	            geodesic: true,
	            strokeColor: '#FF0000',
	            strokeOpacity: 1.0,
	            strokeWeight: 2
	          });
	          setTimeout(function () {
	            poly.setMap(map);setTimeout(function () {
	              poly.setMap(null);
	            }, 250);
	          }, i * 250);
	        };
	
	        for (var i = 0; i < paths.length; i++) {
	          _loop(i);
	        }
	
	        // route.setMap(null);
	        var bestRoute = paths[paths.length - 1];
	        bestRoute.push(bestRoute[0]);
	        var bestPath = new google.maps.Polyline({
	          path: bestRoute,
	          geodesic: true,
	          strokeColor: '#FF0000',
	          strokeOpacity: 1.0,
	          strokeWeight: 2
	        });
	        currentPath = bestPath;
	
	        // set best path onto the map and reenable the button to run again
	        // if ($('#presets').val() == 2) {
	        //   bestPath = new google.maps.Polyline({
	        //     path: coords[2],
	        //     geodesic: true,
	        //     strokeColor: '#FF0000',
	        //     strokeOpacity: 1.0,
	        //     strokeWeight: 2
	        //   });
	        //   currentPath = bestPath;
	        // }
	
	        setTimeout(function () {
	          bestPath.setMap(map);$(":input").attr("disabled", false);
	        }, paths.length * 250);
	      })();
	    }
	  });
	
	  $('#num-evals').change(function () {
	    var scale = (Math.log(100000) - Math.log(100)) / 100;
	    var value = Math.floor(Math.exp(Math.log(100) + scale * $(this).val()) + 1);
	    $('#display-num-evals').html(value);
	  });
	
	  // click listener to add points to the map
	  google.maps.event.addListener(map, 'click', function (event) {
	    var marker = new google.maps.Marker({ position: event.latLng, map: map });
	    markers.push(marker);
	    // let it = ""
	    // markers.forEach(m => it += `{lat: ${m.position.lat()}, lng: ${m.position.lng()}},`)
	    // console.log(it)
	  });
	});
	
	function getMousePos(canvas, evt) {
	  var rect = canvas.getBoundingClientRect();
	  return {
	    x: evt.clientX - rect.left,
	    y: evt.clientY - rect.top
	  };
	}
	
	function initMap() {
	  var geocoder = new window.google.maps.Geocoder();
	
	  var map = new window.google.maps.Map(document.getElementById('map'), {
	    zoom: 10,
	    center: { lat: 37.75334401310656, lng: -122.4203 },
	    scrollwheel: true
	  });
	  return map;
	}
	
	var connectPoints = exports.connectPoints = function connectPoints(context, points) {
	  // context.clearRect(0,0, canvas.width, canvas.height);
	  // context.beginPath();
	  context.fillStyle = randColor();
	  var currPoints = points.slice(0);
	  currPoints.push(points[0]);
	  context.moveTo(currPoints[0].x, currPoints[0].y);
	  for (var i = 1; i < currPoints.length - 1; i++) {
	    var p2 = currPoints[i];
	    context.lineTo(p2.x, p2.y);
	    context.fill();
	  }
	  context.stroke();
	  // context.closePath();
	};
	
	var randHex = function randHex() {
	  return '0123456789ABCDEF'[Math.floor(16 * Math.random())];
	};
	var randColor = function randColor() {
	  return '#' + [1, 2, 3, 4, 5, 6].map(randHex).join('');
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var mapPoint = function mapPoint(x, y) {
	  _classCallCheck(this, mapPoint);
	
	  this.x = x;
	  this.y = y;
	};
	
	exports.default = mapPoint;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var connectPoints = exports.connectPoints = function connectPoints(context, points) {
	  // context.beginPath()
	  for (var i = 0; i < points.length - 1; i++) {
	    var p1 = points[i];
	    var p2 = points[i + 1];
	    context.moveTo(p1.x, p1.y);
	    context.lineTo(p2.x, p2.y);
	    context.stroke();
	  }
	};
	
	var distance = exports.distance = function distance(pointOne, pointTwo) {
	  return Math.sqrt(Math.pow(pointOne.x - pointTwo.x, 2) + Math.pow(pointOne.y - pointTwo.y, 2));
	};
	
	var tourDistance = exports.tourDistance = function tourDistance(tour) {
	  var d = 0;
	  tour.forEach(function (a, i) {
	    if (i < tour.length - 1) {
	      d += distance(a, tour[i + 1]);
	    }
	  });
	  return d + distance(tour[0], tour[tour.length - 1]);
	};
	
	function shuffle(array) {
	  var i = 0,
	      j = 0,
	      temp = null;
	
	  for (i = array.length - 1; i > 0; i -= 1) {
	    j = Math.floor(Math.random() * (i + 1));
	    temp = array[i];
	    array[i] = array[j];
	    array[j] = temp;
	  }
	}
	
	var algo = exports.algo = function algo(tour, context) {
	  var ans = [];
	  var routes = [];
	  shuffle(tour);
	  var nfe = 100000;
	  var temp = 10;
	  var bestD = tourDistance(tour);
	  var bestTour = tour;
	  var prob = void 0;
	  for (var i = 0; i < nfe; i++) {
	    var newTour = bestTour.slice(0);
	    var idxA = Math.floor(Math.random() * tour.length);
	    var idxB = Math.floor(Math.random() * tour.length);
	    var low = Math.min(idxA, idxB);
	    var high = Math.max(idxA, idxB);
	    // let a = newTour[idxA];
	    // let b = newTour[idxB];
	    newTour.splice.apply(newTour, [low, high - low].concat(_toConsumableArray(newTour.slice(low, high).reverse())));
	    // newTour[idxA] = b;
	    // newTour[idxB] = a;
	    var newTourDistance = tourDistance(newTour);
	    if (temp > .001) {
	      prob = Math.min(1, Math.pow(Math.E, (bestD - newTourDistance) / temp));
	    } else {
	      prob = 0;
	    }
	    var rand = Math.random();
	    if (newTourDistance < bestD || rand < prob) {
	      bestTour = newTour;
	      bestD = newTourDistance;
	      ans.push(bestD);
	      if (i % 10 === 0) {
	        // context.clearRect(0,0, 1000, 1000);
	        // connectPoints(context, bestTour);
	        routes.push(bestTour);
	      }
	    }
	    temp = 100 * Math.pow(.95, i);
	  }
	  routes.push(bestTour);
	  return routes;
	};
	
	var googAlgo = exports.googAlgo = function googAlgo(tour, nfe) {
	  var distances = [];
	  var routes = [];
	  shuffle(tour);
	  var count = 0;
	  nfe = 20000;
	  var temp = 10000;
	  var measureTour = tour.slice(0);
	  measureTour.push(measureTour[0]);
	  var bestD = google.maps.geometry.spherical.computeLength(measureTour);
	  var bestTour = tour;
	  var prob = void 0;
	  for (var i = 0; i < nfe; i++) {
	    var newTour = bestTour.slice(0);
	    var idxA = Math.floor(Math.random() * tour.length);
	    var idxB = Math.floor(Math.random() * tour.length);
	    var low = Math.min(idxA, idxB);
	    var high = Math.max(idxA, idxB);
	    newTour.splice.apply(newTour, [low, high - low].concat(_toConsumableArray(newTour.slice(low, high).reverse())));
	    var measureNewTour = newTour.slice(0);
	    measureNewTour.push(measureNewTour[0]);
	    var newTourDistance = google.maps.geometry.spherical.computeLength(measureNewTour);
	    if (temp > .0001) {
	      prob = Math.min(1, Math.pow(Math.E, (bestD - newTourDistance) / temp));
	    } else {
	      prob = 0;
	    }
	    var rand = Math.random();
	    if (rand < prob) {
	      count++;
	    }
	    if ((newTourDistance < bestD || rand < prob) && newTourDistance !== bestD) {
	      // debugger
	      bestTour = newTour;
	      bestD = newTourDistance;
	      distances.push(bestD);
	      if (i % 10 === 0) {
	        routes.push(bestTour);
	      }
	    }
	    temp = 100 * Math.pow(.99, i);
	  }
	  routes.push(bestTour);
	  distances.push(bestD);
	  return { routes: routes, distances: distances };
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  1: [{ lng: -86.279118, lat: 32.361538 }, { lng: -112.073844, lat: 33.448457 }, { lng: -92.331122, lat: 34.736009 }, { lng: -121.468926, lat: 38.555605 }, { lng: -104.984167, lat: 39.7391667 }, { lng: -72.677, lat: 41.767 }, { lng: -75.526755, lat: 39.161921 }, { lng: -84.27277, lat: 30.4518 }, { lng: -84.39, lat: 33.76 }, { lng: -116.237651, lat: 43.613739 }, { lng: -89.650373, lat: 39.783250 }, { lng: -86.147685, lat: 39.790942 }, { lng: -93.620866, lat: 41.590939 }, { lng: -95.69, lat: 39.04 }, { lng: -84.86311, lat: 38.197274 }, { lng: -91.140229, lat: 30.45809 }, { lng: -69.765261, lat: 44.323535 }, { lng: -76.501157, lat: 38.972945 }, { lng: -71.0275, lat: 42.2352 }, { lng: -84.5467, lat: 42.7335 }, { lng: -93.094, lat: 44.95 }, { lng: -90.207, lat: 32.320 }, { lng: -92.189283, lat: 38.572954 }, { lng: -112.027031, lat: 46.595805 }, { lng: -96.675345, lat: 40.809868 }, { lng: -119.753877, lat: 39.160949 }, { lng: -71.549127, lat: 43.220093 }, { lng: -74.756138, lat: 40.221741 }, { lng: -105.964575, lat: 35.667231 }, { lng: -73.781339, lat: 42.659829 }, { lng: -78.638, lat: 35.771 }, { lng: -100.779004, lat: 48.813343 }, { lng: -83.000647, lat: 39.962245 }, { lng: -97.534994, lat: 35.482309 }, { lng: -123.029159, lat: 44.931109 }, { lng: -76.875613, lat: 40.269789 }, { lng: -71.422132, lat: 41.82355 }, { lng: -81.035, lat: 34.000 }, { lng: -100.336378, lat: 44.367966 }, { lng: -86.784, lat: 36.165 }, { lng: -97.75, lat: 30.266667 }, { lng: -111.892622, lat: 40.7547 }, { lng: -72.57194, lat: 44.26639 }, { lng: -77.46, lat: 37.54 }, { lng: -122.893077, lat: 47.042418 }, { lng: -81.633294, lat: 38.349497 }, { lng: -89.384444, lat: 43.074722 }, { lng: -104.802042, lat: 41.145548 }],
	  2: [{ lat: 37.73271097867418, lng: -122.5019359588623 }, { lat: 37.73671309701737, lng: -122.47595608234406 }, { lat: 37.73708507067362, lng: -122.476307451725 }, { lat: 37.73674909454966, lng: -122.47734278440475 }, { lat: 37.73496419582551, lng: -122.4787026643753 }, { lat: 37.736003147730905, lng: -122.4871301651001 }, { lat: 37.739367868068264, lng: -122.45466470718384 }, { lat: 37.75334401310656, lng: -122.44739055633545 }, { lat: 37.76001483659191, lng: -122.44784116744995 }, { lat: 37.76553551464888, lng: -122.43926614522934 }, { lat: 37.75672802323803, lng: -122.47167259454727 }, { lat: 37.77005323286245, lng: -122.46612310409546 }, { lat: 37.77156281398484, lng: -122.46837615966797 }, { lat: 37.768340075380664, lng: -122.49232292175293 }, { lat: 37.77336070185178, lng: -122.5125789642334 }, { lat: 37.778149661831776, lng: -122.51215517520905 }, { lat: 37.780899481998844, lng: -122.51410245895386 }, { lat: 37.787955846550474, lng: -122.50583320856094 }, { lat: 37.78825943894311, lng: -122.49118566513062 }, { lat: 37.79315153932501, lng: -122.48376131057739 }, { lat: 37.803918106204456, lng: -122.46326923370361 }, { lat: 37.806325533231224, lng: -122.43893623352051 }, { lat: 37.75926476740628, lng: -122.42719888687134 }, { lat: 37.80311974353306, lng: -122.41467297077179 }, { lat: 37.79162544225071, lng: -122.39348888397217 }, { lat: 37.77807570952049, lng: -122.38945484161377 }, { lat: 37.79164239905806, lng: -122.43709087371826 }, { lat: 37.79194762092458, lng: -122.42717742919922 }, { lat: 37.80198532630738, lng: -122.43327140808105 }, { lat: 37.800191516510914, lng: -122.43433892726898 }, { lat: 37.74784695747876, lng: -122.49571323394775 }, { lat: 37.74956058961497, lng: -122.4982237815857 }, { lat: 37.76681346596634, lng: -122.45554447174072 }, { lat: 37.76998234456501, lng: -122.44814157485962 }, { lat: 37.77907633793345, lng: -122.41910934448242 }, { lat: 37.777524510117715, lng: -122.4207615852356 }, { lat: 37.77628641647586, lng: -122.42642641067505 }],
	  3: [{ lat: 37.74465712069939, lng: -122.4151611328125 }, { lat: 40.697299008636755, lng: -74.02587890625 }, { lat: 53.35055131839989, lng: -6.2841796875 }, { lat: 48.77791275550184, lng: 2.39501953125 }, { lat: 47.36859434521338, lng: 8.54736328125 }, { lat: 48.13676667969269, lng: 16.3916015625 }, { lat: 45.73685954736049, lng: 16.0400390625 }, { lat: 42.41534611425362, lng: 19.259033203125 }, { lat: 41.77131167976406, lng: 12.392578125 }, { lat: 40.780541431860335, lng: 29.00390625 }, { lat: 55.727110085045986, lng: 37.6171875 }, { lat: 59.866883195210214, lng: 10.810546875 }, { lat: 59.28833169203345, lng: 18.0615234375 }, { lat: 57.715885127745025, lng: 11.97509765625 }, { lat: 27.68352808378776, lng: 85.36376953125 }, { lat: 28.574874047446972, lng: 77.255859375 }, { lat: 47.90161354142077, lng: 106.9189453125 }, { lat: 39.876019419621166, lng: 116.4990234375 }, { lat: 37.47485808497102, lng: 126.9580078125 }, { lat: 35.60371874069731, lng: 139.74609375 }, { lat: -1.4061088354351594, lng: 36.9140625 }, { lat: -33.9433599465788, lng: 18.45703125 }, { lat: 5.222246513227376, lng: -3.955078125 }, { lat: -37.92686760148134, lng: 145.01953125 }, { lat: -37.16031654673676, lng: 174.990234375 }, { lat: 21.125497636606276, lng: 39.814453125 }, { lat: 25.16517336866393, lng: 55.4150390625 }, { lat: 30.031055426540206, lng: 31.2451171875 }, { lat: -17.89511430374914, lng: 31.00341796875 }, { lat: 35.71975793933433, lng: -5.833740234375 }, { lat: 61.14323525084058, lng: -149.8974609375 }, { lat: 19.228176737766262, lng: -98.96484375 }, { lat: 23.039297747769726, lng: -82.3974609375 }, { lat: 4.8282597468669755, lng: -74.00390625 }, { lat: -35.101934057246055, lng: -58.7109375 }, { lat: -33.797408767572485, lng: -70.751953125 }, { lat: -22.958393318086337, lng: -43.1103515625 }]
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map