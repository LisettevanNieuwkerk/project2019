//Name: Lisette van Nieuwkerk
//Studentnumber: 10590919

var fileName = "data/wine-reviews.json";

/* Function to draw legend */
function drawLegend(color) {
    // Draw svg figure for legen
    var width = 1183;
    var height = 30;
    var legend = d3v5.select("body").append("svg")
                    .attr("width", width)
                    .attr("height", height);
  
    // Append title
    legend.append('text')
          .attr("class", "labels")
          .attr("transform", "translate(50, 18)")
          .text("Average wine rating");
  
    // Append blocks
    var heightBlocks = 3;
    var sizeBlocks = 25;
    var legend = legend.selectAll("legend")
                      .data(color.domain())
                      .enter()
                      .append("g")
                      .attr("transform", function(d, i) {
                        var x = (i * 200) + 300;
                        return "translate(" + x + "," + heightBlocks + ")";
                      });
  
    legend.append("rect")
          .attr("width", sizeBlocks)
          .attr("height", sizeBlocks)
          .style("fill", color)
          .style("stroke", "black");
  
    // Append text
    legend.append('text')
          .attr("class", "labels")
          .attr("x", 40)
          .attr("y", 18)
          .text(function(d) { return d; });
}


/* Define values per country */
function defineValuesCountries(dataset, years) {
    minYear = years[0]
    maxYear = years[1]

    // Sort ratings per country
    var valuesCountries = {};
    var points;
    for (i in dataset) {
        if (dataset[i]['year'] >= minYear && dataset[i]['year'] <= maxYear) {
            countryCode = dataset[i]['countryCode'];
            points = dataset[i]['points'];
            if (!valuesCountries.hasOwnProperty(countryCode)) {
                valuesCountries[countryCode] = { country : dataset[i]['country'], points : [points] } 
            }
            else {
                valuesCountries[countryCode]['points'].push(points);
            }
        } 
    }

    // Define average, total production and fillcolor for countries
    var fillColor;
    var totalReviews;
    let sum;
    let avg;
    for (countryCode in valuesCountries ) {   
        // Calculate average
        totalReviews = valuesCountries[countryCode]['points'].length;
        sum = valuesCountries[countryCode]['points'].reduce((previous, current) => current += previous);
        avg = sum / totalReviews;

        // Define fillcolor based on average
        if (avg < 86) {
            fillColor = '#66c2a4';
        }
        else if (avg >= 86 && avg < 89) {
            fillColor = '#2ca25f';
        }
        else {
            fillColor = '#006d2c';
        }

        // Add values to dict
        valuesCountries[countryCode]['points'] = avg.toFixed(2)
        valuesCountries[countryCode]['fillColor'] = fillColor
        valuesCountries[countryCode]['totalReviews'] = totalReviews
    }

    return valuesCountries
}



/* Draw datamap */
function drawMap(dataset,years) {

    // Draw datamap
    var basic = new Datamap({
        element: document.getElementById("container"),
        fills: { defaultFill: '#CDCCCC' },
        data: defineValuesCountries(dataset, years),
        geographyConfig: {
        // Show desired information in tooltip
            popupTemplate: function(i, data) {
                // Don't show tooltip if country not present in dataset
                if (!data) { return ['<div class="hoverinfo">',
                '<strong>No data available</strong>',
                '<br>Country: <strong>'+ i.properties.name +'</strong>',
                '</div>'].join('') };
                // Tooltip content
                return ['<div class="hoverinfo">',
                'Country: <strong>'+ data.country +'</strong><br>',
                'Average winerating: <strong>'+ data.points +'</strong><br>',
                'Total reviewed wines: <strong>'+ data.totalReviews+'</strong>',
                '</div>'].join('');

            }    
        }   
    });
  }


/* Load page */
window.onload = function() {

    d3v5.json(fileName).then(function(dataset){

        // Set color scale for map
        var color = d3v5.scaleOrdinal()
        .domain(['No data', 'Lower than 5.5', 'Between 5.5 and 7.0', '7.0 or higher'])
        .range(['#b2e2e2','#66c2a4','#2ca25f', '#006d2c']);

        // Slider https://refreshless.com/nouislider/slider-values/
        var slider = document.getElementById('slider');
        var years = [1990, 2016]

        noUiSlider.create(slider, {
            start: years,
            step: 1,
            connect: true,
            range: {
                'min': years[0],
                'max': years[1]
            }
        });

        // Draw legend of datamap
        drawLegend(color);

        // Draw map
        drawMap(dataset, years);
        slider.noUiSlider.on('update.one', function (values) {
            // Get new range from slider 
            years = [parseInt(values[0]), parseInt(values[1])] 
            
            // Remove old worldmap
            children = document.getElementById("container");
            while (children.firstChild) {
                children.removeChild(children.firstChild);
            }

            // Draw net map
            drawMap(dataset, years);
        });    
    });
};