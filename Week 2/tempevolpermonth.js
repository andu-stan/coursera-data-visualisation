// Set the dimensions of the canvas / graph
var margin = { top: 30, right: 20, bottom: 30, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.timeParse("%Y/%b/%d");

// Set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxis = d3.axisBottom().scale(x)
    .ticks(12);

var yAxis = d3.axisLeft().scale(y)
    .ticks(5);

// Define the line for Global
var line = d3.line()
    //.curve(d3.curveCatmullRomOpen)
    .x(function (d) { return x(d.month); })
    .y(function (d) { return y(d.value); });


// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


d3.text("data/GLB.Ts+dSST.csv").then(function (data) {

    // Remove first header row
    data = d3.csvParse(data.split('\n').slice(1).join('\n'))

    // Remove extra columns
    const keep = ["Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //const keep = ["Year", "Jan"];
    data = data.map(row => [...keep].reduce((acc, v) => ({ ...acc, [v]: row[v] }), {}));

    var allGroup = [];

    var dataReady = [], b = [];
    for (var i = 0; i < data.length; i++) {
        var obj = {}, values = [], val = {};
        obj.year = data[i].Year;
        allGroup.push(obj.year);
        val.month = 1;
        val.value = +data[i].Jan.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 2;
        val.value = +data[i].Feb.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 3;
        val.value = +data[i].Mar.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 4;
        val.value = +data[i].Apr.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 5;
        val.value = +data[i].May.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 6;
        val.value = +data[i].Jun.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 7;
        val.value = +data[i].Jul.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 8;
        val.value = +data[i].Aug.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 9;
        val.value = +data[i].Sep.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 10;
        val.value = +data[i].Oct.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 11;
        val.value = +data[i].Nov.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        val.month = 12;
        val.value = +data[i].Dec.replace(/[^0-9.-]/g, "");
        values.push(val); val = {};
        obj.values = values;
        dataReady.push(obj);

    };

    // Define the colors
    var color = d3.scaleSequential(d3.interpolateReds)
        .domain([1880, 2020]);

    // Scale the range of the data
    x.domain([1, 12])
    y.domain([-1, 3])

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
        .text("Month");

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

    // Add the valuelines path
    svg.selectAll("myLines")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", function (d) { return line(d.values) })
        .style("stroke", function (d) { return color(d.year) })


    // Add the Legend
    svg.append("text")
        .attr("x", 950)
        .attr("y", 20)
        .attr("class", "legendtitle")
        .text("Legend");

    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(800,40)");

    var legendLinear = d3.legendColor()
        .shapeWidth(30)
        .cells(10)
        .orient('horizontal')
        .scale(color)
        .labelFormat(d3.format("d"));

    svg.select(".legendLinear")
        .call(legendLinear);

});