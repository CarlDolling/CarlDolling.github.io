var COORD_SYSTEM_GPS = 'EPSG:4326';  // gps (long/lat) coord system..
var COORD_SYSTEM_OSM = 'EPSG:3857';  // SphericalMercatorCoords - google and OSM's coord system..

var map;
var baseMapLayer;

let dragID = "";

var lastDropLocation = {};
var lastMarkers;

var lat = 52.5163;
var lon = 13.3789;
var zoomLevel = 15;
    
baseMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

const aerialLayer = new ol.layer.Tile({
  // source: new ol.ImageTile({
  //   attributions: attributions,
  //   url: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=Zst6Hx8uNcuY7nyGRTgu',
  //   tileSize: 512,
  //   maxZoom: 20,
  // }),
  source: new ol.source.XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19
  })
});

function toggleMap(){
  let toggle = document.getElementById("mapToggle");
  if (toggle.checked == true){
    map.addLayer(aerialLayer);
    // map.setLayerIndex(aerialLayer, 0);
    map.removeLayer(baseMapLayer);
  } else {
    map.addLayer(baseMapLayer);
    // map.setLayerIndex(baseMapLayer, 0);
    map.removeLayer(aerialLayer);
  }
  
}

map = new ol.Map({
    target: 'map',
    layers: [baseMapLayer],
    view: new ol.View({
        center: ol.proj.fromLonLat([lon, lat]),
        zoom: zoomLevel //Initial Zoom Level
    })
});

//addInteraction();


// var draw = new ol.interaction.Draw({
//   source: new ol.source.OSM(),
    
//   type: 'Box'
// });
// map.addInteraction(draw);  




function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  dragID = ev.srcElement.id;
}

function drop(ev) {
  ev.preventDefault();

  lastDropLocation["x"] = ev.pageX;
    lastDropLocation["y"] = ev.pageY;

    var pixel = [ev.pageX, ev.pageY];
    var point = map.getCoordinateFromPixel(pixel);
    var pointArray = ol.proj.transform(point, 'EPSG:3857', 'EPSG:4326')

   

    // var mousePositionControl = new ol.control.MousePosition({
    //     coordinateFormat: function(coord) {return ol.coordinate.format(coord, template, 2);},
    //     projection: 'EPSG:4326',   
    //     undefinedHTML: '&nbsp;'
    //     });

        

  var lon = pointArray[0];
  var lat = pointArray[1];
  var marker = new ol.Feature({
      geometry: new ol.geom.Point(
      ol.proj.fromLonLat([lon, lat])
      ),
  });

  
  
  let marker_icon = "";
  switch(dragID){
    case "drag1": marker_icon = "marker_icons/person.png"; break;
    case "drag2": marker_icon = "marker_icons/shield.png"; break;
    case "drag3": marker_icon = "marker_icons/skull.png"; break;
    case "drag4": marker_icon = "marker_icons/flame.png"; break;
    case "drag5": marker_icon = "marker_icons/paw.png"; break;
    case "drag6": marker_icon = "marker_icons/bug.png"; break;
    case "drag7": marker_icon = "marker_icons/dice.png"; break;
    case "drag8": marker_icon = "marker_icons/fish.png"; break;
    case "drag9": marker_icon = "marker_icons/hand.png"; break;
    case "drag10": marker_icon = "marker_icons/heart.png"; break;
    case "drag11": marker_icon = "marker_icons/moon.png" ; break;
    case "drag12": marker_icon = "marker_icons/people.png"; break;
    case "drag13": marker_icon = "marker_icons/sad.png"; break;
    case "drag14": marker_icon = "marker_icons/star.png"; break;
  }

  marker.setStyle(new ol.style.Style({
    image: new ol.style.Icon( ({
      src: marker_icon
    }))
  }));

  var vectorSource = new ol.source.Vector({
    features: [marker]
  });

  var markerVectorLayer = new ol.layer.Vector({
    source: vectorSource,
  });
  markerVectorLayer.setZIndex(1000);

  map.addLayer(markerVectorLayer);
  //map.setLayerIndex(markerVectorLayer, 99);

  var translate1 = new ol.interaction.Translate({
    features: new ol.Collection([marker])
  });

  map.addInteraction(translate1);


//   map.on('singleclick', function (evt) {
//     console.log(evt.coordinate);
//   });

}

let lastMapPosition;
let secondlastMapPosition;
let dragging = false;
let activeDragging = false;
let lastActiveDragging = false;

let dragStartPoint;

const distancett = document.getElementById("distancett");

function distanceTooltip(e){
  if(!dragging && lastMapPosition == secondlastMapPosition && lastMapPosition == map.getView().getCenter()){
    //console.log("dragging started")
    dragging = true
    activeDragging = true;
    distancett.setAttribute("style", "visibility: visible");
    dragStartPoint = e.coordinate;
  }
  if(dragging){
    lastActiveDragging = activeDragging;
    activeDragging = true;
    
    let distance = Math.round(Math.sqrt(Math.pow(Math.abs(dragStartPoint[0] - e.coordinate[0]),2) + Math.pow(Math.abs(dragStartPoint[1] - e.coordinate[1]),2))/2.65) * 5;
    //console.log(distance)
    distancett.innerHTML = distance + "ft";
  }

  secondlastMapPosition = lastMapPosition;
  lastMapPosition = map.getView().getCenter();
}

map.on('pointerdrag', distanceTooltip)

function dragEnd(){
  if(dragging){
    if(lastActiveDragging == false){
      if(activeDragging == false){
        //console.log("dragend")
        dragging = false;
        distancett.setAttribute("style", "visibility: hidden");
        lastMapPosition = 0;
      }
      activeDragging = false;
    }
    lastActiveDragging = false;
  }
  
}

map.on('pointermove', dragEnd)