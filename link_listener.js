/* Listens for link click events */

// push a new link/dest node when we go to the next page
$("a").click(function() {
	var src = qualify_url(window.location.href);
	var dest = qualify_url($(this).attr("href"));
	console.log("ADD LINK: " + src + "-->" + dest);
	
	chrome.extension.sendRequest({cmd: "add_link", src: src, dest: dest}, function(response) {
    console.log("RESPONSE: " + response.cmd);
  });
})