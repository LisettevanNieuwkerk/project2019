# project2019
* Programmeerproject 2019
* Lisette van Nieuwkerk
* 10590919

1. Problem statement
  * Problem: Obtain information about the wine production in countries, concerning the amount, prices, grape types and quality over the years. The product will help people discover where the best quality wines are produced over the years. As well as which wines have the best price-quality ratio over the years, where they come from and which grape type is used.
  * Target audience: People who are interested in wine

2. Solution
  * Show wine production world wide and give an overview of quality, price, grape type and descriptions of wines per country over the years.
  * Visual sketch
  ![Image 1](doc/part_1.png)
  ![Image 2](doc/part_2.png)
  * Main features:
    * MVP: worldmap + piechart + scatterplot
    * Optional: barchart + word cloud

3. Prerequisites
  * Data sources: https://www.kaggle.com/zynicide/wine-reviews/downloads/wine-reviews.zip/4#winemag-data-130k-v2.csv
  * External components: d3.js, datamaps.js, d3-tip
  * Similar visualisation: https://public.tableau.com/s/gallery/asylum-seekers-europe
      * Connect a interactive world map to charts and click to update charts.
  * Possible technical problems: Linking all charts properly to each other and update by clicking. Also fit data (130.000 reviews) in charts.
