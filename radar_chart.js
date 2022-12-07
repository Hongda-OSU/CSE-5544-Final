function drawRadarChart(
  radarchart_data,
  margin,
  width,
  height,
  selected_locations
) {
  var svg = d3
    .select("#radar_chart")
    .append("svg")
    .attr("width", width + 300) //800
    .attr("height", height + 190) // 600
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 40 + ")");

  var w = 500,
    h = 500;

  var processed_data = [];
  var axes = [
    "sewer_and_water",
    "roads_and_bridges",
    "power",
    "medical",
    "buildings",
  ];
  var locations = Array.from({ length: 19 }, (_, i) => i + 1); // [1..19]

  selected_locations.forEach((location) => {
    data = [];
    axes.forEach((axis) => {
      data.push({ axis: axis, value: radarchart_data[location - 1][axis] });
    });
    processed_data.push(data);
  });

  var cfg = {
    radius: 5,
    w: 500,
    h: 500,
    factor: 1,
    factorLegend: 0.85,
    levels: 6,
    radians: 2 * Math.PI,
    opacityArea: 0.5,
    ToRight: 5,
    TranslateX: 80,
    TranslateY: 30,
    ExtraWidthX: 300,
    ExtraWidthY: 100,
  };

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

  var maxValue = Math.max(
    0.6,
    d3.max(processed_data, function (data) {
      return d3.max(
        data.map(function (d) {
          return d.value;
        })
      );
    })
  );

  var allAxis = processed_data[0].map(function (i, j) {
    return i.axis;
  });
  var total = allAxis.length;
  var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
  var Format = d3.format("%");

  var tooltip;

  var text = svg
    .append("text")
    .attr("class", "title")
    .attr("transform", "translate(110,0)")
    .attr("x", w - 70)
    .attr("y", 10)
    .attr("font-size", "12px")
    .attr("fill", "#404040")
    .text("Locations:");

  //Initiate Legend
  var legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 200)
    .attr("transform", "translate(110,20)");

  //Create colour squares
  legend
    .selectAll("rect")
    .data(locations)
    .enter()
    .append("rect")
    .attr("x", w - 65)
    .attr("y", function (d, i) {
      return i * 20;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function (d) {
      return color(d);
    });

  //Create text next to squares
  legend
    .selectAll("text")
    .data(locations)
    .enter()
    .append("text")
    .attr("x", w - 52)
    .attr("y", function (d, i) {
      return i * 20 + 9;
    })
    .attr("font-size", "11px")
    .attr("fill", "#737373")
    .text(function (d) {
      return d;
    });

  //Checkbox for interaction
  locations.forEach((location) => {
    var checkBox = CheckBox();
    checkBox
      .x(width + 80)
      .y(margin.top + (location - 1) * margin.top)
      .checked(selected_locations.includes(location) ? true : false)
      .clickEvent(() => {
        this.checked;
        redrawRadarChart(location);
      });
    svg.call(checkBox);
  });

  //Circular segments
  for (var j = 0; j < cfg.levels - 1; j++) {
    var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
    svg
      .selectAll(".levels")
      .data(allAxis)
      .enter()
      .append("svg:line")
      .attr("x1", function (d, i) {
        return (
          levelFactor * (1 - cfg.factor * Math.sin((i * cfg.radians) / total))
        );
      })
      .attr("y1", function (d, i) {
        return (
          levelFactor * (1 - cfg.factor * Math.cos((i * cfg.radians) / total))
        );
      })
      .attr("x2", function (d, i) {
        return (
          levelFactor *
          (1 - cfg.factor * Math.sin(((i + 1) * cfg.radians) / total))
        );
      })
      .attr("y2", function (d, i) {
        return (
          levelFactor *
          (1 - cfg.factor * Math.cos(((i + 1) * cfg.radians) / total))
        );
      })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-opacity", "0.75")
      .style("stroke-width", "0.3px")
      .attr(
        "transform",
        "translate(" +
          (cfg.w / 2 - levelFactor) +
          ", " +
          (cfg.h / 2 - levelFactor) +
          ")"
      );
  }

  //Text indicating at what % each level is
  for (var j = 0; j < cfg.levels; j++) {
    var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
    svg
      .selectAll(".levels")
      .data([1]) //dummy data
      .enter()
      .append("svg:text")
      .attr("x", function (d) {
        return levelFactor * (1 - cfg.factor * Math.sin(0));
      })
      .attr("y", function (d) {
        return levelFactor * (1 - cfg.factor * Math.cos(0));
      })
      .attr("class", "legend")
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .attr(
        "transform",
        "translate(" +
          (cfg.w / 2 - levelFactor + cfg.ToRight) +
          ", " +
          (cfg.h / 2 - levelFactor) +
          ")"
      )
      .attr("fill", "#737373")
      .text(Format(((j + 1) * maxValue) / cfg.levels));
  }
  i = 0;
  series = selected_locations[i];

  var axis = svg
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis
    .append("line")
    .attr("x1", cfg.w / 2)
    .attr("y1", cfg.h / 2)
    .attr("x2", function (d, i) {
      return (
        (cfg.w / 2) * (1 - cfg.factor * Math.sin((i * cfg.radians) / total))
      );
    })
    .attr("y2", function (d, i) {
      return (
        (cfg.h / 2) * (1 - cfg.factor * Math.cos((i * cfg.radians) / total))
      );
    })
    .attr("class", "line")
    .style("stroke", "grey")
    .style("stroke-width", "1px");

  axis
    .append("text")
    .attr("class", "legend")
    .text(function (d) {
      return d;
    })
    .style("font-family", "sans-serif")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "1.5em")
    .attr("transform", function (d, i) {
      return "translate(0, -10)";
    })
    .attr("x", function (d, i) {
      return (
        (cfg.w / 2) *
          (1 - cfg.factorLegend * Math.sin((i * cfg.radians) / total)) -
        60 * Math.sin((i * cfg.radians) / total)
      );
    })
    .attr("y", function (d, i) {
      return (
        (cfg.h / 2) * (1 - Math.cos((i * cfg.radians) / total)) -
        20 * Math.cos((i * cfg.radians) / total)
      );
    });

  processed_data.forEach(function (y, x) {
    dataValues = [];
    svg.selectAll(".nodes").data(y, function (j, i) {
      dataValues.push([
        (cfg.w / 2) *
          (1 -
            (parseFloat(Math.max(j.value, 0)) / maxValue) *
              cfg.factor *
              Math.sin((i * cfg.radians) / total)),
        (cfg.h / 2) *
          (1 -
            (parseFloat(Math.max(j.value, 0)) / maxValue) *
              cfg.factor *
              Math.cos((i * cfg.radians) / total)),
      ]);
    });

    dataValues.push(dataValues[0]);
    svg
      .selectAll(".area")
      .data([dataValues])
      .enter()
      .append("polygon")
      .attr("class", "radar-chart-serie" + series)
      .style("stroke-width", "2px")
      .style("stroke", color(series))
      .attr("points", function (d) {
        var str = "";
        for (var pti = 0; pti < d.length; pti++) {
          str = str + d[pti][0] + "," + d[pti][1] + " ";
        }
        return str;
      })
      .style("fill", function (j, i) {
        return color(series);
      })
      .style("fill-opacity", cfg.opacityArea)
      .on("mouseover", function (d) {
        z = "polygon." + d3.select(this).attr("class");
        svg.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
        svg.selectAll(z).transition(200).style("fill-opacity", 0.7);
      })
      .on("mouseout", function () {
        svg
          .selectAll("polygon")
          .transition(200)
          .style("fill-opacity", cfg.opacityArea);
      });
    i++;
    series = selected_locations[i];
  });

  j = 0;
  series = selected_locations[j];

  processed_data.forEach(function (y, x) {
    svg
      .selectAll(".nodes")
      .data(y)
      .enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie" + series)
      .attr("r", cfg.radius)
      .attr("alt", function (j) {
        return Math.max(j.value, 0);
      })
      .attr("cx", function (j, i) {
        dataValues.push([
          (cfg.w / 2) *
            (1 -
              (parseFloat(Math.max(j.value, 0)) / maxValue) *
                cfg.factor *
                Math.sin((i * cfg.radians) / total)),
          (cfg.h / 2) *
            (1 -
              (parseFloat(Math.max(j.value, 0)) / maxValue) *
                cfg.factor *
                Math.cos((i * cfg.radians) / total)),
        ]);
        return (
          (cfg.w / 2) *
          (1 -
            (Math.max(j.value, 0) / maxValue) *
              cfg.factor *
              Math.sin((i * cfg.radians) / total))
        );
      })
      .attr("cy", function (j, i) {
        return (
          (cfg.h / 2) *
          (1 -
            (Math.max(j.value, 0) / maxValue) *
              cfg.factor *
              Math.cos((i * cfg.radians) / total))
        );
      })
      .attr("data-id", function (j) {
        return j.axis;
      })
      .style("fill", color(series))
      .style("fill-opacity", 0.9)
      .on("mouseover", function (d) {
        newX = parseFloat(d3.select(this).attr("cx")) - 10;
        newY = parseFloat(d3.select(this).attr("cy")) - 5;

        tooltip
          .attr("x", newX)
          .attr("y", newY)
          .text(Format(d.value))
          .transition(200)
          .style("opacity", 1);

        z = "polygon." + d3.select(this).attr("class");
        svg.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
        svg.selectAll(z).transition(200).style("fill-opacity", 0.7);
      })
      .on("mouseout", function () {
        tooltip.transition(200).style("opacity", 0);
        svg
          .selectAll("polygon")
          .transition(200)
          .style("fill-opacity", cfg.opacityArea);
      })
      .append("svg:title")
      .text(function (j) {
        return Math.max(j.value, 0);
      });

    j++;
    series = selected_locations[i];
  });
  //Tooltip
  tooltip = svg
    .append("text")
    .style("opacity", 0)
    .style("font-family", "sans-serif")
    .style("font-size", "13px");
}
