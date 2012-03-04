// When a page loads or unloads, this sends the favicon url and page title back to the graph.

var nodeInfo = function() {
  var url = qualify_url(window.location.href);
  var favicon_local = $("link[rel$=icon]").attr("href");
  var favicon;
  
  // check for undefined or empty string favicons.
  if (favicon_local === undefined || favicon_local == "") {  // triple equals, what what?
    favicon = window.location.origin + "/favicon.ico";
  } else {
    favicon = qualify_url(favicon_local);
  }
  var title = $("title").text();
  
  chrome.extension.sendRequest({cmd: "node_info", url: url, favicon: favicon, title: title}, function(response) {
    console.log("RESPONSE: " + response.cmd);
  });
};

$(document).ready(nodeInfo);

$(window).unload(nodeInfo);