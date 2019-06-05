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


/* Calculate average rating per country */
function calculateAverages(dataset) {
    // Sort ratings per country
    var scores = {};
    var code;
    var points;
    for (i in dataset) {
        countryCode = dataset[i]['countryCode'];
        points = dataset[i]['points'];
        if (!scores.hasOwnProperty(countryCode)) {
            scores[countryCode] = [points];
        }
        else {
            scores[countryCode].push(points);
        }
    }

    // Calculate average per country
    var averages = []
    var amount;
    let sum;
    let avg;
    for (countryCode in scores) {   
        amount = scores[countryCode].length;
        sum = scores[countryCode].reduce((previous, current) => current += previous);
        avg = sum / amount;
        averages.push({countryCode : countryCode, average: avg, amount : amount})
    }

    return averages
}


/* Define color per country */
function defineColorsCountries(dataset) {

    var averages = calculateAverages(dataset)
    var colorsCountries = {};
    var color;
    // Define fill color for every country based on average rating
    for (country in averages) {
        if (averages[country].average < 86) {
            color = '#66c2a4';
        }
        else if (averages[country].average >= 86 && averages[country].average < 89) {
            color = '#2ca25f';
        }
        else {
            color = '#006d2c';
        }
        colorsCountries[averages[country].countryCode] =  {numberOfThings : averages[country].average, fillColor : color}
    }

    return colorsCountries;
}



/* Draw datamap */
function drawMap(dataset) {
    var values;
  
    // Draw datamap
    var basic = new Datamap({
      element: document.getElementById("container"),
      fills: { defaultFill: '#CDCCCC' },
      data: defineColorsCountries(dataset) 
    });
  }


/* Load page */
window.onload = function() {

    d3v5.json(fileName).then(function(dataset){

        // Set color scale for map
        var color = d3v5.scaleOrdinal()
        .domain(['No data', 'Lower than 5.5', 'Between 5.5 and 7.0', '7.0 or higher'])
        .range(['#b2e2e2','#66c2a4','#2ca25f', '#006d2c']);

        // Create empty div for datamap in document
        var datamap = document.createElement('div');
        datamap.setAttribute('id', 'container');
        document.body.appendChild(datamap);

        // Draw legend of datamap
        drawLegend(color);

        // drawmap
        drawMap(dataset);

    });
};