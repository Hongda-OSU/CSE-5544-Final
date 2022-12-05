function drawHeatMap(heatmap_data, margin, width, height) {
  var svg = d3
    .select("#heat_map")
    .append("svg")
    .attr("width", width + margin.left * 2 + margin.right * 2)
    .attr("height", height + margin.top * 2 + margin.bottom * 2)
    .append("g")
    .attr("transform", "translate(" + margin.left * 2 + "," + margin.top + ")");

  console.log(heatmap_data);
}
