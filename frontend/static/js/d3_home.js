var targetDiv = $(".copy");
    //targetDiv.html("");

var color = d3.scale.ordinal().range(["#EBE7CE", "#CEC2CE", "#B8C7E6"]);

d3.json("flare.json", function(msg, data) {
console.log(data);

var width = targetDiv.width(),
		    height = 600,
		    padding = 1.5,
		    maxRadius = 12;

var nodes = normalize(data);

// Use the pack layout to initialize node positions.
	d3.layout.pack()
				.sort(null)
				.size([width, height])
				.children(function(d) { return d.values; })
				.value(function(d) { return d.radius * d.radius; })
				.nodes(nodes);

var force = d3.layout.force()
				.nodes(nodes)
				.size([width, height])
				.gravity(5)
				.charge(0)
				.on("tick", tick)
				.start();

var svg = d3.select("#bubble").append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("class", "bubble");

var node = svg.selectAll("a")
				.data(nodes)
				.enter()
				.append("a")
				.attr("data-feature", function(d){ return d.name;})
				.call(force.drag);

	node.transition()
		    .duration(750)
		    .delay(function(d, i) { return i * 5; });

var positiveG = node.append("g")
                    .attr("class", "posG")
					.style("z-index", "2");

	/*positiveG.append("clipPath")
		    .attr('id', function(d) { return "clip" + d.index })
		    .append('rect')
		    .attr("x", function(d, i){ return -d.radius;})
		    .attr("width", function(d, i){ return 2 * d.radius;})
		    .attr("y", function(d, i) {return -d.radius;})
		    .attr("height", function(d) {return 2  * d.radius;}); */

	positiveG.append("circle")
		    .attr("r", function(d){ return 2; })
		    //.attr("clip-path", function(d){ return "url(#clip" + d.index + ")"; } )
		    .style("fill", function(d) { return color(d.name); });


var textNode = node.append("title")
                       .attr("class", "textNodes");
    
    textNode.append("text")
        .text(function(d) { return d.className+ ": " + format(d.value); })
        .attr("dy", "0.3em")
        .attr("class", "labelName")
        .style("text-anchor", "middle")
        .style("font-size", function(d){ return d.fontSize.toString() + "px"; });


function tick(e) {
      node.selectAll("circle")
          .each(collide(.5));
      
      node.attr("transform", function(d) { 
            d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
            d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
            return "translate(" + d.x + "," + d.y + ")";
      		});
    }


// Resolves collisions between d and all other circles.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

//Method to normalize the data
function normalize(data){
    var range = [0, 100];
    var fontRange = [14, 40];
    
    var minR = _.min(data, function(d){return d.size});
    minR = minR.size;
    
    var maxR = _.max(data, function(d){return d.size});
    maxR = maxR.size;
    
    data = data.map(function(d){
        d.radius = (d.size - minR) / maxR;
        d.fontSize = (d.radius * (fontRange[1] - fontRange[0])) + fontRange[0];
        d.radius = (d.radius * (range[1] - range[0])) + range[0];
        return d;
    });
    
    return data;
}
    
});	
