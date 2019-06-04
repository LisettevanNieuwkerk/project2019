# DESIGN project2019

1. Data sources
    * https://unstats.un.org/unsd/tradekb/Knowledgebase/Country-Code
    * https://www.kaggle.com/zynicide/wine-reviews/downloads/wine-reviews.zip/4#winemag-data-130k-v2.csv
    * The wine reviews will be transformed into a pandas dataframe and be put into a json file. The country codes will be read from a text file. Both will happen in Python. The years need to become part of the dataset and need to be extracted from the titel, possibly the countrycode also need to be put in the objects of the dataset. Countrycodes are needed to link the countries in worldmap wit the data. After that the file will be read into javascript. 
    
2. Technical components
    * Worldmap
        * Needed: To link countries to codes and extract year of wines from title.
    * Piechart
        * Collect grape types and decide which amount put in remaining.
    * Scatterplot
    * Barchart (optional)
    * Wordcloud (optional)
        * Select words from description that descripe the wine, leave out general words(like 'and'/'or')

3. Plugins needed
    * https://d3js.org/d3.v5.min.js
    * https://d3js.org/d3.v3.min.js
    * //cdnjs.cloudflare.com/ajax/libs/topojson/1.6.9/topojson.min.js
    * //cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min.js
    * d3-tip