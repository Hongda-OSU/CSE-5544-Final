function drawHeatMap(heatmap_data, margin, width, height) {
  var svg = d3
    .select("#heat_map")
    .append("svg")
    .attr("width", width + margin.left * 2 + margin.right * 2)
    .attr("height", height + margin.top * 2 + margin.bottom * 2)
    .append("g")
    .attr("transform", "translate(" + margin.left * 2 + "," + margin.top + ")");

  // Assume now we are handling location 0
  var location = 0;
  var locationData = heatmap_data["locations"][0];

  // Avg data 
  var avgShakeIntensity = 0;
  var avgSewerAndWater = 0;
  var avgRoadsAndBridges = 0;
  var avgPower = 0;
  var avgMedical = 0;
  var avgBuildings = 0;

  var avgShakeIntensityList = [];
  var avgSewerAndWaterList = [];
  var avgRoadsAndBridgesList = [];
  var avgPowerList = [];
  var avgMedicalList = [];
  var avgBuildingsList = [];

  // Add X Axis
  // Get the label for X axis
  var xLabels = [];

  // X axis labels are in locationData
  // And calculate the each day average shake_intensity / sewer_and_water / roads_and_bridges / power / road_and_bridges / sewer_and_water
  locationData.dates.forEach(
    function(currV, idx)
    {
      xLabels.push(currV.date);
      currV.information.forEach(
        function(currInfo)
        {
          avgShakeIntensity += currInfo.shake_intensity;
          avgSewerAndWater += currInfo.damage.sewer_and_water;
          avgRoadsAndBridges += currInfo.damage.roads_and_bridges;
          avgPower += currInfo.damage.power;
          avgMedical += currInfo.damage.medical;
          avgBuildings += currInfo.damage.buildings;
        }
      );
      avgShakeIntensity = avgShakeIntensity / currV.information.length;
      avgSewerAndWater = avgSewerAndWater / currV.information.length;
      avgRoadsAndBridges = avgRoadsAndBridges / currV.information.length;
      avgPower = avgPower / currV.information.length;
      avgMedical = avgMedical / currV.information.length;
      avgBuildings = avgBuildings / currV.information.length;

      avgShakeIntensityList.push(avgShakeIntensity);
      avgSewerAndWaterList.push(avgSewerAndWater);
      avgRoadsAndBridgesList.push(avgRoadsAndBridges);
      avgPowerList.push(avgPower);
      avgMedicalList.push(avgMedical);
      avgBuildingsList.push(avgBuildings);

      avgShakeIntensity = 0;
      avgSewerAndWater = 0;
      avgRoadsAndBridges = 0;
      avgPower = 0;
      avgMedical = 0;
      avgBuildings = 0;
    }
  );

  // Create the scaleBand 
  var x = d3.scaleBand()
            .range([0, width])
            .domain(xLabels)
            .padding(0.01);

  // Draw on the screen
  svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y Axis
  // Get the label for Y axis
  var yLabels = ["shake_intensity", "buildings", "medical", "roads_and_bridges", "power", "sewer_and_water"];

  // Create the scaleBand
  var y = d3.scaleBand()
            .range([height, 0])
            .domain(yLabels)
            .padding(0.01);

  // Draw the Y axis
  svg.append("g")
        .call(d3.axisLeft(y).tickSizeOuter(0));


  // Build the Color Scale
  var colorScale = d3.scaleSequential()
                  .domain([10, 0])
                  .interpolator(d3.interpolateRdBu);
  
  // Create the gradient
  var colorGradient = svg.append("defs")
                        .append("linearGradient")
                        .attr("id", "grad")
                        .attr("x1", "0%")
                        .attr("x2", "0%")
                        .attr("y1", "0%")
                        .attr("y2", "100%");
  colorGradient.append("stop")
                .attr("offset", "0%")
                .style("stop-color", colorScale(10))
                .style("stop-opacity", 1)

  colorGradient.append("stop")
                .attr("offset", "50%")
                .style("stop-color", colorScale(5))
                .style("stop-opacity", 1)

  colorGradient.append("stop")
                .attr("offset", "100%")
                .style("stop-color", colorScale(0))
                .style("stop-opacity", 1)

  // Draw the legend
  var legendBar = svg.append("g")
     .attr("id", "colorBand")
     .append("rect")
     .attr("x", 550)
     .attr("y", 0)
     .attr("width", 20)
     .attr("height", height)
     .style("fill", "url(#grad)");
  
  var yBar = d3.scaleLinear()
     .range([height, 0])
     .domain([0, 10]);
  svg.append("g")
      .attr("transform", "translate(550, 0)")
      .call(d3.axisLeft(yBar));

  // Draw Heatmap
  var heatmap = svg.append("g").attr("id", "squares");

  // Draw the average Shake Intensity
  heatmap.append("g")
     .attr("id", "shake_intensity")
     .selectAll()
     .data(avgShakeIntensityList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("shake_intensity"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.shake_intensity;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "shake_intensity")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("shake_intensity"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });

  // Draw the average buildings damage
  heatmap.append("g")
     .attr("id", "buildings")
     .selectAll()
     .data(avgBuildingsList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("buildings"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.damage.buildings;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "buildings_slim" + i)
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("buildings"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });
  
  // Draw the average medical damage
  heatmap.append("g")
     .attr("id", "medical")
     .selectAll()
     .data(avgMedicalList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("medical"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.damage.medical;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "medical")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("medical"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });

  // Draw the average roads_and_bridges damage
  heatmap.append("g")
     .attr("id", "roads_and_bridges")
     .selectAll()
     .data(avgRoadsAndBridgesList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("roads_and_bridges"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.damage.roads_and_bridges;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "roads_and_bridges")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("roads_and_bridges"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });

  // Draw the average power damage
  heatmap.append("g")
     .attr("id", "power")
     .selectAll()
     .data(avgPowerList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("power"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.damage.power;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "power")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("power"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });

  // Draw the average sewer_and_water
  heatmap.append("g")
     .attr("id", "sewer_and_water")
     .selectAll()
     .data(avgSewerAndWaterList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("sewer_and_water"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.damage.sewer_and_water;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "sewer_and_water")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("sewer_and_water"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });


  // Dropdown
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

  // add the buttons to the screen
  var dropdownButtons = d3.select("#heat_map").append("select");
  dropdownButtons
    .selectAll("option")
    .data(allLocation)
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    })
    .attr("value", function (d, i) {
      return i;
    });


  // Dropdown Callback Function
  function updateLocation(newLocation)
  {
    // clear the old heatmap
    heatmap.selectAll("#shake_intensity").remove();
    heatmap.selectAll("#buildings").remove();
    heatmap.selectAll("#medical").remove();
    heatmap.selectAll("#roads_and_bridges").remove();
    heatmap.selectAll("#power").remove();
    heatmap.selectAll("#sewer_and_water").remove();

    // clear the old data
    avgShakeIntensity = 0;
    avgSewerAndWater = 0;
    avgRoadsAndBridges = 0;
    avgPower = 0;
    avgMedical = 0;
    avgBuildings = 0;
    avgShakeIntensityList = [];
    avgSewerAndWaterList =  [];
    avgRoadsAndBridgesList = [];
    avgPowerList = [];
    avgMedicalList = [];
    avgBuildingsList = [];

    // get the new data
    locationData = heatmap_data["locations"][newLocation];
    locationData.dates.forEach(
      function(currV, idx)
      {
        xLabels.push(currV.date);
        currV.information.forEach(
          function(currInfo)
          {
            avgShakeIntensity += currInfo.shake_intensity;
            avgSewerAndWater += currInfo.damage.sewer_and_water;
            avgRoadsAndBridges += currInfo.damage.roads_and_bridges;
            avgPower += currInfo.damage.power;
            avgMedical += currInfo.damage.medical;
            avgBuildings += currInfo.damage.buildings;
          }
        );
        avgShakeIntensity = avgShakeIntensity / currV.information.length;
        avgSewerAndWater = avgSewerAndWater / currV.information.length;
        avgRoadsAndBridges = avgRoadsAndBridges / currV.information.length;
        avgPower = avgPower / currV.information.length;
        avgMedical = avgMedical / currV.information.length;
        avgBuildings = avgBuildings / currV.information.length;
  
        avgShakeIntensityList.push(avgShakeIntensity);
        avgSewerAndWaterList.push(avgSewerAndWater);
        avgRoadsAndBridgesList.push(avgRoadsAndBridges);
        avgPowerList.push(avgPower);
        avgMedicalList.push(avgMedical);
        avgBuildingsList.push(avgBuildings);
  
        avgShakeIntensity = 0;
        avgSewerAndWater = 0;
        avgRoadsAndBridges = 0;
        avgPower = 0;
        avgMedical = 0;
        avgBuildings = 0;
      }
    );

  // draw the new one
  // Draw the average Shake Intensity
  heatmap.append("g")
     .attr("id", "shake_intensity")
     .selectAll()
     .data(avgShakeIntensityList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("shake_intensity"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.shake_intensity;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "shake_intensity")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("shake_intensity"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });

      

  // Draw the average buildings damage
  heatmap.append("g")
     .attr("id", "buildings")
     .selectAll()
     .data(avgBuildingsList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("buildings"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.damage.buildings;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "buildings")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("buildings"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });
  
  // Draw the average medical damage
  heatmap.append("g")
     .attr("id", "medical")
     .selectAll()
     .data(avgMedicalList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("medical"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.damage.medical;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "medical")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("medical"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });

  // Draw the average roads_and_bridges damage
  heatmap.append("g")
     .attr("id", "roads_and_bridges")
     .selectAll()
     .data(avgRoadsAndBridgesList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("roads_and_bridges"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.damage.roads_and_bridges;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "roads_and_bridges")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("roads_and_bridges"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });

  // Draw the average power damage
  heatmap.append("g")
     .attr("id", "power")
     .selectAll()
     .data(avgPowerList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("power"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.damage.power;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "power")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("power"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });

  // Draw the average sewer_and_water
  heatmap.append("g")
     .attr("id", "sewer_and_water")
     .selectAll()
     .data(avgSewerAndWaterList)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(xLabels[i]);})
     .attr("y", y("sewer_and_water"))
     .attr("width", x.bandwidth())
     .attr("height", y.bandwidth())
     .style("fill", function(d) {return colorScale(d)})
     .on("click", function(d, i) 
      {
          // Get date
          var date = xLabels[i];

          // get the shake_intensity data for each 4hrs
          var informationFourHrs = [];
          var informationAvg = 0;

          // get the information
          var information = locationData.dates[i].information;
          var idx = 0;
          information.forEach(
            function(d, i)
            {
              informationAvg += d.damage.sewer_and_water;
              idx++;
              if(!(idx < (information.length / 6) && i < (information.length - 1)))
              {
                informationAvg /= idx;
                informationFourHrs.push(informationAvg);
                informationAvg = 0;
                idx = 0;
              }
            }
        );

          // this entire rect should be replaced with new
          // delete the current rect
          d3.select(this).remove();
      
          // replace it with new
          heatmap.append("g")
          .attr("id", "sewer_and_water")
          .selectAll()
          .data(informationFourHrs)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {return x(date) + i * (x.bandwidth() / 6);})
          .attr("y", y("sewer_and_water"))
          .attr("width", x.bandwidth() / 6)
          .attr("height", y.bandwidth())
          .style("fill", function(d) {return colorScale(d)})
      });
  }

  // Turn on the effect
  dropdownButtons.on("change", function() {
    // get the selected value
    var selected = d3.select(this).property("value");
    // update the heatmap
    updateLocation(selected);
  })

}
