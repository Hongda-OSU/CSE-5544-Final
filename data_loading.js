const scatterplot_path = "processed_data/scatterplotData.csv";
const heatmap_path = "processed_data/heatMapData.json";
const histogram_path = "processed_data/histogramData.csv";
const radarchart_path = "processed_data/radarchartData.csv";

var margin = { top: 20, right: 50, bottom: 20, left: 50 },
  width = 600 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

selected_locations = [2, 4, 6];

// callback function for d3 data loding function
d3.csv(scatterplot_path, function (error, scatterplot_data) {
  if (error) throw error;
  drawScatterPlot(scatterplot_data, margin, width, height);
});

d3.json(heatmap_path, function (error, heatmap_data) {
  if (error) throw error;
  drawHeatMap(heatmap_data, margin, width, height);
});

d3.csv(histogram_path, function (error, histogram_data) {
  if (error) throw error;
  drawHistogram(histogram_data, margin, width, height);
});

d3.csv(radarchart_path, function (error, radarchart_data) {
  if (error) throw error;
  drawRadarChart(radarchart_data, margin, width, height, selected_locations);
});

function resetScatterPlot() {
  d3.csv(scatterplot_path, function (error, scatterplot_data) {
    if (error) throw error;
    d3.select("#scatter_plot").select("svg").remove();
    drawScatterPlot(scatterplot_data, margin, width, height);
  });
}

function redrawRadarChart(location) {
  d3.csv(radarchart_path, function (error, radarchart_data) {
    if (error) throw error;
    if (!selected_locations.includes(location)) {
      selected_locations.push(location);
      selected_locations.sort();
    } else {
      selected_locations.splice(selected_locations.indexOf(location), 1);
      selected_locations.sort();
    }
    if (selected_locations.length === 0) {
      selected_locations = [location];
    }
    d3.select("#radar_chart").select("svg").remove();
    drawRadarChart(radarchart_data, margin, width, height, selected_locations);
  });
}
