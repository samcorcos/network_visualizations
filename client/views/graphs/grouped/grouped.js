Template.grouped.rendered = function() {
  // jQuery tab initialization
  $('ul.tabs').tabs();

  createGrouped();
};

var createGrouped = function() {
  var height = 600,
      width = 1000;

  // This creates a "fill" property that gives pre-selected colors to up to 20 elements

  var fill = d3.scale.category20(); // "category20" is a shortcut for creating 20 unique colors. there is also category10.


  // creating a new "session variable" for all the nodes, making the json data accessible outside of hte json function

  // Get data from json file
  d3.json("./data.json", function(error, people) {
    Session.set("people", people);
  });
  var people = Session.get("people").nodes;


  // Build nodes
  var nodes = d3.range(people.length).map(function(i) {

    // Add data in nodes
    var nodeTemp = {index: i};
    for (var name in people[i]) {
      nodeTemp[name] = people[i][name];
    }
    return nodeTemp;
  });



  // This creates the force... Between the elements?
  var force = d3.layout.force()
  .nodes(nodes)
  .size([width, height])
  .on("tick", tick)
  .start();

  // This creates the SVG on the DOM
  var svg = d3.select("#grouped-network")
  .append("svg")
  .attr({
    height: height,
    width: width
  });

  // This
  var node = svg.selectAll(".node")
  .data(nodes)
  .enter().append("circle")
  .attr("class", "node")
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .attr("r", 8)
  .style("fill", function(d,i) { return fill(i & 3); })
  .style("stroke", function(d,i) { return d3.rgb(fill(i & 3)).darker(2); })
  .call(force.drag)
  .on("mousedown", function() { d3.event.stopPropagation(); })

  // This sets the opacity of the SVG so it transitions in.
  svg.style("opacity", 1e-6)
  .transition()
  .duration(1000)
  .style("opacity", 1);

  // This selects the SVG and runs the "mousedown" function, which is the perturbation function, when clicked.
  d3.select("#grouped-network")
  .on("mousedown", mousedown);


  var groups = { 'law': {x:500, y:450},
  'media': {x:400, y:250},
  'entrepreneur': {x:1000, y:0},
  'finance': {x:1000, y:600},
  'fish_monger': {x:0, y:0},
  'retail': {x:0, y:600},
  'technology': {x:500, y:50}}
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
}

// I want the information to be perturbed when you click on a new tab.
Template.grouped.events({
  "click .tab": function(event, template) {

  }
})
