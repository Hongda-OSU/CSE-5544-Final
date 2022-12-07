import pandas as pd
data = pd.read_csv('src_data/mc1-reports-data.csv', index_col=0)


def getRadarValue(data, locations, keyword):
    list = []
    for location in locations:
        avg = data.loc[data['location'] == location, keyword].mean()
        list.append(round(avg / 10, 2))
    return list


# histogram data
radarchart_data = data
radarchart_data.fillna(0, inplace=True)
locations = radarchart_data.location.unique()
sewer_and_water = getRadarValue(radarchart_data, locations, "sewer_and_water")
roads_and_bridges = getRadarValue(radarchart_data, locations, "roads_and_bridges")
power = getRadarValue(radarchart_data, locations, "power")
medical = getRadarValue(radarchart_data, locations, "medical")
buildings = getRadarValue(radarchart_data, locations, "buildings")

data = {"location": locations,
        "sewer_and_water": sewer_and_water,
        "roads_and_bridges": roads_and_bridges,
        "power": power,
        "medical": medical,
        "buildings": buildings}

df = pd.DataFrame(data)

df.to_csv(
    'processed_data/radarchartData.csv', index=False)
