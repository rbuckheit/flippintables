// When a page loads, this sends the favicon url and page title back to the graph.

$(document).ready(function() {
  var url = qualify_url(window.location.href);
  var favicon_local = $("link[rel$=icon]").attr("href");
  
  // check for undefined favicons.
  if (favicon_local === undefined) {  // triple equals, what what?
    favicon = "";
  } else {
    favicon = qualify_url(favicon_local);
  }
  var title = "" //TODO jess
  
  chrome.extension.sendRequest({cmd: "node_info", url: url, favicon: favicon, title: title}, function(response) {
    console.log("RESPONSE: " + response.cmd);
  });
  
});