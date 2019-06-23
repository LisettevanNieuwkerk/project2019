import { minMax, drawScatter } from "./scatterplot.js";

/* Draw containerscattter */
export function drawCircularPackingBasis() {
    // set the dimensions and margins of the graph
    var width = 460
    var height = 420

    // append the svg object to the div called 'my_dataviz'
    var svgCircular = d3v5.select(".items--circularcontainer").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform","translate(0, 30)");


    d3v5.select(".items--circularcontainer").append("text")
        .attr("class", "itemtitle")
        .attr("transform", "translate(45, 20)")
        .text("Wine varieties");

    return svgCircular 
}

export function getVarietyValues(dataset, country, minYear, maxYear) {
    var varietyValues = {};
    for (var i in dataset) {
        if (dataset[i]['year']>= minYear && dataset[i]['year'] <= maxYear) {
            var variety = dataset[i]['variety']; 
            if (country == 'all') {
                if (!varietyValues.hasOwnProperty(variety)) {
                    var grapeType = dataset[i]['grapeType']
                    varietyValues[variety] = {amount :  1, grapeType : grapeType }
                }
                else {
                    varietyValues[variety]['amount'] += 1
                }
            }
            else {
                if (dataset[i]['country'] == country) {
                    if (!varietyValues.hasOwnProperty(variety)) {
                        var grapeType = dataset[i]['grapeType']
                        varietyValues[variety] = {amount :  1, grapeType : grapeType }
                    }
                    else {
                        varietyValues[variety]['amount'] += 1
                    }
                }
            }
        }
    }

    return varietyValues;
    
}

export function drawCircularPacking(dataset, years, svgScatter, svgCirclePacking) {
    country = window.country;
    var minYear = years[0]
    var maxYear = years[1]

    d3v5.selectAll(".node").remove();

    var tooltip = d3v5.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var data, c; 
    function value(data, c) {
        return data[c]['amount'];
    }

    var varietyValues = getVarietyValues(dataset, country, minYear, maxYear);
    var miniMax = minMax(varietyValues, value);
    varietyValues = d3v5.entries(varietyValues);
    
    // Size scale for countries
    var size = d3v5.scaleLinear()
    .domain([miniMax[0], miniMax[1]])
    .range([4, 55])  // circle will be between 7 and 55 px wide

    var node = svgCirclePacking.append("g")
    .selectAll("circle")
    .data(varietyValues)
    .enter()
    .append("circle")
        .attr("class", "node")
        .on("mouseover", function(d) {
            tooltip.transition()
             .duration(300)
             .style("opacity", .9);
            tooltip.html(function() {
                return ['<div class="hoverinfo">',
                'Variety: <strong>'+ d['key'] +'</strong><br>',
                'Amount: <strong>'+ d['value']['amount'] +'</strong><br>',
                '</div>'].join('');
            })
            .style("left", (d3v5.event.pageX + 5) + "px")
            .style("top", (d3v5.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        })
        .on("click", function(d) {
            window.variety = d['key'];
            drawScatter(dataset, years, window.country, window.variety, svgScatter); 
        })
        .attr("r", function(d) {
            return size(d['value']['amount']);
        })    
        .attr("cx", 460 / 2)
        .attr("cy", 420 / 2)
        .style("fill", function(d){
            if (d['value']['grapeType'] == 'red') {
                return "#80b1d3"
            }
            else {
                return "#ffffb3"
            }
        })
        .style("fill-opacity", 0.8)
        .attr("stroke", "#252525")
        .style("stroke-width", 1);

    // Features of the forces applied to the nodes:
    var simulation = d3v5.forceSimulation()
    .force("center", d3v5.forceCenter().x(460 / 2).y(420 / 2)) // Attraction to the center of the svg area
    .force("charge", d3v5.forceManyBody().strength(0.4)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3v5.forceCollide().strength(1).radius(function(d){ return (size(d['value']['amount'])+2) }).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
    .nodes(varietyValues)
    .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
    });

}