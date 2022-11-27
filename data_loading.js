const scatterplot_path = "src_data/us-states.json";
const heatmap_path = "processed_data/ChoroplethMapData.csv";
const histogram_path = "processed_data/BarChartData.csv";

var margin = { top: 20, right: 50, bottom: 20, left: 50 },
  width = 600 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

var state = "";

// There are two ways in d3 to deal with asynchronous behavior in D3
// d3.queue
d3.queue()
  .defer(d3.csv, choroplethMap_path)
  .defer(d3.json, states_path)
  .await(data_load);

function data_load(error, choroplethMap_data, states) {
  if (error) throw error;
  drawChoropleMap(choroplethMap_data, states, margin, width, height);
}

// callback function for d3 data loding function
d3.csv(barChart_path, function (error, barChart_data) {
  if (error) throw error;
  drawbarChart(barChart_data, margin, width, height, state);
});

d3.csv(pieChart_path, function (error, pieChart_data) {
  if (error) throw error;
  drawPieChart(pieChart_data, margin, width, height, state);
});

function updatePage(state) {
  d3.csv(barChart_path, function (error, barChart_data) {
    if (error) throw error;
    d3.select('#bar_chart').select("svg").remove();
    drawbarChart(barChart_data, margin, width, height, state);
  });

  d3.csv(pieChart_path, function (error, pieChart_data) {
    if (error) throw error;
    d3.select('#pie_chart').select("svg").remove();
    drawPieChart(pieChart_data, margin, width, height, state);
  });
}

// var data = [];
// d3.csv(pieChart_path, function(d) {
//     data = d;
//     console.log(data);
// })
