Template.map.rendered = function() {
  // jQuery tab initialization
  $('ul.tabs').tabs();

  // jQuery dropdown initialization
  $('.dropdown-button').dropdown();

  var height = 600,
      width = 1000;

  var color = d3.scale.ordinal()
    .domain([0, 1])
    .range(["#bbb", "FFF"]);

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

Template.map.helpers({
  // occupations: a function that picks the top 5 occupations from the dataset
  // interests: a function that picks the top 5 interests from the dataset
})
