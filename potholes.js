var dispatch = d3.dispatch("load", "statechange");

//Map dimensions (in pixels)
var width = 591,
    height = 600;
// var width = document.getElementById("map").style.width,
//     height = document.getElementById("map").style.height;

//Graph dimensions (in pixels)
var widthGraph = width*.9,
    heightGraph = height*.9;
    // paddingLeft = 200;

//Map projection
var projection = d3.geo.mercator()
    .scale(64292.654161452716)
    .center([-87.73212559489255,41.83407278286622]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geo.path()
    .projection(projection);

//Create an SVG
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var svgGraph = d3.select("graph").append("svg")
    .attr("width", widthGraph)
    .attr("height", heightGraph);
    // .attr("padding-left", paddingLeft);

// Graph stuffz //////////////////
// var x = d3.scale.ordinal()
//     .rangeRoundBands([0, widthGraph], .1);

// var y = d3.scale.linear()
//     .range([heightGraph, 0]);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
//     .ticks(10);
////////////////////////////////////

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

//Group for the graph features
var featuresGraph = svgGraph.append("g")
    .attr("class","features");

//Create choropleth scale
var color = d3.scale.quantize()
    .domain([0,15])
    .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomed);

svg.call(zoom);

//Create a tooltip, hidden at the start
var tooltip = d3.select("body").append("div").attr("class","tooltip");

// Load Data conventional way -- works
d3.json("geojson_test.json",function(error,geodata) {
  if (error) return console.log(error); //unknown error, check the console

 var thiscrime = [];
    for (i=0; i < geodata['features'].length; i++) {
      thiscrime.push(geodata['features'][i]['properties'].tot_potholes);
    }

  var crimes = Object.keys(geodata.features[0]['properties']);
    console.log(crimes);
  //Create a path for each map feature in the data
  features.selectAll("path")
    .data(geodata.features)
    .enter()
    .append("path")
    .attr("d",path)
    .attr("class", function(d) { return (typeof color(d.properties.ROBBERY) == "string" ? color(d.properties.ROBBERY) : ""); })
    // .on("mouseover",showTooltip)
    // .on("mouseover",highlightBar)
    .on("mousemove",moveTooltip)
    .on("mouseout",hideTooltip)
    .on("click",clicked);

// More Graph stuffz //////////////////
// var y = d3.scale.ordinal()
//     .domain(thiscrime)
//     .rangeBands([0, heightGraph]);

// var x = d3.scale.linear()
//     .domain([0,d3.max(thiscrime)])
//     .range([0, widthGraph]);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
//     .ticks(10);

  // featuresGraph.append("g")
  //     .attr("class", "x axis")
  //     .call(yAxis)
  //   .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 5)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("Robbery Stats\nThroughout the City of Wind");

// var barWidth = widthGraph / thiscrime.length;

// console.log(thiscrime);

//   featuresGraph.selectAll(".bar")
//       .data(thiscrime)
//     .enter().append("rect")
//     // .attr("transform", "rotate(90)")
//       .attr("class", "bar")
//       .attr("x",0)
//       .attr("y",y)
//       .attr("width", x)
//       .attr("height", y.rangeBand)
//     .on("mouseover",highlightArea(thiscrime));
////////////////////////////////////

});

function updateData(crimeType) {
  d3.json("geojson_test.json",function(error,geodata) {
    var thiscrime = [];
    var deezbeats = [];
    for (i=0; i < geodata['features'].length; i++) {
      thiscrime.push(geodata['features'][i]['properties'][crimeType]);
    }
      var max = d3.max(thiscrime);

console.log('update');
    // Scale chloropleth
      var color = d3.scale.quantize()
        .domain([0,max])
        .range(d3.range(6).map(function(i) { return "q" + i + "-6"; }));

        features.selectAll("path")
        .data(geodata.features)
        .transition(50)
        .attr("class", function(d) { return (typeof color(d.properties[crimeType]) == "string" ? color(d.properties[crimeType]) : ""); 
         console.log(d.properties[crimeType]);
        });
    features
        .on("mouseover",showTooltip)
        .on("mousemove",moveTooltip)
        .on("mouseout",hideTooltip)
        .on("click",clicked);    

    // More Graph stuffz //////////////////
    var y = d3.scale.ordinal()
        .domain(thiscrime)
        .rangeBands([0,heightGraph]);

    var x = d3.scale.linear()
        .domain([0,d3.max(thiscrime)])
        .range([0, widthGraph]);

      // featuresGraph.selectAll(".bar")
      //     .data(thiscrime)
      //     .transition(50)
      //     .attr("class", "bar")
      //     .attr("text",crimeType + " Stats\nThroughout the City of Wind")
      //     .attr("x",0)
      //     .attr("y",y)
      //     .attr("width", x)
      //     .attr("height",y.rangeBands());
    ////////////////////////////////////

    });

}

// A drop-down menu for selecting a state; uses the "menu" namespace.
dispatch.on("load.menu", function(crimes) {
  console.log(crimes);
  var select = d3.select("body")
    .append("div")
    .append("select")
      .on("change", function() { dispatch.statechange(crimes.get(this.value)); });

  select.selectAll("option")
      .data(stateById.values())
    .enter().append("option")
      .attr("value", function(d) { return d.id; })
      .text(function(d) { return d.id; });

  dispatch.on("statechange.menu", function(state) {
    select.property("value", state.id);
  });
});


// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {

}


//Update map on zoom/pan
function zoomed() {
  features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
}


//Position of the tooltip relative to the cursor
var tooltipOffset = {x: 5, y: -25};

// Highlight bar-corresponding area on map
function highlightArea (thislist) {
  console.log(thislist);
  var v = thislist;
  features.selectAll("path").filter(":nth-child("+v+")")[0]
}

// Highlight a selection in the bar graph
function highlightBar(filterObj){
  var selection = featuresGraph.filter(function (d, filterObj) {
    return filterObj & 1;
  });
}

//Create a tooltip, hidden at the start
function showTooltip(d) {
  moveTooltip();
console.log(d);
  tooltip.style("display","block")
      .text("Community: " + d.properties.community);

  // Highlight corresponding bar in graph
  // highlightBar(d.properties.BEAT_NUM); 
}

//Move the tooltip to track the mouse
function moveTooltip() {
  tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
  tooltip.style("display","none");
}