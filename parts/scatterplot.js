/* Function to calculate min and max */
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


/* Draw scatter */
export function groupWine(dataset, country, variety, minYear, maxYear) {
    var groupedWines = {}

    function add(key, i) {
        if (!groupedWines.hasOwnProperty(key)) {
            groupedWines[key] = [{ title : dataset[i]['title']}]
        }
        else {
            groupedWines[key].push({ title : dataset[i]['title']})
        }
    }

    for (var i in dataset) {
        if (dataset[i]['year']>= minYear && dataset[i]['year'] <= maxYear) {
            var key = [dataset[i]['points'], dataset[i]['price']]
            if (country == 'all') {
                if (variety == 'all') {
                    add(key, i);
                }
                else {
                    if (dataset[i]['variety'] == variety) {
                        add(key, i);
                    }    
                }
            }
            else {
                if (dataset[i]['country'] == country) {
                    if (variety == 'all') {
                        add(key, i);
                    }
                    else {
                        if (dataset[i]['variety'] == variety) {
                            add(key, i);
                        }    
                    }
                }
            }     
        }

    }
    return groupedWines 
}


/* Draw containerscattter */
export function drawScatterBasis() {
    // Draw SVG figure
    var width = 1200;
    var height = 300;
    var svg = d3v5.select("body").append("svg")
                .attr("width", width)
                .attr("height", height);
    
    // Append x and y label
    svg.append("text")
        .attr("class", "labels")
        .attr("transform","translate(750, 690)")
        .text("Price");

    svg.append("text")
        .attr("class", "labels")
        .attr("transform", "translate(45, 20)")
        .text("Rating");

    return svg; 
}


/* Draw scatter */
export function drawScatter(dataset, years, country, variety, svgScatter) {
    var minYear = years[0];
    var maxYear = years[1];

    // Create tooltop
    var tooltip = d3v5.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Sort wines in groups by price and points
    var groupedWines = groupWine(dataset, country, variety, minYear, maxYear);
    
    var data, c;
    function value(data, c) {
        var list = c.split(",");
        return parseInt(list[1]);
    }

    console.log( minMax(groupedWines, value) );
    groupedWines = d3v5.entries(groupedWines);

    //Size scatterplot
    var paddingRight = 1150;
    var paddingLeft = 40;
    var paddingBottom = 280;
    var paddingTop = 10;

    // Remove old axises and circles
    d3v5.selectAll(".axis").remove();
    d3v5.selectAll(".circle").remove();

    // Define scale and axis for y and x
    var yScale = d3v5.scaleLinear()
        .domain([79, 101])
        .range([paddingBottom, paddingTop]);
    var yAxis = svgScatter.append("g")
        .attr("class", "axis")
        .attr("transform","translate("+ paddingLeft +", 0)")
        .call(d3v5.axisLeft(yScale));

    var xScale = d3v5.scaleLinear()
        .domain([0, 3500])
        .range([paddingLeft, paddingRight])
    var xAxis = svgScatter.append("g")
        .attr("class", "axis")
        .attr("transform","translate(0, "+ paddingBottom +")")
        .call(d3v5.axisBottom(xScale));
    
    // Create brush to zoom and adapt axises + circles
    window.idleTimeout;
    var brush = d3v5.brush()
        .extent([[0, 0], [(1200 - 90), (300 - 30)]])
        .on("end", function() {
            var extent = d3v5.event.selection;

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if(!extent){
                if (!window.idleTimeout) { return window.idleTimeout = setTimeout(idled, 300) }; 
                xScale.domain([0, 3350])
                yScale.domain([79, 101])
            }else{
                xScale.domain([ xScale.invert(extent[0][0]), xScale.invert(extent[1][0]) ])
                yScale.domain([ yScale.invert(extent[1][1]), yScale.invert(extent[0][1]) ])
                c.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }
        
            // Update axis and circle position
            xAxis.transition()
                .duration(1000)
                .call(d3v5.axisBottom(xScale));
            
            yAxis.transition()
                .duration(1000)
                .call(d3v5.axisLeft(yScale));
        
            c.selectAll("circle")
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
            })
        });   
    
    var clip = svgScatter.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", (1200 - 90) )
        .attr("height", (300 - 30) )
        .attr("x", 0) 
        .attr("y", 0); 

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
    
    // Create scatterplot, circles and interactivity
    var c = svgScatter.append("g")
        .attr("clip-path", "url(#clip)");
    
    c.append("g")
        .attr("class", "brush")
        .call(brush);

    c.selectAll("circle")
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
        .attr("r", 2);
}

/* https://bl.ocks.org/EfratVil/d956f19f2e56a05c31fb6583beccfda7 */
export function idled() {
    window.idleTimeout = null;
}

