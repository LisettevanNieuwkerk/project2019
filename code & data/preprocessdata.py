# Name: Lisette van Nieuwkerk
# Student number: 10590919
"""
Preprocess data in python
"""

import pandas as pd
import csv
from contextlib import closing
import json
import numpy as np
import re
from requests import get
from requests.exceptions import RequestException
from bs4 import BeautifulSoup

TARGET_URL = "https://en.wikipedia.org/wiki/List_of_grape_varieties#White_grapes"
BACKUP_HTML = 'data/varieties.html'
OUTPUT_CSV = 'varieties.csv'

INPUT_FILE1 = 'data/wine-reviews-130.csv'
INPUT_FILE2 = 'data/countrycode.txt'
OUTPUT_JSON = 'data/wine-reviews.json'

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None

def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)

def extract_varieties(dom):
    """
    Extract grape type of varieties from dom
    """
    red_grapes = []
    white_grapes = []

    red = True
    for table in dom.find_all('table', limit=2):
        tablebody = table.find('tbody')
        for row in tablebody.find_all('tr'):
            for varietyname in row.find_all('td', limit=1):
                varieties = varietyname.get_text().replace('\n', '')
                varieties = re.split(' / |, ',varieties)
                if varieties != ['']:
                    if red == True:
                        red_grapes += varieties
                    else:
                       white_grapes += varieties
        red = False


    return [red_grapes, white_grapes]

if __name__ == "__main__":
    # Get html page and write backup file
    html = simple_get(TARGET_URL)

    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Garse the HTML file into a ;DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    grape_types = extract_varieties(dom)
    red_grapes = grape_types[0]
    white_grapes = grape_types[1]

    # Gemove varieties who are both red and white
    for white_grape in white_grapes:
        if white_grape in red_grapes:
            white_grapes.remove(white_grape)
            red_grapes.remove(white_grape)

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

    # Filter columns, empty values, duplicates
    columns = ['country', 'description', 'points', 'price', 'title', 'variety']
    df = df.filter(items=columns)
    df = df.drop_duplicates()

    # Append grapetype of variety to dataframe
    listed_grapes = []

    for variety in df['variety']:
        grape_type = np.nan
        found = False

        for red_grape in red_grapes:
            if str(red_grape).lower() in str(variety).lower():
                found = True
                grape_type = 'red'
                break
        
        if found == False:
            for white_grape in white_grapes:
                if str(white_grape).lower() in str(variety).lower():
                    grape_type = 'white'
                    break

        if grape_type != grape_type:
            if 'red' in str(variety).lower() or 'carmenère' in str(variety).lower() or 'g-s-m' in str(variety).lower() or 'mencía' in str(variety).lower() or 'norton' in str(variety).lower():
                grape_type = 'red'
            if 'white' in str(variety).lower() or 'blanc' in str(variety).lower():
                grape_type = 'white'

        
        listed_grapes.append(grape_type)

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


    # Append grape type, years and countrycode to dataframe
    df['grapeType'] = listed_grapes
    df['year'] = listed_years
    df['countryCode'] = listed_codes

    # Drop empty values and change year to int
    df = df.dropna()
    df['year'] = df['year'].astype(np.int64)

    # Write df to json
    output = df.to_json(orient='records')
    with open(OUTPUT_JSON, 'w') as j:
        j.write(output)
