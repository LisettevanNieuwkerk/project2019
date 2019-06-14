import { minMax, drawScatter } from "./scatterplot.js";

/* Draw containerscattter */
export function drawCircularPackingBasis() {
    // set the dimensions and margins of the graph
    var width = 450
    var height = 450

    // append the svg object to the div called 'my_dataviz'
    var svg = d3v5.select("body").append("svg")
                .attr("width", width)
                .attr("height", height);

    return svg   
}

export function getVarietyValues(dataset, country, minYear, maxYear) {
    var varietyValues = {};
    for (var i in dataset) {
        if (dataset[i]['year']>= minYear && dataset[i]['year'] <= maxYear) {
            var variety = dataset[i]['variety']; 
            if (country == 'all') {
                if (!varietyValues.hasOwnProperty(variety)) {
                    varietyValues[variety] = 1
                }
                else {
                    varietyValues[variety] += 1
                }
            }
            else {
                if (dataset[i]['country'] == country) {
                    if (!varietyValues.hasOwnProperty(variety)) {
                        varietyValues[variety] = 1
                    }
                    else {
                        varietyValues[variety] += 1
                    }
                }
            }
        }
    }

    return varietyValues;
    
}

export function drawCircularPacking(dataset, years, country, svgScatter, svgCirclePacking) {
    var minYear = years[0]
    var maxYear = years[1]

    d3v5.selectAll(".node").remove();

    var tooltip = d3v5.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var data, c; 
    function value(data, c) {
        return data[c];
    }

    var varietyValues = getVarietyValues(dataset, country, minYear, maxYear);
    var miniMax = minMax(varietyValues, value);
    varietyValues = d3v5.entries(varietyValues);
    
    // Size scale for countries
    var size = d3v5.scaleLinear()
    .domain([miniMax[0], miniMax[1]])
    .range([4,55])  // circle will be between 7 and 55 px wide

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
                        'Amount: <strong>'+ d['value'] +'</strong><br>',
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
        .attr("r", function(d){ 
            return size(d['value'])})
        .attr("cx", 450 / 2)
        .attr("cy", 450 / 2)
        .style("fill", "white")
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1);

    // Features of the forces applied to the nodes:
    var simulation = d3v5.forceSimulation()
    .force("center", d3v5.forceCenter().x(450 / 2).y(450 / 2)) // Attraction to the center of the svg area
    .force("charge", d3v5.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3v5.forceCollide().strength(.2).radius(function(d){ return (size(d['value'])+3) }).iterations(1)) // Force that avoids circle overlapping

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



