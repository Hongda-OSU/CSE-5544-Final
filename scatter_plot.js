function drawScatterPlot(scatterplot_data, margin, width, height) {
  var svg = d3
    .select("#scatter_plot")
    .append("svg")
    .attr("width", width + margin.left * 2 + margin.right * 2)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left / 5 + "," + margin.top + ")");

  var times = d3
    .map(scatterplot_data, function (d) {
      return d.time;
    })
    .keys();
}
