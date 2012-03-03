/* Listens for link click events */

// push a new link/dest node when we go to the next page
$("a").click(function() {
	var src = qualify(window.location.href);
	var dest = qualify($(this).attr("href"));
	console.log("ADD LINK: " + src + "-->" + dest);
	
	chrome.extension.sendRequest({cmd: "add_link", src: src, dest: dest}, function(response) {
    console.log("RESPONSE: " + response.cmd);
  });
})

// Hack to turn relative urls into fully qualified.
// source: http://stackoverflow.com/questions/8291651/get-full-url-from-a-hyperlink-using-jquery-javascript
function qualify(url) {
	var img = document.createElement('img');
	img.src = url;
	url = img.src;
	img.src = null;
	return url;
}