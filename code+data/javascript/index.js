//Name: Lisette van Nieuwkerk
//Studentnumber: 10590919

import { drawMapAttributes, drawMap, updateMap } from "./datamap.js";
import { drawScatterBasis, drawScatter } from "./scatterplot.js";
import { drawCircularPackingBasis, drawCircularPacking } from "./circularpacking.js";

var fileName = "./../data/wine-reviews.json";

/* Load page */
window.onload = function() {
    d3v5.json(fileName).then(function(dataset){
        // Set variables
        window.country = 'All';
        window.variety = 'All';
        window.basic;
        var firstScatter = true;

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

        // Insert years under slider
        document.getElementById("minYear").innerHTML = years[0];
        document.getElementById("maxYear").innerHTML = years[1];

        // Create tooltip
        var tooltip = d3v5.select("body").append("div")
        .attr("class", "tooltip");

        // Draw map, legend, scatterplot and circlepacking
        var svgScatter = drawScatterBasis();
        var svgCircularPacking = drawCircularPackingBasis();
        drawMap(dataset, years, svgScatter, svgCircularPacking, tooltip);
        drawMapAttributes();
        drawScatter(dataset, years, svgScatter, tooltip, firstScatter);
        drawCircularPacking(dataset, years, svgScatter, svgCircularPacking, tooltip);
        

        // Button to select country
        var selectCountryButton = document.getElementById("selectCountryButton")
        selectCountryButton.onclick = function() {
            firstScatter = false;
            var selectedCountry = document.getElementById("selectedCountry");
            window.country = selectedCountry.options[selectedCountry.selectedIndex].text;
            drawScatter(dataset, years, svgScatter, tooltip, firstScatter);
            drawCircularPacking(dataset, years, svgScatter, svgCircularPacking, tooltip);
        }
        
        // Update visualisations by changing years on slider
        slider.noUiSlider.on('change.one', function (values) {
            firstScatter = false;
            // Get new range from slider 
            years = [parseInt(values[0]), parseInt(values[1])] 

            // Insert years under slider
            document.getElementById("minYear").innerHTML = years[0];
            document.getElementById("maxYear").innerHTML = years[1];
            
            // Update map, circular packing and scatter
            updateMap(dataset, years);
            drawScatter(dataset, years, svgScatter, tooltip, firstScatter);
            drawCircularPacking(dataset, years, svgScatter, svgCircularPacking, tooltip);
        });
    });
};