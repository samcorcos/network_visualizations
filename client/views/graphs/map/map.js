Template.map.rendered = function() {
  // jQuery tab initialization
  // $('ul.tabs').tabs();

  // // jQuery dropdown initialization
  // $('.dropdown-button').dropdown();

  var height = 600,
      width = 1000;

  var color = d3.scale.ordinal()
    .domain([0, 1])
    .range(["#bbb", "FFF"]);

  // var color = d3.scale.category20()

  // d3.select("#concentration-map")
  //   .append("svg")
  //   .attr({
  //     height: height,
  //     width: width
  //   });

  // function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
  //   return "<h4>"+n+"</h4><table>"+w
  //   "<tr><td>Low</td><td>"+(d.low)+"</td></tr>"+
  //   "<tr><td>Average</td><td>"+(d.avg)+"</td></tr>"+
  //   "<tr><td>High</td><td>"+(d.high)+"</td></tr>"+
  //   "</table>";
  // }

  // var sampleData ={};	/* Sample random data. */
  // ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
  // "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
  // "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
  // "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
  // "WI", "MO", "AR", "OK", "KS", "LS", "VA"]
  // .forEach(function(d){
  //   var low=Math.round(100*Math.random()),
  //   mid=Math.round(100*Math.random()),
  //   high=Math.round(100*Math.random());
  //   sampleData[d]={low:d3.min([low,mid,high]), high:d3.max([low,mid,high]),
  //     avg:Math.round((low+mid+high)/3), color:d3.interpolate("#ffffcc", "#800026")(low/100)};
  //   });

// This part is the main problem........ I can't get the necessary data out of the json file


// var projection = d3.geo.albers()
//     .rotate([96, 0])
//     .center([-.6, 38.7])
//     .parallels([29.5, 45.5])
//     .scale(500)
//     .translate([width / 2, height / 2]);

// var projection = d3.geo.conicConformal()
//     .rotate([98, 0])
//     .center([0, 38])
//     .parallels([29.5, 45.5])
//     .scale(500)
//     .translate([width / 2, height / 2])
//     .precision(.1);



var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);


var path = d3.geo.path()
    .projection(projection);


var svg = d3.select("#concentration-map").append("svg")
    .attr("width", width)
    .attr("height", height);



///////////////////////////////
//Building Map
///////////////////////////////
d3.json("us.json", function(error, us) {
  if (error) return console.error(error);

  svg.append("path")
      .datum(topojson.feature(us, us.objects.subunits))
      .attr("d", path);

  svg.selectAll(".subunit")
      .data(topojson.feature(us, us.objects.subunits).features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.id; }) 
      //added id in above line to use as selector: ex US-NY
      .attr("d", path)
      .style('fill',function(d){
        return color(Math.random())
      })
      

  /////////Gives state boundary line
  svg.insert('path','.graticule')
    .datum(topojson.feature(us, us.objects.subunits,function(a, b) { return a !== b; }))
    .attr('class','state-boundary')
    .attr("d", path)
    .attr('stroke','#FFF') 
    .style('fill','none')

  

  //Building hover tooltip
  //has to be inside d3.json build for async reasons
  var tooltip = d3.select('body').append('div')
              .style('position', 'absolute')
              .style('padding', '0 10px')
              .style('background', 'black')
              .style('color','white')
              .style('opacity', 0) // setting to 0 because we dont want it to show when the graphic first loads

      d3.selectAll('path').on('mouseover', function(d) {
        if(d3.select(this).attr('class')==='state-boundary'){
          return;  //Handles mouseover state boundary lines
        }
        var stateAbbrev = d.id.split('-')[1];
        d3.select(this)
          .style('opacity', 0.5)
        tooltip.transition()
          .style('opacity', .9)
        tooltip.html(stateAbbrev)
          .style('left', (d3.event.pageX -15) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px')
      })


      .on('mouseout', function(d) {
            d3.select(this)
              .style('opacity', 1)
            tooltip.transition().duration(500)
              .style('opacity', 0)
      })
})
///////////////////////////////
//End Map
///////////////////////////////



}

//   var statePaths = d3.json("states.js", function(error, states) {
//     if (error) console.error(error);
//     console.log(states.statePaths);
//     return states.statePaths;
//   });



//   var uStates={};

//   uStates.draw = function(id, data, toolTip){
//     function mouseOver(d){
//       d3.select("#tooltip").transition().duration(200).style("opacity", .9);

//       d3.select("#tooltip").html(toolTip(d.n, data[d.id]))
//       .style("left", (d3.event.pageX) + "px")
//       .style("top", (d3.event.pageY - 28) + "px");
//     }

//     function mouseOut(){
//       d3.select("#tooltip").transition().duration(500).style("opacity", 0);
//     }

//     d3.select(id).selectAll(".state")
//     .data(statePaths).enter().append("path").attr("class","state").attr("d",function(d){ return d.d;})
//     .style("fill",function(d){ return data[d.id].color; })
//     .on("mouseover", mouseOver).on("mouseout", mouseOut);
//   }
//   this.uStates=uStates;

//   uStates.draw("#statesvg", sampleData, tooltipHtml);

// }

// Template.map.events({
//   "click .tab": function(event, template) {
//     $(event.target).next().toggleClass("content-hidden content-display")
//   }
// })
