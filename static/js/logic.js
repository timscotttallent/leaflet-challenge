var API_KEY = 'pk.eyJ1IjoidGltc2NvdHR0YWxsZW50IiwiYSI6ImNrZngxOWZqOTFveXMycW10azR5NTFxeGkifQ.vuZeN8QVVSPS-YYgBryZIg'

var graymap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

// we will create the map object
var map = L.map("map", {
    center: [
        40, -94
    ],
    zoom: 3
});

// adding the tile layer to the map
graymap.addTo(map);

// // WE will call the geoJson data 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data){
    // create a function that return all thestyle of the maps

    function Mapstyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: ColorType(feature.properties.mag),
            radius: RadiusSize(feature.properties.mag),
            stroke: true,
            weight: 0.5  

        };
    }

        // Create a function to put the color type
    function ColorType(magnitude) {
        switch(true) {
        case magnitude > 5:
            return "red";
        case magnitude > 4:
            return "orange";
        case magnitude > 3:
            return "yellow";
        case magnitude > 2:
            return "green";
        case magnitude > 1:
            return "blue";
        default:
            return "gray";
        }
    }

    // create a function to call my readius size
    function RadiusSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;

    }

    // Here we add a GeoJSON layer

    L.geoJson(data, {
        // need to make each circle marker
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng)
        },

        // setting the stly of the circle marker
        style: Mapstyle,

        // now we create the pop up
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: "+ feature.properties.mag + "<br>Location: " + feature.properties.place);

        }

    }).addTo(map);

    // create the legends
    var legend = L.control({
        position: "bottomright"
    });

    // add legend details
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var magGrades = [0,1,2,3,4,5]
        var colors = ["gray", "blue", "green", "yellow", "orange", "red"];

        // loop thru the intervals to generate the colors
        for (var x = 0 ; x < magGrades.length; x++) {
            div.innerHTML +=
                "<i style='background: " + colors[x] + "'></i> " + magGrades[x] + (magGrades[x + 1] ? '-' + magGrades[x + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(map);


});