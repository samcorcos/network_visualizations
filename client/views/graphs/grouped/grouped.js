Template.grouped.rendered = function() {
  // jQuery tab initialization
  $('ul.tabs').tabs();

  d3.json("./data.json", function(error, people) {
    var nodes = people.nodes;
    Session.set("nodes", nodes);
    createGrouped();
  });
};

// Create the template when it's rendered
// Within the function, call all the other functions

var height = 600;
var width = 1000;

var groups = {
  'law': {x:500, y:450},
  'media': {x:400, y:250},
  'entrepreneur': {x:1000, y:0},
  'finance': {x:1000, y:600},
  'fish_monger': {x:0, y:0},
  'retail': {x:0, y:600},
  'technology': {x:500, y:50}
}

var fill = d3.scale.category10();

var selectColor = function(colorSelector) {
  var nodes = Session.get("nodes");
  d3.select("#grouped-network")
    .selectAll(".node")
      .style("fill", function(d,i) { return fill(d[colorSelector]); })
      .style("stroke", function(d,i) { return d3.rgb(fill(d[colorSelector])).darker(2); })
}

var selectGroup = function(groupSelector) {
  if (groupSelector == "occupation") {
    var groups = {
      'law': {x:500, y:450},
      'media': {x:400, y:250},
      'entrepreneur': {x:1000, y:0},
      'finance': {x:1000, y:600},
      'fish_monger': {x:0, y:0},
      'retail': {x:0, y:600},
      'technology': {x:500, y:50}
    }
    return groups;
  }
  if (groupsSelector == "gender") {
    var groups = {
      'male': {x:100, y:100},
      'female': {x:300, y:300}
    }
  }



}

var createGrouped = function() {
  var nodes = Session.get("nodes");

  var svg = d3.select("#grouped-network")
    .append("svg")
    .attr({
      height: height,
      width: width
    });

  svg.style("opacity", 1e-6)
    .transition()
    .duration(1000)
    .style("opacity", 1);

  // Build nodes with bound data
  var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .on("tick", tick)
    .start();

  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 8)
    .call(force.drag)
    .on("mousedown", function() { d3.event.stopPropagation(); })

  d3.select("#grouped-network")
  .on("mousedown", mousedown);

  function tick(e) {

    var k = e.alpha * .1;
    nodes.forEach(function(node) {

      var center = groups[node.occupation]; // here you want to set center to the appropriate [x,y] coords
      node.x += (center.x - node.x) * k;
      node.y += (center.y - node.y) * k;

    });

    node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  }

  // To disable perturbing, disable this function
  function mousedown() {
    nodes.forEach(function(o,i) {
      o.x += (Math.random() - .5) * 40;
      o.y += (Math.random() - .5) * 40;
    });
    force.resume();
  }

  selectColor("occupation");



  var tooltip = d3.select('#grouped-network').append("div")
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'black')
    .style('color','white')
    .style('opacity', 0) // setting to 0 because we dont want it to show when the graphic first loads

  d3.selectAll('.node').on('mouseover', function(d) {
    // var stateAbbrev = d.id.split('-')[1];
    var person = d.name;
    d3.select(this)
      .style('opacity', 0.5)
      tooltip.transition()
      .style('opacity', .9)
      tooltip.html(person)
      // tooltip.html(stateAbbrev+'<br>'+stateHeat[stateAbbrev])
      .style('left', (d3.event.pageX -15) + 'px')
      .style('top', (d3.event.pageY - 30) + 'px')
  })


  .on('mouseout', function(d) {
    d3.select(this)
    .style('opacity', 1)
    tooltip.transition().duration(500)
    .style('opacity', 0)

  })    ////////////End tooltip


}

// I want the information to be perturbed when you click on a new tab.
Template.grouped.events({
  "click #tab1": function(e,t) {
    selectColor("occupation");
  },
  "click #tab2": function(e,t) {
    selectColor("location")
  },
  "click #tab3": function(e,t) {
    selectColor("gender")
  },
  "click #tab4": function(e,t) {
    selectColor("marital_status")
  }
})
