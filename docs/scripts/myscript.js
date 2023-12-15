// data and labels to plot
    const rawData = [
    [1999, 8092],
    [2000, 8464],
    [2001, 9403],
    [2002, 11792],
    [2003,13054],
    [2004, 13761],
    [2005, 15071],
    [2006, 17604],
    [2007, 18375],
    [2008, 19462],
    [2009, 20246],
    [2010, 21034],
    [2011, 22745],
    [2012, 23226],
    [2013, 24968],
    [2014, 28654],
    [2015, 33356],
    [2016, 42968],
    [2017, 48443]
    ]

      const data = rawData.map(row => {
        return {
            year: row[0],
            overdoseRate: +row[1], // Convert string to number
            };
        });


      const max_bar_width = 100;
      const svg_height = 600;
      const bar_color = "#95BB9D";
      const top_offset = 50;
      const bottom_offset = 50;

      /**
       * Darked/Lighten a color
       * From https://stackoverflow.com/a/13532993/10468888
       */
      function shadeColor(color, percent) {

          var R = parseInt(color.substring(1,3),16);
          var G = parseInt(color.substring(3,5),16);
          var B = parseInt(color.substring(5,7),16);

          R = parseInt(R * (100 + percent) / 100);
          G = parseInt(G * (100 + percent) / 100);
          B = parseInt(B * (100 + percent) / 100);

          R = (R<255)?R:255;
          G = (G<255)?G:255;
          B = (B<255)?B:255;

          var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
          var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
          var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

          return "#"+RR+GG+BB;
      }

      // append svg
      const svg = d3.select("div#plot")
        .append("svg")
        .attr("fill", "red")
        .attr("width", '100%')
        .attr("height", svg_height);

      const svg_width = svg.node().getBoundingClientRect().width;

      // decide bar width depending upon available space and no. of bars to plot
      let bar_width = Math.round((svg_width - 60) / data.length);
      if (bar_width > max_bar_width) {
        bar_width = max_bar_width;
      }

      const spacing = 0.15 * bar_width;
      let left_offset = Math.round((svg_width - bar_width*data.length)/2);
      if (left_offset < 0) {
        left_offset = 0;
      }

      const scale = d3.scaleLinear()
        .domain([0, Math.max(...data.map(d => d.overdoseRate))])
        .range([0, svg_height - top_offset - bottom_offset]);

      const scale_y_axis = d3.scaleLinear()
        .domain([Math.max(...data.map(d => d.overdoseRate)) ,0])
        .range([0, svg_height - top_offset - bottom_offset]);

      // create tooltip element
      const tooltip = d3.select("body")
        .append("div")
        .attr("class","d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("padding", "15px")
        .style("background", "rgba(0,0,0,0.6)")
        .style("border-radius", "5px")
        .style("color", "#fff")
        .text("a simple tooltip");

      // append rect
      const rect = svg.selectAll("g")
        .data(data.map(d => d.overdoseRate))
        .enter()
        .append("rect")
        .attr("fill", bar_color)
        .attr("x", (d, i) => left_offset + bar_width * i)
        .attr("y", d => svg_height - bottom_offset)
        .attr("width", bar_width - spacing)
        .on("mouseover", function(d, i) {
          tooltip.html(`Overdose Deaths: ${d,i}`).style("visibility", "visible");
          d3.select(this)
            .attr("fill", shadeColor(bar_color, -15));
        })
        .on("mousemove", function(){
          tooltip
            .style("top", (event.pageY-10)+"px")
            .style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function() {
          tooltip.html(``).style("visibility", "hidden");
          d3.select(this).attr("fill", bar_color);
        });

      // append text
      svg.selectAll("g")
        .data(data.map(d => d.overdoseRate))
        .enter()
        .append("text")
        .attr("dominant-baseline", "text-before-edge")
        .attr("text-anchor", "middle")
        .attr("fill", "#000000")
        .attr("x", (d, i) => left_offset + bar_width * i + bar_width/2 - spacing/2)
        .attr("y", svg_height - bottom_offset)
        .attr("style", "font-family:Verdana")
        .attr("style", "font-size:10px")
        .text((d, i) => data.map(d => d.year)[i]);

      // append X-Axis
      svg.append("line")
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("x1", left_offset)
        .attr("y1", svg_height - bottom_offset)
        .attr("x2", bar_width * data.length + left_offset - spacing)
        .attr("y2", svg_height - bottom_offset);

      // append Y-Axis
      svg.append("g")
        .attr("transform", "translate(0," + top_offset + ")")
        .call(d3.axisRight(scale_y_axis));

      svg.append("text")
        .attr("x", (svg_width / 2))
        .attr("y", (bottom_offset/ 2))
        .attr("text-anchor", "middle")
        .attr("font-weight", 700)
        .style("font-size", "20px")
        .style('fill', 'black')
        .text("National Overdose Deaths Involving Any Opioid");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(svg_height/2))
        .attr("y", 60)
        .style("text-anchor", "middle")
        .style('fill', 'black')
        .text("Total Overdose Deaths");

    svg.append("text")
        .attr("transform", "translate(" + (svg_width/2) + " ," + (svg_height-10) + ")")
        .style("text-anchor", "middle")
        .style('fill', 'black')
        .text("Year");

      window.onload = () => {
        // set animation
        rect.transition()
            .ease(d3.easeLinear)
            .duration(1000)
            .attr("y", d => svg_height - bottom_offset - scale(d))
            .attr("height", d => scale(d));
      };
