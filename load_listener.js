// When a page loads, this sends the favicon url and page title back to the graph.

$(document).ready(function() {
  var url = qualify(window.location.href);
  var favicon = $("link[rel$=icon]").attr("href")
  var title = "" //TODO jess
  
  chrome.extension.sendRequest({cmd: "node_info", url: url, favicon: favicon, title: title}, function(response) {
    console.log("RESPONSE: " + response.cmd);
  });
  
});