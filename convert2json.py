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
import re


INPUT_FILE1 = 'data/wine-reviews-130.csv'
INPUT_FILE2 = 'data/countrycode.txt'
OUTPUT_JSON = 'data/wine-reviews.json'


if __name__ == "__main__":
    # Read text file with countrycodes
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
    df = df.drop_duplicates()

    # Append countrycodes to dataframe
    listed_codes = []
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

        listed_codes.append(code)

    # Get list of years from titles
    listed_years = []
    for title in df['title']:
        year = np.nan
        numbers = re.findall('\d+', title)
        
        # Check if one number in title between 1990 - 2017
        if len(numbers) == 1:
            possible_year = int(numbers[0])
            if possible_year >= 1990 and possible_year < 2017:
                year = possible_year

        # When more number look for years between 1990 - 2017
        else:
            first = True
            for number in numbers:
                if len(number) == 4:
                    possible_year = int(number)
                    if possible_year >= 1990 and possible_year < 2017:
                        # Select highest year
                        if first == True:
                            year = possible_year
                            first = False
                        else:
                            if possible_year > year:
                                year = possible_year
        listed_years.append(year)
    
    # Append years and countrycode to dataframe
    df['countryCode'] = listed_codes
    df['year'] = listed_years

    # Drop empty values
    df = df.dropna()
    df['year'] = df['year'].astype(np.int64)

    # Write to json
    output = df.to_json(orient='records')
    with open(OUTPUT_JSON, 'w') as j:
        j.write(output)
