var dbpedia = new function(){
	this.url = "http://dbpedia.org/sparql";

	this.searchRef = function(contentSearch,callback){
		var query = [
			 "SELECT DISTINCT ?r ?label ?abstract",
			 "WHERE {",
			        "?r rdfs:label ?label .",
		            "FILTER (lang(?label) = 'fr').",
		            "?label bif:contains '"+contentSearch+"' .", 
		            "?r dbpedia-owl:abstract ?abstract .",
		            "FILTER (lang(?abstract) = 'fr').",
			 "} LIMIT 10"
		].join(" ");

		this.execQuery(query,callback);
	};

	this.getInfoRessource = function(Uriressource,callback){
		var query = [
			"SELECT ?label ?abstract ?thumbnail ?wikipage",
			"WHERE {",
				"<"+Uriressource+"> rdfs:label ?label .",
				"<"+Uriressource+"> dbpedia-owl:abstract ?abstract .",
				"FILTER (lang(?abstract) = 'fr').",
				"OPTIONAL {",
          			"<"+Uriressource+"> dbpedia-owl:thumbnail ?thumbnail .",
      			"}",
    			"OPTIONAL {",
    				"<"+Uriressource+"> foaf:isPrimaryTopicOf ?wikipage .",
    			"}",
    		"} LIMIT 1",
 		].join(" ");

 		console.log(query);
 		this.execQuery(query,callback);
	};

	this.execQuery = function(query,callback){
		var queryUrl =  this.url+"?query="+ encodeURIComponent(query) +"&format=json";
		$.ajax({
	        dataType: "jsonp",  
	        url: queryUrl,
	        success: function( _data ) {
	            var results = _data.results.bindings;
	           	callback(results);
	        }
    	});
	}
}