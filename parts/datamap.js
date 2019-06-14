/* Function to draw legend */
import { drawScatter } from "./scatterplot.js";
import { drawCircularPacking } from "./piechart.js";

export function drawLegend(color) {
    // Draw svg figure for legend
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
export function defineValuesCountries(dataset, years) {
    var minYear = years[0]
    var maxYear = years[1]

    // Sort ratings per country
    var valuesCountries = {};
    var points;
    var countryCode;
    var points;
    for (var i in dataset) {
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
export function drawMap(dataset, years, country, svgScatter, svgCirclePacking) {
    var values;
    var data = defineValuesCountries(dataset, years);
    // Draw datamap
    var basic = new Datamap({
        element: document.getElementById("container"),
        fills: { defaultFill: '#CDCCCC' },
        data: data,
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
        },
        // Draw barchart when clicked on country
        done: function(datamap) {
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
                values = data[geo.id];
                if (values != undefined) {
                    window.country = data[geo.id]['country'];
                    drawScatter(dataset, years, window.country, window.variety, svgScatter);
                    drawCircularPacking(dataset, years, window.country, svgScatter, svgCirclePacking);   
                }
            })
        }   
    });

  }