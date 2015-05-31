/*--- IMPORTANT GUIDELINES --- 
1. Use div #canvas-svg for svg rendering
    var svg = d3.select("#canvas-svg");
2. 'data' variable contains JSON data from Data tab
   'config' variable contains data from Properties tab
    Do NOT overwrite these variables
3. To define customizable properties, use capitalized variable names,
    and define them in Properties tab ---*/

var Y_AXIS_LABEL = config.yAxisLabel;

var GROUPS = config.xAxis;

var BARS = [
    config.yAxis0,
    config.yAxis1,
    config.yAxis2,
    config.yAxis3,
    config.yAxis4,
    config.yAxis5,
    config.yAxis6
];

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
},
    width = config.width - margin.left - margin.right,
    height = config.height - margin.top - margin.bottom;

var x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear().range([height, 0]);

// var color = d3.scale.category10();
var color = d3.scale.ordinal()
    .range([
        config.color0,
        config.color1,
        config.color2,
        config.color3,
        config.color4,
        config.color5,
        config.color6
    ]);

var xAxis = d3.svg.axis().scale(x0).orient("bottom");

var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

var svg = d3.select("#canvas").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

data.forEach(function(d) {
        d.bars = BARS.map(function(name) {
                return {
                    name: name,
                    value: +d[name]
                };
            });
    });
x0.domain(data.map(function(d) {
            return d[GROUPS];
        }));
x1.domain(BARS).rangeRoundBands([0, x0.rangeBand()]);
y.domain([0, d3.max(data, function(d) {
                return d3.max(d.bars, function(d) {
                        return d.value;
                    });
            })]);
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")").call(xAxis);
svg.append("g")
    .attr("class", "y axis").call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(Y_AXIS_LABEL);

var groups = svg.selectAll(".groups")
    .data(data).enter().append("g")
    .attr("class", "g")
    .attr("transform", function(d) {
        return "translate(" + x0(d[GROUPS]) + ",0)";
    });
groups.selectAll("rect").data(function(d) {
        return d.bars;
    }).enter().append("rect")
    .attr("width", x1.rangeBand()).attr("x", function(d) {
        return x1(d.name);
    }).attr("y", function(d) {
        return y(d.value);
    }).attr("height", function(d) {
        return height - y(d.value);
    }).style("fill", function(d) {
        console.log(color(d.name))
        return color(d.name);
    });
var legend = svg.selectAll(".legend")
    .data(BARS.slice()).enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
        return "translate(-450," + i * 20 + ")";
    });
legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18).style("fill", color);
legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
        return d;
    });