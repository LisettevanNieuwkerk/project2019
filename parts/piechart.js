/* Draw containerscattter */
export function drawPieBasis() {

    // set the dimensions and margins of the graph
    var width = 450
    var height = 450
    var margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

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

export function drawPieChart(dataset, country, years, svg) {
    var minYear = years[0]
    var maxYear = years[1]

    var varietyValues = getVarietyValues(dataset, country, minYear, maxYear);

    //for (i in varietyValues) {
    //    varietyValues[i];
    //}

    // set the color scale
    //var color = d3v5.scaleOrdinal()
    //.domain(data)
    //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

    //var pie = d3.layout.pie() 
    //        .value(function(d) { return d.amount; });

}



