import pandas as pd
import numpy as np
import json

data = pd.read_csv('src_data/mc1-reports-data.csv', index_col=0)


class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)


def processLocations(data, locations):
    obj = {}
    for location in locations:
        obj[str(location)] = len(data[(data.location == location)])
    return obj


def processTimes(data, times, locations):
    list = []
    for time in times:
        df = data.loc[(data.time == time)]
        dict = {"time": time,
                "locations": processLocations(df.reset_index(), locations)}
        list.append(dict)
    return list


# scatterplot data
scatterplot_data = data
scatterplot_data.reset_index(inplace=True)
scatterplot_data.sort_values(
    by=['time'], inplace=True, ascending=True)
scatterplot_data = scatterplot_data.reset_index(drop=True)
times = scatterplot_data.time.unique()
locations = scatterplot_data.location.unique()
locations.sort()
dict = {"times": processTimes(scatterplot_data, times, locations)}
with open('processed_data/scatterplotData.json', 'w') as fp:
    json.dump(dict, fp, indent=4, cls=NpEncoder)
