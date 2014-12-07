Template.map.rendered = function() {
  // jQuery tab initialization
  $('ul.tabs').tabs();

  // jQuery dropdown initialization
  $('.dropdown-button').dropdown();



  var height = 600,
      width = 1000;

  d3.select("#concentration-map")
    .append("svg")
    .attr({
      height: height,
      width: width
    });

  function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
    return "<h4>"+n+"</h4><table>"+w
    "<tr><td>Low</td><td>"+(d.low)+"</td></tr>"+
    "<tr><td>Average</td><td>"+(d.avg)+"</td></tr>"+
    "<tr><td>High</td><td>"+(d.high)+"</td></tr>"+
    "</table>";
  }

  var sampleData ={};	/* Sample random data. */
  ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
  "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
  "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
  "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
  "WI", "MO", "AR", "OK", "KS", "LS", "VA"]
  .forEach(function(d){
    var low=Math.round(100*Math.random()),
    mid=Math.round(100*Math.random()),
    high=Math.round(100*Math.random());
    sampleData[d]={low:d3.min([low,mid,high]), high:d3.max([low,mid,high]),
      avg:Math.round((low+mid+high)/3), color:d3.interpolate("#ffffcc", "#800026")(low/100)};
    });

// This part is the main problem........ I can't get the necessary data out of the json file

  var statePaths = d3.json("states.js", function(error, states) {
    if (error) console.error(error);
    console.log(states.statePaths);
    return states.statePaths;
  });



  var uStates={};

  uStates.draw = function(id, data, toolTip){
    function mouseOver(d){
      d3.select("#tooltip").transition().duration(200).style("opacity", .9);

      d3.select("#tooltip").html(toolTip(d.n, data[d.id]))
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
    }

    function mouseOut(){
      d3.select("#tooltip").transition().duration(500).style("opacity", 0);
    }

    d3.select(id).selectAll(".state")
    .data(statePaths).enter().append("path").attr("class","state").attr("d",function(d){ return d.d;})
    .style("fill",function(d){ return data[d.id].color; })
    .on("mouseover", mouseOver).on("mouseout", mouseOut);
  }
  this.uStates=uStates;

  uStates.draw("#statesvg", sampleData, tooltipHtml);

}

Template.map.events({
  "click .tab": function(event, template) {
    $(event.target).next().toggleClass("content-hidden content-display")
  }
})
