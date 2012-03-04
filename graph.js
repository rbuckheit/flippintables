// insert graph div in to page

$(document.body).append("<div id=\"ftables_graph\"></div>")

// bind hotkeys

var graphOn = false;

//TODO graph fade effects
shortcut.add("Ctrl+Shift+G",function() {
  console.log("GRAPH HOTKEY");
	graph = $("#ftables_graph");
	console.log(graph.css("display"));
  if (graphOn)  {
    console.log("disable graph");
    graph.css("display", "none"); // graph.fadeOut(1500, 'linear', function() {});
  } else {
    console.log("enable graph");
    graph.css("display", "block");
  }
  graphOn = !graphOn;
});