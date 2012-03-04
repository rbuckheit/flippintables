var nodes = [{"title":"test1", "image":"images/facebook.ico", "fixed":true, "x":5, "y":5}, 
  {"title":"test2", "image":"images/google.ico", "x":20, "y":20}];
var links = [{"source":0, "target":1}];

var svg = d3.select("#graph").
              append("svg:svg").
              attr("width", 960).
              attr("height", 500);
              
var graph = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .size([960, 500])
      // .friction(0)
      .gravity(0)
      .linkDistance(50)
      // .linkStrength(0)
      // .charge(0)
      .start();

var link = svg.selectAll("line.link")
       .data(links)
       .enter().append("line")
       .attr("class", "link")
       .attr("style","stroke:rgb(0,0,0);stroke-width:1;");
      
var node = svg.selectAll("g.node")
              .data(nodes)
              .enter().append("svg:g")
              .attr("class", "node")
              .call(graph.drag)
              .on("click", function(){console.log("click");});
node.append("svg:image")
              .attr("width",16)
              .attr("height",16)
              .attr("x",-8)
              .attr("y",-8)
              .attr("xlink:href", function(d){return d.image;})

graph.on("tick", function() {
     link.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });
 
     node.attr("transform", function(d) {return "translate(" + d.x+ "," + d.y + ")";});
     // node.attr("x", function(d) { return d.x; })
     //     .attr("y", function(d) { return d.y; });
    });

