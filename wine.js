//Name: Lisette van Nieuwkerk
//Studentnumber: 10590919

import { drawMapAttributes, defineValuesCountries, drawMap } from "./parts/datamap.js";
import { drawScatterBasis, drawScatter } from "./parts/scatterplot.js";
import { drawCircularPackingBasis, getVarietyValues, drawCircularPacking } from "./parts/circularpacking.js";

var fileName = "data/wine-reviews.json";

/* Load page */
window.onload = function() {
    d3v5.json(fileName).then(function(dataset){
        // Set variables
        window.country = 'all';
        window.variety = 'all';

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

        // Create tooltip
        var tooltip = d3v5.select("body").append("div")
        .attr("class", "tooltip");

        // Draw map, legend, scatterplot and circlepacking
        var svgScatter = drawScatterBasis();
        var svgCirclePacking = drawCircularPackingBasis();
        drawMap(dataset, years, svgScatter, svgCirclePacking);
        drawMapAttributes();
        drawCircularPacking(dataset, years, svgScatter, svgCirclePacking,);
        drawScatter(dataset, years, window.variety, svgScatter, tooltip);

        // Button to select country
        var selectCountryButton = document.getElementById("selectCountryButton")
        selectCountryButton.onclick = function() {
            var selectedCountry = document.getElementById("selectedCountry");
            window.country = selectedCountry.options[selectedCountry.selectedIndex].text;
            drawCircularPacking(dataset, years, svgScatter, svgCirclePacking);
            drawScatter(dataset, years, window.variety, svgScatter); 
        }
        

        // Update visualisations by years
        slider.noUiSlider.on('change.one', function (values) {
            // Get new range from slider 
            years = [parseInt(values[0]), parseInt(values[1])] 
            
            // Remove old worldmap
            var children = document.getElementById("mapcontainer");
            while (children.firstChild) {
                children.removeChild(children.firstChild);
            }

            // Update map, circular packing and scatter
            drawMap(dataset, years, svgScatter, svgCirclePacking);
            drawCircularPacking(dataset, years, svgScatter, svgCirclePacking);
            drawScatter(dataset, years, window.variety, svgScatter);   

        });
    });
};