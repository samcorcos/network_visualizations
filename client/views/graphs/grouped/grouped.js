Template.grouped.rendered = function() {
  // jQuery tab initialization
  $('ul.tabs').tabs();

  var height = 600,
      width = 1000;

  // This creates a "fill" property that gives pre-selected colors to up to 20 elements
  var fill = d3.scale.category20();

  // This is the part that I will have to change to use .json data at some point
  var nodes = d3.range(100).map(function(i) {
    return { index: i };
  })

  // // This gets the right data... but it doesn't work as expected...
  // d3.json("grouped.json", function(error, json) {
  //   if (error) console.error(error);
  //   console.log(json.nodes)
  // })

  var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .on("tick", tick)
    .start();

  var svg = d3.select("#grouped-network")
    .append("svg")
    .attr({
      height: height,
      width: width
    });

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

  svg.style("opacity", 1e-6)
    .transition()
      .duration(1000)
      .style("opacity", 1);

  d3.select("#grouped-network")
    .on("mousedown", mousedown);

  function tick(e) {

    // Push different nodes in different directions for clustering.
    var k = 6 * e.alpha;
    nodes.forEach(function(o,i) {
      o.y += i & 1 ? k : -k;
      o.x += i & 2 ? k : -k;
    });

    // This is the part that positions the nodes based on... something
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

};
