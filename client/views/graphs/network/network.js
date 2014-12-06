Template.network.rendered = function() {

  var width = 1000,
  height = 600;

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

  var link = svg.selectAll(".link"),
  node = svg.selectAll(".node");

  d3.json("network.json", function(error, graph) {
    force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

    link = link.data(graph.links)
    .enter().append("line")
    .attr("class", "link");

    node = node.data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 12)
    .on("dblclick", dblclick)
    .call(drag);
  });

  function tick() {

    // This is where we can run the clustering algorithm using position Verlet integration: http://bl.ocks.org/mbostock/1021841
    // The first clustering should be by occupation

    // var k = 6* e.alpha;
    // nodes.forEach(function(o, i) {
    //   o.y += i & 1 ? k : -k;
    //   o.x += i & 2 ? k : -k;
    // });

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






};

Template.network.events({

});

Template.network.helpers({

});
