$(document).ready(function() {

	// convert markdown
	var content = $("article .article-content").html();
	$("article .article-content").html(markdown.toHTML(content));


	$("article .article-content a[href^='##refWiki##'").click(getInformation);
});


// var getInformation = function(){
// 	var uri = $(this).attr("href").replace("##refWiki##", "");
// 	dbpedia.getInfoRessource(uri,showInformation,$(this));
// 	console.log(uri);
// 	$(this).popover({
// 			placement:'right',
// 			title:"Information",
// 			trigger:'focus', 
// 	        html : true, 
// 	        content: "<p>Chargement en cours ... </p>",
// 	});
// 	$(this).focus();
// 	return false;

// }
var getInformation = function(){
	var uri = $(this).attr("href").replace("##refWiki##", "");
	
	console.log(uri);
	$(this).popoverasync({
			placement:'right',
			trigger:'focus', 
	        html : true, 
	        content: function (callback, showContent){
	        	dbpedia.getInfoRessource(uri,function(result){
					 content = extractContent(result);
					 callback(showContent, content);
	        	});

	        },
	});
	$(this).focus();
	return false;

}

var extractContent = function(result){
	if( result.length > 0 ) {
		var abstract = result[0].abstract.value;
		var label = result[0].label.value;
		var thumbnail = (typeof result[0].thumbnail !== "undefined") ? result[0].thumbnail.value : null;
		var url = (typeof result[0].wikipage !== "undefined") ? result[0].wikipage.value : null;

		if(abstract.length > 600)
			abstract = abstract.substring(0, 600) + "...";
		var content = "<div>";
		content += "<p>";
		if(thumbnail)
			content += "<img src='"+thumbnail+"' alt='"+label+"' class='popover-thumbnail' />";
		content += abstract+"</p>";
		if(url)
			content += "<p>	<a href='"+url+"'>Liens vers wikipedia</a></p>";
		content += "</div>";
	}
	else 
		content = "<p class='text-center'> Aucun résultat </p>";
	return content;
}

