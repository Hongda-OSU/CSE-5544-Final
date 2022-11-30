import pandas as pd
import numpy as np

data = pd.read_csv('src_data/mc1-reports-data.csv', index_col=0)

def count(data, times, id):
    list = []
    df = data.loc[(data.location == id)]
    for time in times:
        list.append(len(df[(df.time == time)]))
    return list

# scatterplot data
scatterplot_data = data
scatterplot_data.reset_index(inplace=True)
scatterplot_data.sort_values(
    by=['time'], inplace=True, ascending=True)
scatterplot_data = scatterplot_data.reset_index(drop=True)
times = scatterplot_data.time.unique()
formated_times = times.astype(str)
formated_times = np.char.replace(formated_times, ' ', 'T')
locations = scatterplot_data.location.unique()
locations.sort()
data = {"time": formated_times,
        "location1": count(scatterplot_data, times, 1),
        "location2": count(scatterplot_data, times, 2),
        "location3": count(scatterplot_data, times, 3),
        "location4": count(scatterplot_data, times, 4),
        "location5": count(scatterplot_data, times, 5),
        "location6": count(scatterplot_data, times, 6),
        "location7": count(scatterplot_data, times, 7),
        "location8": count(scatterplot_data, times, 8),
        "location9": count(scatterplot_data, times, 9),
        "location10": count(scatterplot_data, times, 10),
        "location11": count(scatterplot_data, times, 11),
        "location12": count(scatterplot_data, times, 12),
        "location13": count(scatterplot_data, times, 13),
        "location14": count(scatterplot_data, times, 14),
        "location15": count(scatterplot_data, times, 15),
        "location16": count(scatterplot_data, times, 16),
        "location17": count(scatterplot_data, times, 17),
        "location18": count(scatterplot_data, times, 18),
        "location19": count(scatterplot_data, times, 19) }
df = pd.DataFrame(data)
df.to_csv(
    'processed_data/scatterplotData.csv', index=False)


