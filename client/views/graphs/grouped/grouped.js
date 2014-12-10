Template.grouped.rendered = function() {
  // jQuery tab initialization
  $('ul.tabs').tabs();

  var height = 600,
      width = 600;

  // This creates a "fill" property that gives pre-selected colors to up to 20 elements

  var fill = d3.scale.category20(); // "category20" is a shortcut for creating 20 unique colors. there is also category10.

  // This is the part that I will have to change to use .json data at some point
  // Right now it's just creating 100 nodes with nothing else going on
  var nodes = d3.range(100).map(function(i) {

    if( i % 2 === 0) {
      return { index: i ,
        group: 'A'};
    }
    else{
      return { index: i ,
        group: 'B'};
    }

  })

  // // This gets the right data... but it doesn't work as expected...
  // // For whatever reason, it's console logging the JSON data, but I can't get it to return anything
  // d3.json("grouped.json", function(error, json) {
  //   if (error) console.error(error);
  //   console.log(json.nodes)
  // })

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


    var groups = { 'A': {x:123, y:456},
                   'B': {x:456, y:123}}
  function tick(e) {

    // debugger;
    // This is where the clustering happens... I'm not sure how, but it is.
    // var k = 6 * e.alpha; // "alpha" is the "cooling factor" that slows down the nodes over time. You'll notice that the nodes start the simulation moving quickly, then eventually settle into place. That's because of alpha (http://vallandingham.me/bubble_charts_in_d3.html).
    // nodes.forEach(function(o,i) {
    //   o.y += i & 1 ? k : -k;
    //   o.x += i & 2 ? k : -k;
    // });

    var k = e.alpha * .01;
    nodes.forEach(function(node) {
      var center = groups[node.group]; // here you want to set center to the appropriate [x,y] coords
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

};

// I want the information to be perturbed when you click on a new tab.
Template.grouped.events({
  "click .tab": function(event, template) {

  }
})
