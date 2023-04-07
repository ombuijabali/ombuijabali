import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import LayerGroup from 'ol/layer/Group';
import XYZ from 'ol/source/XYZ';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import Control from 'ol/control/Control';
import FullScreen from 'ol/control/FullScreen';
import ZoomIn from 'ol/control/ZoomIn';
import ZoomOut from 'ol/control/ZoomOut';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';

if (navigator.userAgentData) {
    let browserName = navigator.userAgentData.getHighEntropyValues(['name', 'version']).name;
    let browserVersion = navigator.userAgentData.getHighEntropyValues(['name', 'version']).version;
    console.log(`You are using ${browserName} version ${browserVersion}`);
} else {
    console.log('Browser version detection not supported');
}

// Define the OpenStreetMap layer
let osmLayer = new TileLayer({
    source: new OSM(),
});

// Define the first layer source...urban
let layerSource1 = new TileWMS({
    url: 'http://localhost:8080/geoserver/Kakamega_Parcels/wms',
    params: { 'LAYERS': 'kakamega_parcels:core_urban', 'TILED': true },
    serverType: 'geoserver'
});

// Define the first layer
let coreUrban = new TileLayer({
    source: layerSource1
});

// Define the second layer source..towns
let layerSource2 = new TileWMS({
    url: 'http://localhost:8080/geoserver/Kakamega_Parcels/wms',
    params: { 'LAYERS': 'kakamega_parcels:old_town', 'TILED': true },
    serverType: 'geoserver'
});

// Define the second layer
let oldTown = new TileLayer({
    source: layerSource2
});

// Define the tile layer with OpenAerialMap as the source
let satelliteLayer = new TileLayer({
    source: new XYZ({
        url: 'https://tile.openaerialmap.org/{z}/{x}/{y}.jpg',
        attributions: [
            OSM.ATTRIBUTION,
            'Imagery © <a href="https://www.openaerialmap.org">OpenAerialMap</a>'
        ]
    }),
    zIndex: 0 // Set the z-index to 0 to display this layer behind other layers
});

// Create the LayerSwitcher control
let layerSwitcher = new LayerSwitcher({
    tipLabel: 'Layers' // Set the tooltip label for the LayerSwitcher button
});

// Define the map
let map = new Map({
    target: 'map',
    layers: [
        osmLayer,
        satelliteLayer,
        new LayerGroup({
            title: 'Kakamega Layers',
            layers: [coreUrban, oldTown]
        })
    ],
    controls: defaultControls().extend([layerSwitcher]),
    view: new View({
        center: fromLonLat([34.75, 0.28]),
        zoom: 12
    }),
    interactions: defaultInteractions({
        shiftDragZoom: false
    })
});

// Home Control
let homeControl = new Control({
    element: document.createElement('button'),
    title: 'Zoom to home',
    className: 'home-control',
});

homeControl.element.addEventListener('click', function () {
    map.getView().animate({
        center: fromLonLat([34.75, 0.2833]), //set to Kakamega as Home
        zoom: 14,
        duration: 1000
    });
});

// Add home control to map
map.addControl(homeControl);



//FullScreen Control
let fullScreenControl = new ol.control.FullScreen({
    tipLabel: 'Toggle full-screen',
    label: '⤢'
});
map.addControl(fullScreenControl);


// ZoomIn Control
let zoomInControl = new ZoomIn({
    className: 'custom-zoom-in',
    tipLabel: 'Zoom in'
});

zoomInControl.on('click', function () {
    const view = map.getView();
    const currentZoom = view.getZoom();
    view.animate({ zoom: currentZoom + 1 });
});

let zoomInElement = zoomInControl.element;
let zoomInButton = zoomInElement.firstElementChild;
zoomInElement.removeChild(zoomInButton);

let zoomContainer = document.createElement('div');
zoomContainer.className = 'zoom-container';
zoomContainer.appendChild(zoomInButton);
map.getTargetElement().appendChild(zoomContainer);

// Add ZoomIn control to map
map.addControl(zoomInControl);


// ZoomOut Control
let zoomOutControl = new ZoomOut({
    className: 'custom-zoom-out',
    tipLabel: 'Zoom out'
});

zoomOutControl.on('click', function () {
    const view = map.getView();
    const currentZoom = view.getZoom();
    view.animate({ zoom: currentZoom - 1 });
});

let zoomOutElement = zoomOutControl.element;
let zoomOutButton = zoomOutElement.firstElementChild;
zoomOutElement.removeChild(zoomOutButton);

let zoomOutContainer = document.createElement('div');
zoomOutContainer.className = 'zoom-container';
zoomOutContainer.appendChild(zoomOutButton);
map.getTargetElement().appendChild(zoomOutContainer);

// Add ZoomOut control to map
map.addControl(zoomOutControl);


// Search control
let searchControl = new ol.control.Control({
    element: document.createElement('div'),
    className: 'search-control ol-unselectable ol-control',
});

// Add search icon to control
let searchIcon = document.createElement('i');
searchIcon.className = 'fas fa-search';
searchControl.element.appendChild(searchIcon);

// Add search control to map
map.addControl(searchControl);


// Create a new MeasureControl instance
let measureControl = new ol.control.MeasureControl({
    type: 'length',
    units: 'metric',
    className: 'ol-measure-control', // set the class name to style the control with CSS
    title: 'Measure length' // set a tooltip for the control
});

// Create a new AreaControl instance
let areaControl = new ol.control.MeasureControl({
    type: 'area',
    units: 'metric',
    className: 'ol-area-control', // set the class name to style the control with CSS
    title: 'Measure area' // set a tooltip for the control
});

// Add the controls to the map
map.addControl(measureControl);
map.addControl(areaControl);


//Adding Scale-Line
let scaleBarControl = new ol.control.ScaleLine({
    units: 'metric',
    bar: true,
    steps: 4,
    text: true,
    minWidth: 140
});
map.addControl(scaleBarControl);

//mouse position
let mousePositionDiv = document.createElement


   //mouse position
let mousePositionDiv = document.createElement('div');
mousePositionDiv.className = 'mouse-position';
document.body.appendChild(mousePositionDiv);

let mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(6),
    projection: 'EPSG:4326',
    target: mousePositionDiv,
    undefinedHTML: '&nbsp;'
});

map.addControl(mousePositionControl);// displays coordinates at the bottom center when you hover the mouse on the map


// Create the popup element
let popupElement = document.createElement('div');
popupElement.className = 'ol-popup';
let popupContentElement = document.createElement('div');
popupContentElement.className = 'ol-popup-content';
popupElement.appendChild(popupContentElement);

// Create the overlay
let popupOverlay = new ol.Overlay({
    element: popupElement,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});

// Add the overlay to the map
map.addOverlay(popupOverlay);

// Add a click event listener to the map
map.on('click', function (evt) {
    // Hide the popup
    popupOverlay.setPosition(undefined);

    // Check if a feature was clicked
    let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    // If a feature was clicked, show the popup
    if (feature) {
        // Get the geometry of the feature
        let geometry = feature.getGeometry();

        // Get the coordinates of the geometry
        let coordinates = geometry.getCoordinates();

        // Set the content of the popup
        let properties = feature.getProperties();
        let content = '';
        for (let key in properties) {
            if (properties.hasOwnProperty(key)) {
                content += key + ': ' + properties[key] + '<br>';
            }
        }
        popupContentElement.innerHTML = content;

        // Show the popup at the coordinates of the feature
        popupOverlay.setPosition(coordinates);
    }
});

let popup = new ol.Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(popup);

// ...

map.on('singleclick', function (evt) {
    let feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        }); x
    if (feature) {
        let geometry = feature.getGeometry();
        let coord = geometry.getCoordinates();
        popup.setPosition(coord);
        let content = '<ul>';
        let properties = feature.getProperties();
        for (let property in properties) {
            if (property !== 'geometry') {
                content += '<li><strong>' + property + '</strong>: ' + properties[property] + '</li>';
            }
        }
        content += '</ul>';
        document.getElementById('popup-content').innerHTML = content;
        popup.setPosition(coord);
    } else {
        popup.setPosition(undefined);
    }
});
