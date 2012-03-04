function BrowserForce() {
  var nodes = [];
  var links = [];

  var width = 960;
  var height = 500;
  
  var tickCallbacks = [];
  var callTickCallbacks = function() {
    for (var i = 0; i < tickCallbacks.length; i++) {
      tickCallbacks[i]();
    }
  }
  
  this.addTickCallback = function(callback) {
    tickCallbacks.push(callback);
  }
  
  this.getNodes = function() {
    return nodes;
  }
  
  this.getLinks = function() {
    return links;
  }
  
  this.getLinksAsIndexes = function() {
    return links.map(function(l) {
      var a = {};
      a.source = l.source.index;
      a.target = l.target.index;
      return a;
    });
  }
  
  this.setNodes = function(n) {
    graph.stop();
    nodes = n;
    graph.nodes(nodes);
    graph.start();
  }
  
  this.setLinks = function(l) {
    graph.stop();
    links = l;
    graph.nodes(nodes);
    graph.start();
  }

  var graph = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .size([width, height])
      .friction(.5)
      .gravity(0)
      .linkDistance(50)
      // .linkStrength(0)
      .charge(-100);
  graph.on("tick", callTickCallbacks);
  graph.start();

  var freezeNodes = function() {
    nodes.forEach(function (d) { d.fixed = true;});
  }

  var unfreezeChildren = function(parentId) {
    links.forEach(function (d) { 
      if (d.source.index == parentId) { 
        d.target.fixed = false;
      }
    });
  }
  
  this.getGraph = function() {
    return graph;
  }
  
}