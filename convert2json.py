# Name: Lisette van Nieuwkerk
# Student number: 10590919
"""
Convert csv with data to json file
"""

import pandas as pd
import csv
from contextlib import closing
import json
import numpy as np


INPUT_FILE1 = 'data/wine-reviews-130.csv'
INPUT_FILE2 = 'data/countrycode.txt'
OUTPUT_JSON1 = 'data/wine-reviews.json'
OUTPUT_JSON2 = 'data/countrycode.json'


if __name__ == "__main__":
    # Read text file
    country_codes = []
    with open(INPUT_FILE2, "r") as infile:
        for line in infile:
            line = line.replace('\n', ''). replace(', ', ' ,')
            line = line.split(',')
            last = len(line[0]) - 1
            country_codes.append({'country' : line[0][4:last], 'code' : line[0][:3]})

    # Read csv into dataframe
    df = pd.read_csv(INPUT_FILE1)

    # Filter columns, empty values and duplicates
    columns = ['country', 'description', 'points', 'price', 'title', 'variety']
    df = df.filter(items=columns)
    df = df.dropna()
    df = df.drop_duplicates()

    # Append countrycodes to dataframe
    codes = []
    for i in df['country']:
        code = np.nan
        country = i

        if i == "US":
            country = "United States"

        if i == "England":
            country = "United Kingdom"
        
        for j in range(len(country_codes)):
            if (country == country_codes[j]['country']):
                code = country_codes[j]['code']
                break
        
        codes.append(code)

    df['countryCode'] = codes

    df = df.dropna()
    print(df)


    output1 = df.to_json(orient='records')

    with open(OUTPUT_JSON1, 'w') as j:
        j.write(output1)



    #output2 = json.dumps(output2)

    #with open(OUTPUT_JSON2, 'w') as h:
    #    h.write(output2)

