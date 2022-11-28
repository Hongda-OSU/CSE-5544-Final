function drawHistogram(histogram_data, margin, width, height) {
    var svg = d3
      .select("#histogram")
      .append("svg")
      .attr("width", width + margin.left * 2 + margin.right * 2)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left / 5 + "," + margin.top + ")");

}