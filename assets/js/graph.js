$(document).ready(function() {
	var idArticle = $("#id-article").val();
	if(idArticle){
    generateGraph(idArticle);
    history.pushState({id: idArticle});
  }

  window.onpopstate = function(event) {
    console.log(event);
    var state = event.state;
    if(state != null)
      generateGraph(state.id);
    else
      history.back();

  };


});

var clickNode = function(node){
  if(node.id){
    history.pushState({id: node.id});
    generateGraph(node.id)
  }
}


var generateGraph = function(id){

  // $("#linkPrevious").attr("href",$("#id-article").val());
  // console.log(history.pushState({id: id},"graph : "+id, "#"+id));
	// $("#id-article").val(id);

	$("#graph").html("");

	$.getJSON( "/article/reflink/"+id, function(data) {
		initGraph(data);
	})
	.fail(function() {
		console.log( "error" );
		})

}

var initGraph = function(graph){

  var width  = $("#graph").width();
	var height = $("#graph").height();

	var force = d3.layout.force()
	              .charge(nodeCharge)
                .friction(0.5)
	              .size([width, height]);

	var svg = d3.select("#graph").append("svg")
	             .attr("width", width)
	            .attr("height", height);

	svg.selectAll("g").remove();
  svg.selectAll("line.link").remove();


  force.nodes(graph.nodes)
       .links(graph.links)
       .linkDistance(function(d){return d.value * 20})
       .start();

  var link = svg.selectAll("line.link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .attr("stroke","black")
                .style("stroke-width", 2);


  var node = svg.selectAll("g")
                .data(graph.nodes);


  var nodeInner = node.enter().append("g")
                              .call(force.drag)
                              .style('cursor', function(d){if(d.ref=="base") return 'move'; else return 'pointer'})
                              .on('click',clickNode);

  nodeInner.append("circle")
           .attr("r", nodeSize)
           .attr("class", function(d){if(d.ref!="base") return "node-circle"})
           .style("fill", nodeColor)

  var text = nodeInner.append("text")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("stroke", "black")
      .attr("stroke-width","0px")
      .attr("dy", dxText)
      .text(function(d) { return d.name; });


  force.on("tick", function() {

      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
     
      node.attr("transform", function(d) { return "translate(" + d.x + ","+ d.y + ")"; });

  });

}



var nodeCharge = function(node){
  if(node.ref == "wikipedia")
    return -1000;
  else
    return -500;
}

// position du texte du noeud selon leurs type (article de base, reférence interne, ref wikipedia)
var dxText = function(node){
  switch (node.ref){
    case "interne":
      return "3em";
    case "base":
      return "4em";
    case "wikipedia":
      return "-1em";
  }
}

// taille des noeuds selon leurs type (article de base, reférence interne, ref wikipedia)
var nodeSize = function(node){
  switch (node.ref){
    case "interne":
      return 20;
    case "base":
      return 40;
    case "wikipedia":
      return 3;
  }
}

// couleur des noeuds selon leurs type (article de base, reférence interne, ref wikipedia)
var nodeColor =  function(node) { 
  switch (node.ref){
    case "interne":
      return "#bbb";
    case "base":
      return "#444";
    case "wikipedia":
      return "black";
  }
}

