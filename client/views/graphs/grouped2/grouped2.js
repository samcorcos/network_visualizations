Template.grouped2.rendered = function() {
  // jQuery tab initialization
  $('ul.tabs').tabs();

  d3.json("./data.json", function(error, people) {
    var nodes = people.nodes;
    Session.set("nodes", nodes);
  });
};

Template.grouped2.events({

});
