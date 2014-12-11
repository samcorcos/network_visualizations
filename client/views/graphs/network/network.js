Template.network.rendered = function() {
  createChart();
};

var width = 1000,
    height = 600;

var createChart = function() {

  var force = d3.layout.force()
    .size([width, height])
    .charge(-400)
    .linkDistance(40)
    .on("tick", tick);

  var drag = force.drag()
    .on("dragstart", dragstart);

  var svg = d3.select("#network-visualization")
  .append("svg")
  .attr({
    height: height,
    width: width
  })

  var link = svg.selectAll(".link");
  var node = svg.selectAll(".node");

  d3.json("data.json", function(error, people) {

    force
    .nodes(people.nodes)
    .links(people.links)
    .start();

    link = link.data(people.links)
    .enter().append("line")
    .attr("class", "link");

    node = node.data(people.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 12)
    .on("dblclick", dblclick)
    .call(drag);
  });

  function tick() {

    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; })

    node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
  }

  function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);
  }

  function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
  }

}





Template.network.events({

});

Template.network.helpers({

});
