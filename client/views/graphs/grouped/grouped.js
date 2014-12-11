Template.grouped.rendered = function() {
  // jQuery tab initialization
  $('ul.tabs').tabs();

  d3.json("./data.json", function(error, people) {
    var nodes = people.nodes;
    Session.set("nodes", nodes);
  });

  createGrouped();
};

var height = 600,
    width = 1000;

var fill = d3.scale.category10();

var genderColor = function() {
  var nodes = Session.get("nodes");
  d3.select("#grouped-network")
    .selectAll(".node")
      .style("fill", function(d,i) { return fill(d.gender); })
      .style("stroke", function(d,i) { return d3.rgb(fill(d.gender)).darker(2); })
}

var occupationColor = function() {
  var nodes = Session.get("nodes");
  d3.select("#grouped-network")
    .selectAll(".node")
      .style("fill", function(d,i) { return fill(d.occupation); })
      .style("stroke", function(d,i) { return d3.rgb(fill(d.occupation)).darker(2); })
}

var locationColor = function() {
  var nodes = Session.get("nodes");
  d3.select("#grouped-network")
  .selectAll(".node")
  .style("fill", function(d,i) { return fill(d.location); })
  .style("stroke", function(d,i) { return d3.rgb(fill(d.location)).darker(2); })
}

var maritalColor = function() {
  var nodes = Session.get("nodes");
  d3.select("#grouped-network")
  .selectAll(".node")
  .style("fill", function(d,i) { return fill(d.marital_status); })
  .style("stroke", function(d,i) { return d3.rgb(fill(d.marital_status)).darker(2); })
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

  var groups = {
    'law': {x:500, y:450},
    'media': {x:400, y:250},
    'entrepreneur': {x:1000, y:0},
    'finance': {x:1000, y:600},
    'fish_monger': {x:0, y:0},
    'retail': {x:0, y:600},
    'technology': {x:500, y:50}
  }

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
  occupationColor();
}

// I want the information to be perturbed when you click on a new tab.
Template.grouped.events({
  "click #tab1": function(e,t) {
    occupationColor();
  },
  "click #tab2": function(e,t) {
    locationColor();
  },
  "click #tab3": function(e,t) {
    genderColor();
  },
  "click #tab4": function(e,t) {
    maritalColor();
  }
})
