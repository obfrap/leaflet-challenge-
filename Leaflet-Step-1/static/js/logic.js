// Store API endpoint as variable to pass into d3.json
var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a get request to query url and pull json data
d3.json(quakeUrl, function(data) {
    createFeatures(data.features);
});


function createFeatures(earthquakeData) {
    // Create popups
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h4>" + feature.properties.place + "</h4>,<hr><p>" + "<h3>" + feature.properties.mag + "</h3></p>");
    
    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    //Create geojson circle markers

    function createCircleMarker (feature, coords) {
        let options = {
            radius:feature.properties.mag*5,
            fillColor: magColor(feature.properties.mag), 
            color: magColor(feature.properties.mag),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        }
        return L.circleMarker(coords, options);

    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
      });
    createMap(earthquakes);

}
//Build function chooseColor to calculate colors of the circles.

function magColor(mag) {
    if (mag > 6) {
        return 'crimson'
        }
        else if (mag > 5) {
            return 'red'
        }
        else if (mag > 4) {
            return 'orange'
        }
        else if (mag > 3) {
            return 'yellow'
        }
        else if (mag > 2) {
            return 'green'
        }
        else if (mag > 1) {
            return 'blue'
        }
        else {
            return 'violet'
        }    
};
// Now write function to create and put together different map layers.
function createMap(earthquakes) {
    //Define various views like darkmap, lightmap and satellite views
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: "pk.eyJ1Ijoib2JmcmFwIiwiYSI6ImNrZDZwaG93ajJqZ2IydHFybmJubGtmbHUifQ.6Oz9oowlTQBhrr1LzVKEDg"
    });
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: "pk.eyJ1Ijoib2JmcmFwIiwiYSI6ImNrZDZwaG93ajJqZ2IydHFybmJubGtmbHUifQ.6Oz9oowlTQBhrr1LzVKEDg"
    });
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: "pk.eyJ1Ijoib2JmcmFwIiwiYSI6ImNrZDZwaG93ajJqZ2IydHFybmJubGtmbHUifQ.6Oz9oowlTQBhrr1LzVKEDg"
    });

    // Define an object to hold base layers
    var baseMaps = {
        "Dark Map": darkmap,
        "Light Map": lightmap,
        "Satellite": satellite
    };

    //Create overlay object to hold layers
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    //Create map and give it lightmap and earthquake layers on initial display
    var myMap = L.map("map", {
        center: [26.748613, -31.314020],
        zoom: 2,
        layers: [lightmap, earthquakes]
      });

     // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  // Create legend
  var legend = L.control({ position: 'bottomleft' });
  // Create function to update legend
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
        mags = [0, 1, 2, 3, 4, 5];
        labels = [];
    
    for (var i=0; i < mags.length; i++) {
        div.innerHTML +=
        '<i style="background:' + magColor(mags[i] + 1) + '"></i> ' +
        mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
    }
    return div;   
    };
legend.addTo(myMap);
}




