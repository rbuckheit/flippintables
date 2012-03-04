// insert graph div in to page

$(document.body).append("<div id=\"ftables_graph\"><p>Hi</p></div>")

// bind hotkeys

var graphOn = false;

//TODO graph fade effects
shortcut.add("Ctrl+Shift+G",function() {

	graph = $("#ftables_graph");

  if (graphOn)  {
    graph.css("display", "none"); // graph.fadeOut(1500, 'linear', function() {});
  } else {    
    $("#ftables_graph").html(""); 
    
    var nodes = [];
    chrome.extension.sendRequest({cmd: "get_nodes"}, function(response) {
      nodes = response.nodes;
      addNodes(nodes);
    });
    
    console.log("getting links");
    var links = [];
    chrome.extension.sendRequest({cmd: "get_links"}, function(response) {
      links = response.links;
      for (i = 0; i < response.links.length; i += 1) {
        console.log("recv link: " + response.links[i]);
      }
      addLinks(links);
    });
    
    graph.css("display", "block");
  }
  graphOn = !graphOn;
});

function addLinks(links) {
  $("#ftables_graph").append("<p> LOADED LINKS </p> <pre>" +  JSON.stringify(links) + "</pre>");
}

function addNodes(nodes) {
  $("#ftables_graph").append("<p> LOADED NODES </p> <pre>" + array_to_str(nodes) + "</pre>")
}