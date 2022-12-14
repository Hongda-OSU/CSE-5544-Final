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


def processInformations(data, date):
    list = []
    for index, row in data.iterrows():
        time = date + "T" + row["time"]
        if len(list) != 0 and list[-1]['time'] == time:
            list[-1]['shake_intensity'] = (list[-1]
                                           ['shake_intensity'] + row["shake_intensity"]) / 2
            list[-1]['damage']['sewer_and_water'] = (
                list[-1]['damage']['sewer_and_water'] + row["sewer_and_water"]) / 2
            list[-1]['damage']['power'] = (
                list[-1]['damage']['power'] + row["power"]) / 2
            list[-1]['damage']['medical'] = (
                list[-1]['damage']['medical'] + row["medical"]) / 2
            list[-1]['damage']['buildings'] = (
                list[-1]['damage']['buildings'] + row["buildings"]) / 2
        else:
            damage = {"sewer_and_water": row["sewer_and_water"],
                      "roads_and_bridges": row["roads_and_bridges"],
                      "power": row["power"],
                      "medical": row["medical"],
                      "buildings": row["buildings"]}
            dict = {"time": time,
                    "shake_intensity": row["shake_intensity"],
                    "damage": damage
                    }
            list.append(dict)
    return list


def processDates(data, dates):
    list = []
    for date in dates:
        df = data.loc[(data.date == date)]
        dict = {"date": date, "information": processInformations(
            df.reset_index(), date)}
        list.append(dict)
    return list


def processLocations(data, locations):
    list = []
    for location in locations:
        df = data.loc[(data.location == location)]
        dates = df.date.unique()
        if ("2020-04-11" in dates):
            dates = np.delete(dates, -1)
        dict = {"location": location,
                "dates": processDates(df.reset_index(), dates)}
        list.append(dict)
    return list


# heatmap data
heatmap_data = data
heatmap_data.reset_index(inplace=True)
heatmap_data[['date', 'time']] = heatmap_data.time.str.split(
    ' ', n=1, expand=True)
heatmap_data = heatmap_data[['date', 'time', 'location', 'shake_intensity',
                             'sewer_and_water',  'roads_and_bridges', 'power', 'medical', 'buildings']]
heatmap_data.sort_values(
    by=['location', 'date', 'time'], inplace=True, ascending=True)
heatmap_data = heatmap_data.reset_index(drop=True)
heatmap_data.fillna(0, inplace=True)
locations = heatmap_data.location.unique()
dict = {"locations": processLocations(heatmap_data, locations)}
with open('processed_data/heatMapData.json', 'w') as fp:
    json.dump(dict, fp, indent=4, cls=NpEncoder)