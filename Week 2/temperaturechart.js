// Set the dimensions of the canvas / graph
var margin = { top: 30, right: 20, bottom: 30, left: 50 },
    legendwidth = 250,
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.timeParse("%Y");

// Set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxis = d3.axisBottom().scale(x)
    .ticks(5);

var xRefAxis = d3.axisBottom().scale(x)
    .ticks(0);

var yAxis = d3.axisLeft().scale(y)
    .ticks(5);

// Define the line for Global
var globline = d3.line()
    .curve(d3.curveCatmullRomOpen)
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.Glob); });

// Define the line for NHem
var nhemline = d3.line()
    .curve(d3.curveCatmullRomOpen)
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.NHem); });

// Define the line for SHem
var shemline = d3.line()
    .curve(d3.curveCatmullRomOpen)
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.SHem); });

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right + legendwidth)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var i = 1;

// Define the names of values
var keys = ["Global", "North Hemisphere", "South Hemisphere"]

// Define the colors
var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);

// Get the data
d3.csv("data/ZonAnn.Ts+dSST.csv").then(function (data) {
    console.log(data);

    data.forEach(function (d) {
        d.date = parseDate(d.Year);
        d.Glob = +d.Glob;
        d.NHem = +d.NHem;
        d.SHem = +d.SHem;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) { return d.date; }));
    y.domain([d3.min(data, function (d) { return d.NHem; }) * 1.1, d3.max(data, function (d) { return d.NHem; }) * 1.1]);

    var yzero = Math.abs(d3.max(data, function (d) { return d.NHem; })) / (Math.abs(d3.min(data, function (d) { return d.NHem; })) + Math.abs(d3.max(data, function (d) { return d.NHem; })));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Label for the X Axis
    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    // Add the Reference X Axis
    svg.append("g")
        .attr("class", "axis")
        .style("stroke-dasharray", "2em")
        .attr("transform", "translate(0," + height * yzero + ")")
        .call(xRefAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add the Label for the Y Axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Deviation");

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", globline(data))
        .style("stroke", color("Global"));

    svg.append("path")
        .attr("class", "line")
        .attr("d", nhemline(data))
        .style("stroke", color("North Hemisphere"));

    svg.append("path")
        .attr("class", "line")
        .attr("d", shemline(data))
        .style("stroke", color("South Hemisphere"));

    // Add the Legend
    svg.append("text")
        .attr("x", 80)
        .attr("y", 20)
        .attr("class", "legendtitle")
        .text("Legend");

    // Add one dot in the legend for each name.
    svg.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
        .attr("cx", 60)
        .attr("cy", function (d, i) { return 40 + i * 20 }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function (d) { return color(d) })

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 80)
        .attr("y", function (d, i) { return 40 + i * 20 }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) { return color(d) })
        .text(function (d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

});