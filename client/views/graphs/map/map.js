Template.map.rendered = function() {
  // jQuery tab initialization
  // $('ul.tabs').tabs();

  // // jQuery dropdown initialization
  // $('.dropdown-button').dropdown();

  var height = 600,
      width = 1000;

  // d3.select("#concentration-map")
  //   .append("svg")
  //   .attr({
  //     height: height,
  //     width: width
  //   });

  // function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
  //   return "<h4>"+n+"</h4><table>"+w
  //   "<tr><td>Low</td><td>"+(d.low)+"</td></tr>"+
  //   "<tr><td>Average</td><td>"+(d.avg)+"</td></tr>"+
  //   "<tr><td>High</td><td>"+(d.high)+"</td></tr>"+
  //   "</table>";
  // }

  // var sampleData ={};	/* Sample random data. */
  // ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
  // "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
  // "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
  // "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
  // "WI", "MO", "AR", "OK", "KS", "LS", "VA"]
  // .forEach(function(d){
  //   var low=Math.round(100*Math.random()),
  //   mid=Math.round(100*Math.random()),
  //   high=Math.round(100*Math.random());
  //   sampleData[d]={low:d3.min([low,mid,high]), high:d3.max([low,mid,high]),
  //     avg:Math.round((low+mid+high)/3), color:d3.interpolate("#ffffcc", "#800026")(low/100)};
  //   });

// This part is the main problem........ I can't get the necessary data out of the json file

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
      .style('fill','#FFF')
      // .style('fill',function(d){
      //   return color(Math.random())
      // })


  /////////Gives state boundary line
  svg.insert('path','.graticule')
    .datum(topojson.feature(us, us.objects.subunits,function(a, b) { return a !== b; }))
    .attr('class','state-boundary')
    .attr("d", path)
    // .attr('stroke','#FFF') 
    .style('fill','none')

  

  
      var color = d3.scale.linear()
            .domain([1,8])
            .range(['#D1E0FF','red']);

      var stateHeat={};

      testing = d3.selectAll('path',function(a){
        console.log('A ',a)}
        );


      
      /////////////////////////
      /////Bringing in other json
      d3.json("data.json",function(error,datum){
          //Datum.nodes is an array of people with keys
          //name, occupation, location, gender, marital_status
          var people = datum.nodes
          
          people.forEach(function(person){
            
            var state =person.location;
            var thisState = d3.select('path[class*='+state+']')
          
            if(!stateHeat[state]){
              stateHeat[state] = 1;
            }
            else {
              stateHeat[state]+=1}

          })
          
          svg.selectAll(".subunit")
            .style('fill',function(d){
              var abbrev = d.id.split('-').pop();
              
              return color(stateHeat[abbrev])
            })   




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
        // tooltip.html(stateAbbrev+'<br>'+stateHeat[stateAbbrev])
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
})
///////////////////////////////
//End Map
///////////////////////////////



}


// Template.map.events({
//   "click .tab": function(event, template) {
//     $(event.target).next().toggleClass("content-hidden content-display")
//   }
// })
