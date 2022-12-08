function drawScatterPlot(
  scatterplot_data,
  margin,
  width,
  height,
  selected_locations
) {
  var svg = d3
    .select("#scatter_plot")
    .append("svg")
    .attr("width", width + margin.left * 2 + margin.right * 2)
    .attr("height", height + margin.top * 2 + margin.bottom * 2)
    .append("g")
    .attr("transform", "translate(" + margin.left * 2 + "," + margin.top + ")");

  var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");

  var x = d3
    .scaleTime()
    .domain(
      d3.extent(scatterplot_data, function (d) {
        return parseTime(d.time);
      })
    )
    .range([0, width]);

  var xAxis = svg
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")).ticks(5))
    .selectAll("text")
    .style("text-anchor", "center");

  var max = 0;
  selected_locations.forEach((location) => {
    temp_max = d3.max(scatterplot_data, function (d) {
      return +d["location" + location];
    });
    if (temp_max > max) {
      max = temp_max;
    }
  });

  var y = d3.scaleLinear().domain([0, max]).range([height, margin.top]).nice();

  var yAxis = svg.append("g").attr("class", "yAxis").call(d3.axisLeft(y));

  var locations = Array.from({ length: 19 }, (_, i) => i + 1);

  var report_data = [];

  scatterplot_data.map((d) => {
    selected_locations.forEach((location) => {
      report_data.push({
        Time: parseTime(d.time),
        Count: d["location" + location],
        Location: location,
      });
    });
  });

  var clip = svg
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  var scatter = svg.append("g").attr("clip-path", "url(#clip)");

  var zoom = d3
    .zoom()
    .scaleExtent([1, +Infinity])
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", updateChart);

  var color = d3
    .scaleOrdinal()
    .domain(locations)
    .range([
      "#1e77b4",
      "#ff7f0e",
      "#289f27",
      "#CC0605",
      "#9466bd",
      "#FFFF00",
      "#e275c1",
      "#7f7f7f",
      "#bbbc1b",
      "#13bdce",
      "#E55137",
      "#E6D690",
      "#721422",
      "#755C48",
      "#0A0A0A",
      "#CF3476",
      "#F5D033",
      "#BDECB6",
      "#EA899A",
    ]);

  scatter
    .selectAll(null)
    .data(report_data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.Time);
    })
    .attr("cy", function (d) {
      return y(d.Count);
    })
    .attr("r", 2)
    .style("fill", function (d) {
      return color(d.Location);
    });

  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(zoom);

  function updateChart() {
    // recover the new scale
    var newX = d3.event.transform.rescaleX(x);
    var newY = d3
      .scaleLinear()
      .domain([0, d3.event.transform.rescaleY(y).domain()[1]])
      .range([height, margin.top]);
    yAxis.call(d3.axisLeft(newY));

    scatter
      .selectAll("circle")
      .attr("cx", function (d) {
        if (!newX(d.Time)) {
          return;
        }
        return x(d.Time);
      })
      .attr("cy", function (d) {
        if (!newY(d.Count)) {
          return;
        }
        return newY(d.Count);
      });
  }

  svg
    .append("text")
    .attr("class", "text")
    .attr("x", margin.left * 3)
    .attr("y", 0)
    .style("font-size", 16)
    .style("font-family", "sans-serif")
    .text("Total number of reports by locations");

  var legends = svg
    .selectAll(".legend")
    .data(locations)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return (
        "translate(" + (width + margin.left) + "," + (i * 20 + margin.top) + ")"
      );
    });

  legends
    .append("circle")
    .attr("stroke-width", 2)
    .attr("fill", (d) => {
      return color(d);
    })
    .attr("r", 4);

  legends
    .append("text")
    .attr("dx", "1em")
    .attr("dy", ".35em")
    .style("font-size", 12)
    .text(function (d) {
      return d;
    });

  locations.forEach((location) => {
    var checkBox = CheckBox();
    checkBox
      .x(width + 80)
      .y(margin.top / 1.3 + (location - 1) * margin.top)
      .checked(selected_locations.includes(location) ? true : false)
      .clickEvent(() => {
        this.checked;
        redrawScatterPlot(location);
      });
    svg.call(checkBox);
  });
}
