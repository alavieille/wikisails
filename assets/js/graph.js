$(document).ready(function() {
	var idArticle = $("#id-article").val();
	$("#linkPrevious").hide();
	$("#linkPrevious").click(showPrevious);


	console.log(idArticle);
	if(idArticle){
		generateGraph(idArticle);
	}

});

var showPrevious = function()
{
	idArticle = $(this).attr("href");
	generateGraph(id);
	return false;
}



var generateGraph = function(id){
	$("#linkPrevious").attr("href",$("#id-article").val());
	$("#id-article").val(id);
	if($("#linkPrevious").attr("href") != $("#id-article").val())
		$("#linkPrevious").show();
	$("#graph").html("");
	$.getJSON( "/article/reflink/"+id, function(data) {
		console.log(data);
		initGraph(data);
	})
	.fail(function() {
		console.log( "error" );
		})

	console.log(id);
}

var initGraph = function(graph){
	var width  = 800,
	    height = 400;

	var color = d3.scale.category20();

	var force = d3.layout.force()
	    .charge(-1000)
	    .size([width, height]);

	var svg = d3.select("#graph").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	svg.selectAll("g").remove();
    svg.selectAll("line.link").remove();


      force
          .nodes(graph.nodes)
          .links(graph.links)
          .linkDistance(function(d){return d.value * 10})
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
                    .attr("class", "node")
                   .call(force.drag)
                   .on('click',function(node){if(node.id){generateGraph(node.id)}});

        nodeInner.append("circle")
                 .attr("r", function(d){if(d.ref=="interne")return 30; else return 5})
                .style("fill", function(d) {  switch (d.ref){
                                          case "interne":
                                            return "red"
                                            break;
                                          case "wikpedia":
                                            return "green"
                                            break;        
                                          }})

        var text = nodeInner.append("text")
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("stroke", "black")
            .attr("stroke-width","0px")
            .attr("dy", function(d){if(d.ref=="interne")return "3em"; else return "-1.35em"})
            .text(function(d) { return d.name; });

      node.append("title")
          .text(function(d) { return d.name; });

      force.on("tick", function() {

      link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
     
     node.attr("transform", function(d) { return "translate(" + d.x + ","
    + d.y + ")"; });

      });

}

