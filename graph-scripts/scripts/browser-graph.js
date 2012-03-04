function BrowserGraph(svg) {
  var viewport = svg.append("svg:g").attr("class", "graph-viewport");
  viewport.append("svg:g").attr("class", "link-layer");
  viewport.append("svg:g").attr("class", "node-layer");
  viewport.append("svg:g").attr("class", "description-layer");

  var nodes = [];
  var selection = [];
  var links = [];
  var width = parseInt(svg.attr("width"));
  var height = parseInt(svg.attr("height"));

  var graph = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .size([width, height])
      .friction(.5)
      .gravity(0)
      .linkDistance(50)
      // .linkStrength(0)
      .charge(-100)


  var link;
  var node;
  var nodeDescriptions;

  var updateNodeGraphicalElements = function() {
     link.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });
 
     node.attr("transform", function(d) {return "translate(" + d.x+ "," + d.y + ")";});
     nodeDescriptions.attr("x", function(d) {return d.x})
        .attr("y", function(d) {return d.y})
  }
  
  graph.on("tick", updateNodeGraphicalElements);

  var nodeClicked = function() {
    // when the node is clicked, this function is called
  }

  var nodeMouseDown = function() {
    freezeNodes();
    var datum = d3.select(this).data()[0];
    if (datum.selected == undefined || !datum.selected) {
      selectIndex(datum.index);
    }
  }

  var nodeDragMove = function() {
    nodes.forEach(function (d) {
      if (d.selected) {
        d.px = d.px + d3.event.dx;
        d.py = d.py + d3.event.dy;
        d.x = d.x + d3.event.dx;
        d.y = d.y + d3.event.dy;
      }
    });
    // then we need to update graphical elements
    updateNodeGraphicalElements();
  }

  var nodeDrag = d3.behavior.drag()
      .on("drag", nodeDragMove);

  var updateLinkElements = function() {
    var allLinks = svg.selectAll("g.link-layer").selectAll("line.link")
       .data(links);
    allLinks.enter().append("line")
       .attr("class", "link")
       .attr("style","stroke:rgb(0,0,0);stroke-width:1;");
      
    allLinks.exit().remove();
    return svg.selectAll("line.link")
  }

  var updateNodeElements = function() {
    var allNodes = svg.selectAll("g.node-layer").selectAll("g.node")
              .data(nodes);

    // we have to update selection for everything

    var newNodes = allNodes.enter().append("svg:g")
              .attr("class", "node")
              .call(nodeDrag)
              .on("click", nodeClicked)
              .on("mousedown", nodeMouseDown)
    newNodes.append("svg:rect")
              .attr("width",20)
              .attr("height",20)
              .attr("x",-10)
              .attr("y",-10)
              .attr("class", "node-selection-indicator");
    newNodes.append("svg:image")
              .attr("width",16)
              .attr("height",16)
              .attr("x",-8)
              .attr("y",-8)
              .attr("xlink:href", function(d){
                if (d.image == undefined) {
                  return chrome.extension.getURL("default_favicon.png");
                }
                return d.image;
              });
    newNodes.append("svg:text")
              .attr("class", "node-title-label")
              .attr("dx", 12)
              .attr("dy", ".35em")
              .text(function(d) {return d.title;});
    allNodes.exit().remove();
    allNodes.classed("selected-node", function(d) { return d.selected;})
            .classed("deleted-node", function(d) {return d.deleted;})

    nodeDescriptions = updateNodeDescriptions();
    return svg.selectAll("g.node");
  }

  var getNodeDescription = function(d) {
    return "<p>"+d.title+"</p>";
  }

  var updateNodeDescriptions = function() {
    var allNodes = svg.selectAll(".node-description").data(nodes);
    var newDescriptions = allNodes.enter().append("svg:foreignObject")
            .attr("class", "node-description")
            .attr("width", 100)
            .attr("height", 100)
            .append("xhtml:body");
    allNodes.exit().remove();
    newDescriptions.html(getNodeDescription);
    return svg.selectAll(".node-description");
  }

  var update = function() {
    graph.stop();
    graph.nodes(nodes);
    graph.links(links);

    link = updateLinkElements();
    node = updateNodeElements();

    graph.start();
    
    nodes.forEach(function (d) {console.log(d.index);});
  }
  
  this.addNode = function(node) {
    if (node[0] == undefined) {
      nodes.push(node);
    } else {
      for (var i = 0; i < node.length; i++) {
        nodes.push(node[i]);
      }
    }
    update();
  }
  
  this.addLink = function(link) {
    if (link[0] == undefined) {
      links.push(link);
    } else {
      for (var i = 0; i < link.length; i++) {
        links.push(link[i]);
      }
    }
    update();
  }

  this.addNodeWithParent = function(node, parentId) {
    freezeNodes();
    var parentNode;
    if (parentId != undefined) {
      unfreezeChildren(parentId);
      nodes.forEach(function (d) { if (d.index == parentId) parentNode = d; });
    }
    if (parentNode == undefined) {
      node.x = width / 2;
      node.y = 40;
    } else {
      node.x = parentNode.x + 1;
      node.y = parentNode.y + 5;
    }
    this.addNode(node);
    if (parentNode != undefined) {
      this.addLink({"target":node.index, "source":parentId});
    }
  }

  var lastAddedIndex = 0;
  this.addRando = function() {
    var index = Math.floor((Math.random()*(nodes.length + 1))) - 1;
    if (index < 0) index = undefined;
    console.log(index);
    this.addNodeWithParent({"title":"test"+lastAddedIndex++, "image":"images/facebook.ico"},index);
  }

  var select = function(predicate) {
    selection = nodes.filter(predicate);
    nodes.forEach(function(d) {
      d.selected = false;
    });
    selection.forEach(function(d) {
      d.selected = true;
    });
    update();
  }
  
  this.select = function(predicate) {
    select(predicate);
  }
  
  var selectIndex = function(index) {
    select(function(d) {return d.index == index;});
  }

  this.getSelection = function() {
    return selection;
  }

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
  
  this.deleteSelected = function() {
    // THIS IS BAD. Bugs if we try to splice the node list. So instead we hide the deleted nods.
    var isSelected = function(d) {return d.selected != undefined && d.selected;};
    var i = 0;
    while (i < links.length) {
      if(isSelected(links[i].source) || isSelected(links[i].target)) {
        links.splice(i,1);
      } else {
        i++;
      }
    }
    i = 0;
    while (i < nodes.length) {
      if (isSelected(nodes[i])) {
        nodes[i].deleted = true;
      }
      i++;
    }
    
    update();
  }

  this.getGraph = function() {
    return graph;
  }
  
  update();
}