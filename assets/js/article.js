$(document).ready(function() {

	// convert markdown
	var content = $("article .article-content").html();
	$("article .article-content").html(markdown.toHTML(content));


	$('article .article-content a[href^="##refWiki##"]').click(getInformationDbpedia);
	$('article .article-content a[href^="##refInner##"]').click(getInformationInner);
	createLinkSideBarRelation();
});


var createLinkSideBarRelation = function(){

	var linksRefInner = $('article .article-content a[href^="##refInner##"]');
	var linksRefWiki = $('article .article-content a[href^="##refWiki##"]');
	var content = "";
	if(linksRefInner.length > 0 ){
		content += "<h5 class='text-center'>Relations interne</h5>";
		content += createListRefHtml(linksRefInner);
	}
	if(linksRefWiki.length > 0 ){
		content += "<h5 class='text-center'>Relations wikipedia</h5>";
		content += createListRefHtml(linksRefWiki);
	}
	
	$(".list-relations").html(content);
}


var createListRefHtml = function(listLink){
	
	res = "<ul>";
	listLink.each(function(index,value){
		var href = $(value).attr("href");
		var content = $(value).text();
		if(href.indexOf("##refWiki##") == 0)
			href = href.replace("##refWiki##", "");
		else {
			href = href.replace("##refInner##", "");
			href = "/article/"+href;
		}
		res += "<li> <a href='"+href+"''>"+content+"</a></li>";
	});
	res += "</ul>";
	return res;
}

var getInformationInner = function(){
	var uri = $(this).attr("href").replace("##refInner##", "");
	console.log(uri);
	
	$(this).popoverasync({
			placement:'right',
			trigger:'focus', 
	        html : true, 
	        content: function (callback, extensionRef){
	        	$.getJSON( "/article/"+uri, function(result) {
	        		 content = extractContentInner(result);
	        		 callback(extensionRef, content);
	        	});

	        },
	});
	$(this).focus();
	return false;

}

var getInformationDbpedia = function(){
	var uri = $(this).attr("href").replace("##refWiki##", "");
	

	$(this).popoverasync({
			placement:'right',
			trigger:'focus', 
	        html : true, 
	        content: function (callback, extensionRef){
	        	dbpedia.getInfoRessource(uri,function(result){
					 content = extractContentDbpedia(result);
					 callback(extensionRef, content);
	        	});

	        },
	});
	$(this).focus();
	return false;

}


var extractContentInner = function(result){
	if( typeof result != undefined ) {
		var abstract = result.abstract;
		var label = result.title;
		var url = "/article/"+result.id;;
		if(abstract.length > 600 )
			abstract = abstract.substring(0, 600) + "...";
		var content = "<div>";
		content += "<h4>"+label+"</h4>";
		content += "<p>";
		content += abstract+"</p>";
		if(url)
			content += "<p>	<a href='"+url+"'>Liens vers l'article</a></p>";
		content += "</div>";
	}
	else 
		content = "<p class='text-center'> Aucun résultat </p>";
	return content;
}

var extractContentDbpedia = function(result){
	if( result.length > 0 ) {
		var abstract = result[0].abstract.value;
		var label = result[0].label.value;
		var thumbnail = (typeof result[0].thumbnail !== "undefined") ? result[0].thumbnail.value : null;
		var url = (typeof result[0].wikipage !== "undefined") ? result[0].wikipage.value : null;

		if(abstract.length > 600)
			abstract = abstract.substring(0, 600) + "...";
		var content = "<div>";
		content += "<h4>"+label+"</h4>";
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

