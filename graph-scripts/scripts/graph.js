var nodes = [{"title":"test1", "image":"images/facebook.ico"}, {"title":"test2", "image":"images/google.ico"}];
var links = [{"source":0, "target":1}];


var svg = d3.select("#graph").
              append("svg:svg").
              attr("width", 960).
              attr("height", 500);

var svg_background = svg.append("svg:rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 960)
      .attr("height",500)
      .attr("style", "fill:rgba(0,0,0,0);");

svg_background.call(d3.behavior.drag()
    .on("dragstart", startBoxSelect)
    .on("drag", dragBoxSelect)
    .on("dragend", endBoxSelect));

var selectionRectangle;
var dragStart = {"x":undefined, "y":undefined}

function startBoxSelect() {
  dragStart.x = d3.mouse(this)[0];
  dragStart.y = d3.mouse(this)[1];
  selectionRectangle = svg.append("svg:rect");
}

function dragBoxSelect() {
  var mousex = d3.mouse(this)[0];
  var mousey = d3.mouse(this)[1];
  var x1 = Math.min(dragStart.x, mousex);
  var x2 = Math.max(dragStart.x, mousex);
  var y1 = Math.min(dragStart.y, mousey);
  var y2 = Math.max(dragStart.y, mousey);

  selectionRectangle.attr("width", x2 - x1)
    .attr("height", y2 - y1)
    .attr("x", x1)
    .attr("y", y1);
}

function endBoxSelect() {
  dragStart.x = undefined;
  dragStart.y = undefined;
  selectionRectangle.remove();
}

var node = svg.selectAll("circle.node")
              .data(nodes)
              .enter().append("svg:image")
              .attr("class", "node")
              .attr("width",16)
              .attr("height",16)
              .attr("x",5)
              .attr("y",5)
              .attr("xlink:href", function(d){return d.image;})
              .call(d3.behavior.drag().on("drag", moveNode))

var link = svg.selectAll("line.link")
       .data(links)
       .enter().append("line")
       .attr("class", "link")
       .attr("style","stroke:rgb(0,0,0);stroke-width:1;");

function moveNode(){
    this.parentNode.appendChild(this);
    var dragTarget = d3.select(this);
    dragTarget
        .attr("x", function(){return d3.event.dx + parseInt(dragTarget.attr("x"))})
        .attr("y", function(){return d3.event.dy + parseInt(dragTarget.attr("y"))});
    layout();
};

var getNodeElement = function(nodeIndex) {
  return d3.select(node[0][nodeIndex]);
}

var layout = function() {
     link.attr("x1", function(d) { return getNodeElement(d.source).attr("x"); })
         .attr("y1", function(d) { return getNodeElement(d.source).attr("y"); })
         .attr("x2", function(d) { return getNodeElement(d.target).attr("x"); })
         .attr("y2", function(d) { return getNodeElement(d.target).attr("y"); });
}

layout();