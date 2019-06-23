/* Function to calculate min and max value*/
export function minMax(data, value) {
    var current;
    var max;
    var min;
    var first = true;
  
    for (var c in data) {
        current = value(data, c);
        if (first == true) {
            max = current;
            min = current;
            first = false;
        }
        else {
            if (current > max) {
            max = current;
            }
            else if (current < min) {
                min = current;
            }
        }
    }
    return [min, max];
}


/* Function to group wine by price and quality*/
export function groupWine(dataset, country, variety, minYear, maxYear) {
    var groupedWines = {};
    for (var i in dataset) {
        if (dataset[i]['year']>= minYear && dataset[i]['year'] <= maxYear) {
            var key = [dataset[i]['points'], dataset[i]['price']]
            if (country == 'all') {
                if (variety == 'all') {
                    add_to_dict(dataset, groupedWines, key, i);
                }
                else {
                    if (dataset[i]['variety'] == variety) {
                        add_to_dict(dataset, groupedWines, key, i);
                    }    
                }
            }
            else {
                if (dataset[i]['country'] == country) {
                    if (variety == 'all') {
                        add_to_dict(dataset, groupedWines, key, i);
                    }
                    else {
                        if (dataset[i]['variety'] == variety) {
                            add_to_dict(dataset, groupedWines, key, i);
                        }    
                    }
                }
            }     
        }

    }
    return groupedWines 
}

function add_to_dict(dataset, groupedWines, key, i) {
    if (!groupedWines.hasOwnProperty(key)) {
        groupedWines[key] = [{ title : dataset[i]['title']}]
    }
    else {
        groupedWines[key].push({ title : dataset[i]['title']})
    }
}


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


/* Draw scatterplot */
export function drawScatter(dataset, years, variety, svgScatter, tooltip) {
    country = window.country;
    var minYear = years[0];
    var maxYear = years[1];

    // Remove old axises and circles
    d3v5.selectAll(".axis").remove();
    d3v5.selectAll(".circle").remove();

    // Sort wines in groups by price and points
    var groupedWines = groupWine(dataset, country, variety, minYear, maxYear);

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
    var size = d3v5.scaleLinear()
    .domain([miniMaxAmounts[0], miniMaxAmounts[1]])
    .range([3,10]);

    //Size scatterplot
    var paddingRight = 965;
    var paddingLeft = 45;
    var paddingBottom = 260;
    var paddingTop = 30;

    // Define scale and axis for y and x
    var miniPrice = miniMaxPrices[0] - 30;
    var maxiPrice = miniMaxPrices[1] + (miniMaxPrices[1] * 0,1);
    var yScale = d3v5.scaleLinear()
        .domain([79, 101])
        .range([paddingBottom, paddingTop]);
    var yAxis = svgScatter.append("g")
        .attr("class", "axis")
        .attr("transform","translate("+ paddingLeft +", 0)")
        .call(d3v5.axisLeft(yScale));

    var xScale = d3v5.scaleLinear()
        .domain([-30, 3500])
        .range([paddingLeft, paddingRight])
    var xAxis = svgScatter.append("g")
        .attr("class", "axis")
        .attr("transform","translate(0, "+ paddingBottom +")")
        .call(d3v5.axisBottom(xScale));

    // Create clippath
    var clip = svgScatter.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", (paddingRight - paddingLeft) )
        .attr("height", (paddingBottom - paddingTop) )
        .attr("x", 45) 
        .attr("y", 30); 

    // Create scatterplot
    var scatter = svgScatter.append("g")
        .attr("clip-path", "url(#clip)");

    // Create brush to zoom and adapt axises + circles when zoomed, add to scatter
    window.idleTimeout;
    var brush = d3v5.brush()
        .extent([[paddingLeft, paddingTop], [paddingRight, paddingBottom]])
        .on("end", function() {
            var extent = d3v5.event.selection;
            zoom(brush, extent, xScale, yScale, yAxis, xAxis, scatter);
        });

        scatter.append("g")
        .attr("class", "brush")
        .call(brush);

    // Create circles and interactivity
    groupedWines = d3.entries(groupedWines);
    scatter.selectAll("circle")
        .data(groupedWines)
        .enter()
        .append("circle")
        .attr("class", "circle")
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
        })
        .style("opacity", 0.6)
        .style("fill", "#252525");

    

    // Pop up modal
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
}


/* https://bl.ocks.org/EfratVil/d956f19f2e56a05c31fb6583beccfda7 */
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
