import { drawScatter } from "./scatterplot.js";
import { minMax, getVarietyValues } from "./processdata.js";

/* Draw containerscattter */
export function drawCircularPackingBasis() {
    var circularcontainer = d3v5.select(".items--circularcontainer");

    // Set color scale for circularpacking
    var color = d3v5.scaleOrdinal()
        .domain(["Red grapes", "White grapes"])
        .range(["#80b1d3","#ffffb3"]);
    
    var widthLegend = 240;
    var heightLegend = 30;
    var circularlegend = circularcontainer.append("svg")
        .attr("class", "circularLegend")
        .attr("width", widthLegend)
        .attr("height", heightLegend);
    
    var circles = circularlegend.selectAll("legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
        var x = (i * 110) + 10;
        return "translate("+ x +", 19)";
        });
    circles.append("circle")
        .attr("r", "9")
        .style("fill", color)
        .attr("stroke", "#252525")
        .style("stroke-width", 1);

    // Append text legend
    circles.append('text')
        .attr("class", "legendlabels")
        .attr("x", 15)
        .attr("y", 5)
        .text(function(d) { return d; });

    // Create svg for circularpacking
    var width = 460
    var height = 420
    var svgCircular = circularcontainer.append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add title
    d3v5.select(".items--circularcontainer").append("text")
        .attr("class", "itemtitle")
        .attr("transform", "translate(45, 20)")
        .text("Wine varieties");

    return svgCircular 
}


export function drawCircularPacking(dataset, years, svgScatter, svgCirclePacking, tooltip) {
    // Get amount of varieties + min and max values
    function getAmount(data, c) {
        return data[c]['amount'];
    }

    var varietyValues = getVarietyValues(dataset, years);
    var miniMax = minMax(varietyValues, getAmount);
    varietyValues = d3v5.entries(varietyValues);
    
    // Size scale for countries
    var size = d3v5.scaleLinear()
    .domain([miniMax[0], miniMax[1]])
    .range([4, 55]);

    // Remove old circles
    d3v5.selectAll(".node").remove();
    
    // Add circles to svg
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
            drawScatter(dataset, years, svgScatter, tooltip, false);
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
        });
    
    /* source: https://www.d3indepth.com/force-layout/*/
    // Features of the forces applied to the nodes
    var simulation = d3v5.forceSimulation()
    .force("center", d3v5.forceCenter().x(460 / 2).y(420 / 2)) 
    .force("charge", d3v5.forceManyBody().strength(0.4)) 
    .force("collide", d3v5.forceCollide().strength(1).radius(function(d){ return (size(d['value']['amount'])+2) }).iterations(1)) 

    // Apply these forces to the nodes and update their positions.
    simulation
    .nodes(varietyValues)
    .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
    });     
}