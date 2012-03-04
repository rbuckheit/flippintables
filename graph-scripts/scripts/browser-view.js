function BrowserView(svg) {
  var userLock = false;
  
  var viewport = svg.append("svg:g").attr("class", "graph-viewport");
  viewport.append("svg:g").attr("class", "link-layer");
  viewport.append("svg:g").attr("class", "node-layer");
  viewport.append("svg:g").attr("class", "description-layer");

  var nodes = [];
  var selection = [];
  var links = [];
  var width = parseInt(svg.attr("width"));
  var height = parseInt(svg.attr("height"));

  var link;
  var node;
  var nodeDescriptions;

  var callbacks = [];
  this.onDataUpdate = function(callback) {
    callbacks.push(callback);
  }
  var dataUpdated = function() {
    // called whenever data is updated.
    // only called when userLock is held.
    for (var i = 0 ; i < callbacks.length; i++) {
      callbacks[i]();
    }
  }

  var updateNodeGraphicalElements = function() {
     link.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });
 
     node.attr("transform", function(d) {return "translate(" + d.x+ "," + d.y + ")";});
     nodeDescriptions.attr("x", function(d) {return d.x})
        .attr("y", function(d) {return d.y})
  }
  
  var nodeClicked = function() {
    // when the node is clicked, this function is called
  }

  var nodeMouseDown = function() {
    userLock = true;
    freezeNodes();
    var datum = d3.select(this).data()[0];
    if (datum.selected == undefined || !datum.selected) {
      selectIndex(datum.index);
    }
  }
  
  var nodeDragEnd = function() {
    userLock = false;
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
    dataUpdated();
  }

  var nodeDrag = d3.behavior.drag()
      .on("drag", nodeDragMove)
      .on("dragend", nodeDragEnd);

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
              .attr("xlink:href", function(d){return d.image;});
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
    link = updateLinkElements();
    node = updateNodeElements();
    updateNodeGraphicalElements();
  }
  
  this.setNodes = function(n) {
    if (!userLock) {
      nodes = n;
      update();
    }
  }
  
  this.setLinks = function(l) {
    if (!userLock) {
      links = l;
      links.forEach(function(d) {
        d.source = findNodeWithIndex(d.source);
        d.target = findNodeWithIndex(d.target);
      })
      update();
    }
  }
  function findNodeWithIndex(index) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].index == index) {
        return nodes[i];
      }
    }
    console.log("couldn't find node");
    return undefined;
  }

  var select = function(predicate) {
    selection = nodes.filter(predicate);
    nodes.forEach(function(d) {
      d.selected = false;
    });
    selection.forEach(function(d) {
      d.selected = true;
    });
    dataUpdated();
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
  
  this.getNodes = function() {
    return nodes;
  }
  
  this.getLinks = function() {
    return links;
  }

  update();
}