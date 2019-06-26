import { minMax, groupWine } from "./processdata.js";

/* Draw containerscattter, labels and title*/
export function drawScatterBasis() {
    // Draw SVG figure
    var width = 1015;
    var height = 300;
    var svgScatter = d3v5.select(".items--scattercontainer").append("svg")
                .attr("width", width)
                .attr("height", height);
    
    // Append x and y label and title
    svgScatter.append("text")
        .attr("class", "scatterlabels")
        .attr("transform","translate(930, 290)")
        .text("price");

    svgScatter.append("text")
        .attr("class", "scatterlabels")
        .attr("transform", "translate(12, 70) rotate(-90)")
        .text("rating");

    svgScatter.append("text")
        .attr("class", "itemtitle")
        .attr("transform", "translate(45, 20)")
        .text("Quality price ratio of wines");

    return svgScatter; 
}


export function createScales(groupedWines, sizesScatter) {
    // Find mininimum maximum values of amount in groups and prices
    var data, c;
    function prices(data, c) {
        var list = c.split(",");
        return parseInt(list[1]);
    }
    function amounts(data, c) {
        return parseInt(data[c].length);
    }
    var miniMaxPrices = minMax(groupedWines, prices);
    var miniMaxAmounts = minMax(groupedWines, amounts);

    // Size scale for groups of wine
    var sizeScale = d3v5.scaleLinear()
    .domain([miniMaxAmounts[0], miniMaxAmounts[1]])
    .range([3,10]);

    // Define scale and axis for y and x
    var difference = miniMaxPrices[1] - miniMaxPrices[0];
    var miniPrice = miniMaxPrices[0] - (difference * 0.01); 
    var maxiPrice = miniMaxPrices[1] + (difference * 0.05);

    var xScale = d3v5.scaleLinear()
        .domain([miniPrice, maxiPrice])
        .range([sizesScatter[0], sizesScatter[1]])

    var yScale = d3v5.scaleLinear()
        .domain([79, 101])
        .range([sizesScatter[2], sizesScatter[3]]);

    return([sizeScale, yScale, xScale])
}


/* Draw scatterplot */
export function drawScatter(dataset, years, svgScatter, tooltip, first) {
    var xAxis, yAxis, scatter; 

    // Divide wine into groups based on quality and price
    var groupedWines = groupWine(dataset, years);

    //Size scatterplot
    var paddingLeft = 45;
    var paddingRight = 965;
    var paddingBottom = 260;
    var paddingTop = 30;

    var sizesScatter = [paddingLeft, paddingRight, paddingBottom, paddingTop]

    // Set scales scatterplot
    var scales = createScales(groupedWines, sizesScatter);
    var size = scales[0];
    var yScale = scales[1];
    var xScale = scales[2];

    // When first scatterplot drawn
    if (first == true) {
        xAxis = svgScatter.append("g")
            .attr("class", "axis")
            .attr("transform","translate(0, "+ sizesScatter[2] +")")
            .call(d3v5.axisBottom(xScale));

        yAxis = svgScatter.append("g")
            .attr("class", "axis")
            .attr("transform","translate("+ sizesScatter[0] +", 0)")
            .call(d3v5.axisLeft(yScale));

        // Create clippath
        var clip = svgScatter.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", (sizesScatter[1] - sizesScatter[0]) )
            .attr("height", (sizesScatter[2] - sizesScatter[3]) )
            .attr("x", 45) 
            .attr("y", 30); 

        // Create area for scatterplotcontent
        scatter = svgScatter.append("g")
            .attr("class", "scattercontent")
            .attr("clip-path", "url(#clip)");

        // Create brush to zoom and adapt axises + circles when zoomed, add to scatter
        window.idleTimeout;
        var brush = d3v5.brush()
            .extent([[sizesScatter[0], sizesScatter[3]], [sizesScatter[1], sizesScatter[2]]])
            .on("end", function() {
                var extent = d3v5.event.selection;
                zoom(brush, extent, xScale, yScale, yAxis, xAxis, scatter);
            });

        scatter.append("g")
            .attr("class", "brush")
            .call(brush);
    }

    // When first scatterplot already drawn
    if (first == false) {
        scatter = window.scatterplot[0];
        xAxis = window.scatterplot[1];
        yAxis = window.scatterplot[2];

        // Update x- and y-axis
        xAxis.transition()
        .duration(1000)
        .call(d3v5.axisBottom(xScale));

        yAxis.transition()
        .duration(1000)
        .call(d3v5.axisLeft(yScale));
    }

    // Create circles and interactivity
    groupedWines = d3v5.entries(groupedWines);
    var scattercircles = scatter.selectAll("circle")
        .data(groupedWines);

    scattercircles.enter()
        .append("circle")
        .attr("class", "scattercircle")
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(300)
                .style("opacity", .9);
            tooltip.html(function() {
                    var list = d['key'].split(",");
                    return ['<div class="hoverinfo">',
                    'Points: <strong>'+ list[0] +'</strong><br>',
                    'Prices: <strong>'+ list[1] +'</strong><br>',
                    'Amount of wines: <strong>' + d['value'].length + '</strong>',
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
            var content = document.getElementById("modal-text");
            content.innerHTML = '';
            for (var i in d['value']){
                content.innerHTML += d['value'][i]['title'] + '<br>';
            }
            modal.style.display = "block";
        }) 
        .merge(scattercircles)
        .transition()
        .duration(1000)
        .attr("cx", function (d) {
            var list = d['key'].split(",");
            var price = parseInt(list[1]);
            return xScale(price);
        })
        .attr("cy", function(d) {
            var list = d['key'].split(",");
            var points = parseInt(list[0]);
            return yScale(points);
        })
        .attr("r", function(d){ 
            return size(d['value'].length);
        });

    scattercircles.exit().remove();
    
    // Add pop up modal 
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    
    }

    // Save values of scatterplot into global variable
    window.scatterplot = [scatter, xAxis, yAxis];
} 


/* source: https://bl.ocks.org/EfratVil/d956f19f2e56a05c31fb6583beccfda7 */
export function idled() {
    window.idleTimeout = null;
}

export function zoom(brush, extent, xScale, yScale, yAxis, xAxis, scatter) {
    // Check if area selected, if not set original coordinates back
    if(!extent){
        if (!window.idleTimeout) { return window.idleTimeout = setTimeout(idled, 300) }; 
        xScale.domain([0, 3350])
        yScale.domain([79, 101])
    }else{
        xScale.domain([ extent[0][0], extent[1][0] ].map(xScale.invert, xScale) );
        yScale.domain([ extent[1][1], extent[0][1] ].map(yScale.invert, yScale) );
        scatter.select(".brush").call(brush.move, null)
    }
    
    // Update axis
    xAxis.transition()
        .duration(1000)
        .call(d3v5.axisBottom(xScale));
    yAxis.transition()
        .duration(1000)
        .call(d3v5.axisLeft(yScale));

    // Update circle positions
    scatter.selectAll("circle")
    .transition().duration(1000)
    .attr("cx", function (d) { 
        var list = d['key'].split(",");
        var price = parseInt(list[1]);
        return xScale(price);
    } )
    .attr("cy", function (d) { 
        var list = d['key'].split(",");
        var points = parseInt(list[0]);
        return yScale(points);
    });
}