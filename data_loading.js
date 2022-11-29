const scatterplot_path = "processed_data/scatterplotData.csv";
const heatmap_path = "processed_data/heatMapData.json";
const histogram_path = "processed_data/histogramData.csv";

var margin = { top: 20, right: 50, bottom: 20, left: 50 },
  width = 600 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;


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


// var data = [];
// d3.csv(pieChart_path, function(d) {
//     data = d;
//     console.log(data);
// })
