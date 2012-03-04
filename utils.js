// Hack to turn relative urls into fully qualified.
// source: http://stackoverflow.com/questions/8291651/get-full-url-from-a-hyperlink-using-jquery-javascript
function qualify_url(url) {
	var img = document.createElement('img');
	img.src = url;
	url = img.src;
	img.src = null;
	return url;
}

function array_to_str(array) {
  var str = ""
  for (i = 0; i < array.length; i += 1) {
    str += JSON.stringify(array[i]) + "\n";
  }
  return str;
}