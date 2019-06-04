//Name: Lisette van Nieuwkerk
//Studentnumber: 10590919

var fileName = "data/wine-reviews.json";
var countryCodes = "data/countrycode.json";

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
          .text("Average life satisfaction");
  
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

/* Draw datamap */
function drawMap(dataset) {
    var values;
  
    // Draw datamap
    var basic = new Datamap({
      element: document.getElementById("container"),
      fills: { defaultFill: '#b2e2e2' },
      data: dataset   
    });
  }

window.onload = function() {

    Promise.all([
        d3v5.json(fileName),
        d3v5.json(countryCodes)
    ]).then(function(data) {
        // Set values
        var dataset = data[0];
        var codes = data[1];

        // Set color scale for map
        var color = d3v5.scaleOrdinal()
        .domain(['No data', 'Lower than 5.5', 'Between 5.5 and 7.0', '7.0 or higher'])
        .range(['#b2e2e2','#66c2a4','#2ca25f', '#006d2c']);

        // Create empty div for datamap in document
        var datamap = document.createElement('div');
        datamap.setAttribute('id', 'container');
        document.body.appendChild(datamap);


        // Calculate average
        var scores = {};
        var country;
        var points;
        
        for (i in dataset) {
            country = dataset[i]['country'];
            points = dataset[i]['points'];

            if (!scores.hasOwnProperty(country)) {
                scores[country] = [points]
            }
            else {
                scores[country].push(points);
            }
        }

        var newDataset = []
        var amount;
        let sum;
        let avg;
        var code = null; 
        for (i in scores) {
            country = i;
            
            amount = scores[i].length;

            sum = scores[i].reduce((previous, current) => current += previous);
            avg = sum / amount;

            newDataset.push({country : country, average: avg, amount : amount})
        }


        // Draw legend of datamap
        drawLegend(color);

        // drawmap
        drawMap(dataset);

    });
};