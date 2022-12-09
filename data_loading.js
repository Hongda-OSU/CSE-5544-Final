const scatterplot_path = "processed_data/scatterplotData.csv";
const heatmap_path = "processed_data/heatMapData.json";
const histogram_path = "processed_data/histogramData.csv";
const radarchart_path = "processed_data/radarchartData.csv";

var margin = { top: 20, right: 50, bottom: 20, left: 50 },
  width = 600 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

selected_locations_radar = [2, 4, 6];
selected_locations_scatter = Array.from({ length: 19 }, (_, i) => i + 1);

// callback function for d3 data loding function
d3.csv(scatterplot_path, function (error, scatterplot_data) {
  if (error) throw error;
  drawScatterPlot(scatterplot_data, margin, width, height, selected_locations_scatter);
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
  drawRadarChart(radarchart_data, margin, width, height, selected_locations_radar);
});

function resetScatterPlot() {
  d3.csv(scatterplot_path, function (error, scatterplot_data) {
    if (error) throw error;
    d3.select("#scatter_plot").select("svg").remove();
    selected_locations_scatter =  Array.from({ length: 19 }, (_, i) => i + 1);
    drawScatterPlot(scatterplot_data, margin, width, height, selected_locations_scatter);
  });
}

function redrawRadarChart(location) {
  d3.csv(radarchart_path, function (error, radarchart_data) {
    if (error) throw error;
    if (!selected_locations_radar.includes(location)) {
      selected_locations_radar.push(location);
      selected_locations_radar.sort();
    } else {
      selected_locations_radar.splice(selected_locations_radar.indexOf(location), 1);
      selected_locations_radar.sort();
    }
    if (selected_locations_radar.length === 0) {
      selected_locations_radar = [location];
    }
    d3.select("#radar_chart").select("svg").remove();
    drawRadarChart(radarchart_data, margin, width, height, selected_locations_radar);
  });
}

  function redrawScatterPlot(location) {
    d3.csv(scatterplot_path, function (error, scatterplot_data) {
      if (error) throw error;
      if (!selected_locations_scatter.includes(location)) {
        selected_locations_scatter.push(location);
        selected_locations_scatter.sort();
      } else {
        selected_locations_scatter.splice(selected_locations_scatter.indexOf(location), 1);
        selected_locations_scatter.sort();
      }
      if (selected_locations_scatter.length === 0) {
        selected_locations_scatter = [location];
      }
      d3.select("#scatter_plot").select("svg").remove();
      drawScatterPlot(scatterplot_data, margin, width, height, selected_locations_scatter);
    });
}
