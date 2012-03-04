function GraphSelection(svg) {  
  var callbacks = [];
  
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
  
  var lastRect = {};

  function startBoxSelect() {
    dragStart.x = d3.mouse(this)[0];
    dragStart.y = d3.mouse(this)[1];
    selectionRectangle = svg.append("svg:rect")
      .attr("class", "selection-rectangle");
  }

  function dragBoxSelect() {
    var mousex = d3.mouse(this)[0];
    var mousey = d3.mouse(this)[1];
    var x1 = Math.min(dragStart.x, mousex);
    var x2 = Math.max(dragStart.x, mousex);
    var y1 = Math.min(dragStart.y, mousey);
    var y2 = Math.max(dragStart.y, mousey);

    var width = x2 - x1;
    var height = y2 - y1;
    var x = x1;
    var y = y1;

    selectionRectangle.attr("width", width)
      .attr("height", height)
      .attr("x", x)
      .attr("y", y);
      
    lastRect.width = width;
    lastRect.height = height;
    lastRect.x = x;
    lastRect.y = y;
  }

  function endBoxSelect() {
    dragStart.x = undefined;
    dragStart.y = undefined;
    selectionRectangle.remove();
    callCallbacks();
  }
  
  function callCallbacks() {
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i]();
    }  
  }
  
  this.onSelection = function(callback) {
    callbacks.push(callback);
  }
  
  this.getLastRect = function() {
    return lastRect;
  }
}