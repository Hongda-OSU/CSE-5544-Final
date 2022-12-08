function drawHistogram(histogram_data, margin, width, height) {
  var svg = d3
    .select("#histogram")
    .append("svg")
    .attr("width", width + margin.left * 2 + margin.right * 2)
    .attr("height", height + margin.top * 2 + margin.bottom * 4)
    .append("g")
    .attr("transform", "translate(" + margin.left * 2 + "," + margin.top + ")");

  // ----------- Find Maximum ----------
  //   var maximum = d3.max(histogram_data, function (d) {
  //     // make object into an array like
  //     var array = Object.entries(d);
  //     // filter the location information
  //     array = array.filter(function (newd) {
  //       return newd[0] != "location";
  //     });
  //     // get the maximum of filtered array
  //     var maximumArray = d3.max(array, function (newd) {
  //       return +newd[1];
  //     });
  //     return +maximumArray;
  //   });

  // ----------- X AXIS ----------------
  var x = d3
    .scaleBand()
    .domain([
      "avg_shake_intensity",
      "avg_sewer_and_water",
      "avg_roads_and_bridges",
      "avg_power",
      "avg_medical",
      "avg_buildings",
    ])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  // Fix the axis font size
  d3.selectAll("g").style("font-size", "9px");

  // ----------- Y AXIS ----------------
  var y = d3.scaleLinear().domain([0, 10]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // ---------- Dropdown Config ----------------
  // Set the drop down option content
  var allLocation = [
    "Location 1",
    "Location 2",
    "Location 3",
    "Location 4",
    "Location 5",
    "Location 6",
    "Location 7",
    "Location 8",
    "Location 9",
    "Location 10",
    "Location 11",
    "Location 12",
    "Location 13",
    "Location 14",
    "Location 15",
    "Location 16",
    "Location 17",
    "Location 18",
    "Location 19",
  ];
  // Initialize the buttons
  var dropdownButtons = d3.select("#histogram").append("select");
  dropdownButtons
    .selectAll("option")
    .data(allLocation)
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    })
    .attr("value", function (d, i) {
      return i + 1;
    });

  var formatter = d3.format(".2f");

  var tooltip = d3
    .select("#histogram")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  var mouseover = function (d) {
    tooltip.style("opacity", 1);
  };
  var mousemove = function (d) {
    tooltip.html("Value: " + formatter(d[1]));
    tooltip
      .style("left", d3.event.pageX + 50 + "px")
      .style("top", d3.event.pageY + "px");
  };
  var mouseleave = function (d) {
    tooltip.style("opacity", 0);
  };

  // ---------- histograms ------------

  var histogram = svg.append("g").attr("class", "histogram");
  histogram
    .attr("id", "rectangles")
    .selectAll("rect")
    .data(function () {
      // filter data with wanted location
      var filteredData = histogram_data.filter(function (d) {
        return d["location"] == 1;
      });
      // convert the filtered data into an array
      var filteredDataEntry = Object.entries(filteredData[0]);
      // filter the data again so it do not have "location"
      filteredDataEntry = filteredDataEntry.filter(function (d) {
        return d[0] != "location";
      });
      return filteredDataEntry;
    })
    .enter()
    .append("rect")
    .attr("transform", function (d) {
      return "translate(" + (x(d[0]) + x.bandwidth() / 4) + "," + y(d[1]) + ")";
    })
    .attr("width", x.bandwidth() / 2)
    .attr("height", function (d) {
      return height - y(d[1]);
    })
    .attr("fill", "#1870d5")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // Update the histogram
  function updateHistogram(newLocation) {
    // clear the old histogram
    svg.selectAll("#rectangles").remove();
    // draw the new one
    svg
      .append("g")
      .attr("id", "rectangles")
      .selectAll("rect")
      .data(function () {
        // filter data with wanted location
        var filteredData = histogram_data.filter(function (d) {
          return d["location"] == newLocation;
        });
        // convert the filtered data into an array
        var filteredDataEntry = Object.entries(filteredData[0]);
        // filter the data again so it do not have "location"
        filteredDataEntry = filteredDataEntry.filter(function (d) {
          return d[0] != "location";
        });
        return filteredDataEntry;
      })
      .enter()
      .append("rect")
      .attr("transform", function (d) {
        return (
          "translate(" + (x(d[0]) + x.bandwidth() / 4) + "," + y(d[1]) + ")"
        );
      })
      .attr("width", x.bandwidth() / 2)
      .attr("height", function (d) {
        return height - y(d[1]);
      })
      .attr("fill", "#1870d5")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  }

  // Turn on the effect
  dropdownButtons.on("change", function () {
    // get the slected value
    var selected = d3.select(this).property("value");
    // update the histogram
    updateHistogram(selected);
  });

  // Add Title
  svg
    .append("text")
    .attr("x", margin.left * 1.5)
    .attr("y", 0)
    .style("fill", "black")
    .style("font-size", 16)
    .style("font-family", "sans-serif")
    .text("Average Earthquake intensity and Infrastructure damage");
}
