// insert graph div in to page

$(document.body).append("<div id=\"ftables_graph\"></div>")

// bind hotkeys

$(document).bind("keydown", "ctrl+g", function() {
  $("#ftables_graph").css("display","block");
  return false;
});