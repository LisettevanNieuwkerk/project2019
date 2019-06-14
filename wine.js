//Name: Lisette van Nieuwkerk
//Studentnumber: 10590919

import { drawLegend, defineValuesCountries, drawMap } from "./parts/datamap.js";
import { minMax, groupWine, idled, drawScatterBasis, drawScatter } from "./parts/scatterplot.js";
import { drawCircularPackingBasis, getVarietyValues, drawCircularPacking } from "./parts/piechart.js";

var fileName = "data/wine-reviews.json";

/* Load page */
window.onload = function() {
    d3v5.json(fileName).then(function(dataset){
        // Set variables
        window.country = 'all';
        window.variety = 'all';

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

        // Draw map, legend, scatterplot and circlepacking
        var svgScatter = drawScatterBasis();
        var svgCirclePacking = drawCircularPackingBasis();
        drawMap(dataset, years, window.country, svgScatter, svgCirclePacking);
        drawLegend(color);
        drawCircularPacking(dataset, years, window.country, svgScatter, svgCirclePacking,);
        drawScatter(dataset, years, window.country, window.variety, svgScatter);
        

        // Update visualisations by years
        slider.noUiSlider.on('change.one', function (values) {
            // Get new range from slider 
            years = [parseInt(values[0]), parseInt(values[1])] 
            
            // Remove old worldmap
            var children = document.getElementById("container");
            while (children.firstChild) {
                children.removeChild(children.firstChild);
            }

            // Update map, circular packing and scatter
            drawMap(dataset, years, window.country, svgScatter, svgCirclePacking);
            drawCircularPacking(dataset, years, window.country, svgScatter, svgCirclePacking);
            drawScatter(dataset, years, window.country, window.variety, svgScatter);   

        });
    });
};