/* Function to calculate min and max */
export function minMax(data, i) {
    var current;
    var max;
    var min;
    var first = true;
  
    for (var c in data) {
        current = data[c][i];
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
export function groupWine(dataset, country, minYear, maxYear) {
    var groupedWines = {}

    for (var i in dataset) {
        if (dataset[i]['year']>= minYear && dataset[i]['year'] <= maxYear) {
            var key = [dataset[i]['points'], dataset[i]['price']]
            if (!groupedWines.hasOwnProperty(key)) {
                groupedWines[key] = [{ title : dataset[i]['title']}]
            }
            else {
                groupedWines[key].push({ title : dataset[i]['title']})

            }
        }

    }
    return groupedWines 
}


/* Draw scatter */
export function drawScatter(dataset, country, years, svg) {

    var minYear = years[0]
    var maxYear = years[1]

    var groupedWines = groupWine(dataset, country, minYear, maxYear);
    console.log(groupedWines);

    console.log( minMax(dataset, 'price'));

    //Size scatterplot
    var paddingRight = 1150;
    var paddingLeft = 40;
    var paddingBottom = 280;
    var paddingTop = 10;

    // Define scale and axis for y and x
    var yScale = d3v5.scaleLinear()
        .domain([79, 101])
        .range([paddingBottom, paddingTop]);
    var yAxis = d3v5.axisLeft(yScale);

    var xScale = d3v5.scaleLinear()
        .domain([0, 3350])
        .range([paddingLeft, paddingRight]);
    var xAxis = d3v5.axisBottom(xScale);

    // Draw y and x axis
    svg.append("g")
        .call(yAxis)
        .attr("transform","translate("+ paddingLeft +", 0)");

    svg.append("g")
        .call(xAxis)
        .attr("transform","translate(0, "+ paddingBottom +")");

    // Create scatterplot
    var c = svg.selectAll("circle")
        .data(dataset)

    c.enter()
        .append("circle")
        .attr("class", "circles")
        .merge(c)
        .transition()
        .duration(1000)
        .attr("cx", function (d) {
            if (d.year >= minYear && d.year <= maxYear) {
                if (country == 'all') {
                    return xScale(d.price);
                }
                else {
                    if (d.country == country) {
                        return xScale(d.price);
                    }
                }    
            }
        })
        .attr("cy", function(d) {
            if (d.year >= minYear && d.year <= maxYear) {
                if (country == 'all') {
                    return yScale(d.points);
                }
                else {
                    if (d.country == country) {
                        return yScale(d.points);
                    }
                }
            }
        })
        .attr("r", 2);
}