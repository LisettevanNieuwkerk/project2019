/* Function to calculate min and max value*/
export function minMax(data, value) {
    var current;
    var max;
    var min;
    var first = true;
  
    for (var c in data) {
        current = value(data, c);
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


/* Scatterplot /
/* Function to group wine by price and quality*/
export function groupWine(dataset, years) {
    country = window.country;
    variety = window.variety;
    var minYear = years[0];
    var maxYear = years[1];

    var groupedWines = {};
    for (var i in dataset) {
        if (dataset[i]['year']>= minYear && dataset[i]['year'] <= maxYear) {
            var key = [dataset[i]['points'], dataset[i]['price']]
            if (country == 'All') {
                if (variety == 'All') {
                    add_to_dictScatter(dataset, groupedWines, key, i);
                }
                else {
                    if (dataset[i]['variety'] == variety) {
                        add_to_dictScatter(dataset, groupedWines, key, i);
                    }    
                }
            }
            else {
                if (dataset[i]['country'] == country) {
                    if (variety == 'All') {
                        add_to_dictScatter(dataset, groupedWines, key, i);
                    }
                    else {
                        if (dataset[i]['variety'] == variety) {
                            add_to_dictScatter(dataset, groupedWines, key, i);
                        }    
                    }
                }
            }     
        }

    }
    return groupedWines 
}

/* Add values to dict*/
function add_to_dictScatter(dataset, groupedWines, key, i) {
    if (!groupedWines.hasOwnProperty(key)) {
        groupedWines[key] = [{ title : dataset[i]['title']}]
    }
    else {
        groupedWines[key].push({ title : dataset[i]['title']})
    }
}


/* CircularPacking */
/* Get variety values*/
export function getVarietyValues(dataset, years) {
    var country = window.country;
    var minYear = years[0];
    var maxYear = years[1];

    var varietyValues = {};
    for (var i in dataset) {
        if (dataset[i]['year']>= minYear && dataset[i]['year'] <= maxYear) {
            var variety = dataset[i]['variety']; 
            if (country == 'All') {
                add_to_dictCircular(dataset, varietyValues, variety, i)
            }
            else {
                if (dataset[i]['country'] == country) {
                    add_to_dictCircular(dataset, varietyValues, variety, i)
                }
            }
        }
    }
    return varietyValues;
}

/* Add values to dict*/
function add_to_dictCircular(dataset, varietyValues, variety, i) {
    if (!varietyValues.hasOwnProperty(variety)) {
        var grapeType = dataset[i]['grapeType']
        varietyValues[variety] = {amount :  1, grapeType : grapeType }
    }
    else {
        varietyValues[variety]['amount'] += 1
    }
}


/* Datamaps */
/* Define values per country */
export function defineValuesCountries(dataset, years) {
    // Sort ratings per country
    var minYear = years[0];
    var maxYear = years[1];
    var valuesCountries = {};
    var points;
    var countryCode;
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
            fillColor = '#cbc9e2';
        }
        else if (avg >= 86 && avg < 89) {
            fillColor = '#9e9ac8';
        }
        else {
            fillColor = '#6a51a3';
        }

        // Add values to dict
        valuesCountries[countryCode]['points'] = avg.toFixed(2);
        valuesCountries[countryCode]['fillColor'] = fillColor;
        valuesCountries[countryCode]['totalReviews'] = totalReviews;
    }
    return valuesCountries;
}