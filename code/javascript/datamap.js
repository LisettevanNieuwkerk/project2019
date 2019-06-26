import { drawScatter } from "./scatterplot.js";
import { drawCircularPacking } from "./circularpacking.js";
import { defineValuesCountries } from "./processdata.js";


/* Function to draw legend and title of map */
export function drawMapAttributes() {
    var mapcontainer = d3v5.select(".items--mapcontainer")
    
    // Title of map
    mapcontainer.append('text')
        .attr("class", "itemtitle")
        .attr("transform", "translate(0, 20)")
        .text("Worldwide wine map");

    // Set color scale for map
    var color = d3v5.scaleOrdinal()
        .domain(['No data', '> 86', '86 - 89', '< 89'])
        .range(['#d9d9d9','#cbc9e2','#9e9ac8', '#6a51a3']);

    // Draw svg figure for legend
    var width = 130;
    var height = 160;
    var legend = mapcontainer.append("svg")
        .attr("class", "legend")
        .attr("width", width)
        .attr("height", height);
  
    // Append title legend
    legend.append('text')
        .attr("class", "legendlabels")
        .attr("transform", "translate(0, 20)")
        .text("Average wine rating");

    // Append blocks legend
    var widthBlocks = 25;
    var heightBlocks = 30;
    var legend = legend.selectAll("legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
        var y = (i * 30) + 30;
        return "translate(0," + y + ")";
        });
    legend.append("rect")
        .attr("width", widthBlocks)
        .attr("height", heightBlocks)
        .style("fill", color);
  
    // Append text legend
    legend.append('text')
          .attr("class", "legendlabels")
          .attr("x", 35)
          .attr("y", 18)
          .text(function(d) { return d; });
}


/* Draw datamap */
export function drawMap(dataset, years, svgScatter, svgCircularPacking, tooltip) {
    var data = defineValuesCountries(dataset, years);

    // Add countries in data to option menu
    for (var i in data) {
        var option = document.createElement("option");
        option.text = data[i]['country'];
        document.getElementById("selectedCountry").add(option);
    }
    
    // Draw datamap
    var basic = new Datamap({
        element: document.getElementById("mapcontainer"),
        fills: { defaultFill: '#d9d9d9' },
        data: data,
        geographyConfig: {
        // Show desired information in tooltip
            popupTemplate: function(i, data) {
                // Don't show tooltip if country not present in dataset
                if (!data) { return ['<div class="hoverinfo">',
                'Country: <strong>'+ i.properties.name +'</strong><br>',
                '<strong>No data available</strong>',
                '</div>'].join('') };
                // Tooltip content
                return ['<div class="hoverinfo">',
                'Country: <strong>'+ data.country +'</strong><br>',
                'Average winerating: <strong>'+ data.points +'</strong><br>',
                'Total reviewed wines: <strong>'+ data.totalReviews+'</strong>',
                '</div>'].join('');
            }    
        },
        // Adapt scatterplot and circularpacking when clicked on country
        done: function(datamap) {
                datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
                if (data[geo.id] != undefined) {
                    window.country = data[geo.id]['country'];
                    drawScatter(dataset, years, svgScatter, tooltip, false);
                    drawCircularPacking(dataset, years, svgScatter, svgCircularPacking, tooltip, false);  
                }
            })
        }   
    });
    // Set global variabel
    window.basic = basic;
  }

  /* Update datamap */
  export function updateMap(dataset, years) {
    var data = defineValuesCountries(dataset, years);
    window.basic.updateChoropleth(data, {reset: true});
  }
