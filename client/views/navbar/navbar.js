Template.navbar.rendered = function() {
  $(".button-collapse").sideNav();

  d3.select("#main-logo")
    .append("svg")
    .attr({
      width: 155,
      height: 60
    })
    .append("text")
    .attr("font-size", "50px")
    .attr("font-family", "'Marcellus SC', serif")
    .attr("fill", "white")
    .attr({
      y: 50
    })
    .text("TITLE")

};
