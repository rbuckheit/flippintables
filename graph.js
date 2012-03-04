// insert graph div in to page

$(document.body).append("<div id=\"ftables_graph\"><p>Hi</p></div>")

// browser graph stuff
var browserGraph;
// add Svg Stuff
  var svg = d3.select("#ftables_graph")
            .append("svg:svg")
            .attr("class", "browser-graph")
            .attr("width", 960)
            .attr("height", 500);
            
    var selection = new GraphSelection(svg);
    browserGraph = new BrowserGraph(svg);
    
    selection.onSelection(function() {
      var lastrect = selection.getLastRect();
      browserGraph.select(function(d) {
        return (d.x > lastrect.x && d.x < lastrect.x + lastrect.width && d.y > lastrect.y && d.y < lastrect.y + lastrect.height);
      });
    });


// bind hotkeys

var graphOn = false;

function loadNodes() {
    var nodes = [];
    chrome.extension.sendRequest({cmd: "get_nodes"}, function(response) {
      nodes = response.nodes;
      addNodes(nodes);
    console.log("getting links");
    var links = [];
    chrome.extension.sendRequest({cmd: "get_links"}, function(response) {
      links = response.links;
      for (i = 0; i < response.links.length; i += 1) {
        console.log("recv link: " + response.links[i]);
      }
      addLinks(links);
    });
    });
}

loadNodes();

//TODO graph fade effects
shortcut.add("Ctrl+Shift+G",function() {

	graph = $("#ftables_graph");

  if (graphOn)  {
    graph.css("display", "none"); // graph.fadeOut(1500, 'linear', function() {});
  } else {    
//    $("#ftables_graph").html("");     
    
    graph.css("display", "block");

    // loadNodes();
  }
  graphOn = !graphOn;
});

function convertLinks(links) {
  formatted = [];
  links.forEach(function (l) {
    var f = {};
    f.source = l.src;
    f.target = l.dest;
    formatted.push(f);
  });
  return formatted;
}

function addLinks(links) {
  browserGraph.addLink(convertLinks(links));
  // $("#ftables_graph").append("<p> LOADED LINKS </p> <pre>" +  JSON.stringify(links) + "</pre>");
}

function convertNodes(nodes) {
  formatted = [];
  nodes.forEach(function (l) {
    var f = {};
    f.title = l.title;
    f.image = l.favicon;
    formatted.push(f);
  });
  console.log(formatted);
  return formatted;
}

function addNodes(nodes) {
  browserGraph.addNode(convertNodes(nodes));
  // $("#ftables_graph").append("<p> LOADED NODES </p> <pre>" + array_to_str(nodes) + "</pre>")
}