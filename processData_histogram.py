import pandas as pd
data = pd.read_csv('src_data/mc1-reports-data.csv', index_col=0)


def getAvg(data, locations, keyword):
    list = []
    for location in locations:
        avg = data.loc[data['location'] == location, keyword].mean()
        list.append(avg)
    return list


# histogram data
histogram_data = data
histogram_data.fillna(0, inplace=True)
locations = histogram_data.location.unique()
avg_shake_intensity = getAvg(histogram_data, locations, "shake_intensity")
avg_sewer_and_water = getAvg(histogram_data, locations, "sewer_and_water")
avg_roads_and_bridges = getAvg(histogram_data, locations, "roads_and_bridges")
avg_power = getAvg(histogram_data, locations, "power")
avg_medical = getAvg(histogram_data, locations, "medical")
avg_buildings = getAvg(histogram_data, locations, "buildings")

data = {"location": locations,
        "avg_shake_intensity": avg_shake_intensity,
        "avg_sewer_and_water": avg_sewer_and_water,
        "avg_roads_and_bridges": avg_roads_and_bridges,
        "avg_power": avg_power,
        "avg_medical": avg_medical,
        "avg_buildings": avg_buildings}

df = pd.DataFrame(data)

df.to_csv(
    'processed_data/histogramData.csv', index=False)
