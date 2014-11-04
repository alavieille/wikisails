var dbpedia = new function(){
	this.url = "http://dbpedia.org/sparql";
	this.url = "http://fr.dbpedia.org/sparql";

	// Recherche les référence wikipedia correspondant au contenue de la recherche (contentSearch)
	this.searchRef = function(contentSearch,callback,paremeter){
		var query = [
			 "SELECT DISTINCT ?r ?label ?abstract",
			 "WHERE {",
			        "?r rdfs:label ?label .",
		            "FILTER (lang(?label) = 'fr').",
		            "?label bif:contains '\""+contentSearch+"\"' .",
		            "?r dbpedia-owl:abstract ?abstract .",
		            "FILTER (lang(?abstract) = 'fr').",
			 "} LIMIT 10"
		].join(" ");

		this.execQuery(query,callback);
	};

	// Récupére l'abstract, l'image et lien vers wiki du ressources selon sont uri du type (< http//:dbpedia.org/ressource/nom_de_la_ressource>)
	this.getInfoRessource = function(Uriressource,callback,parameter){
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

 		this.execQuery(query,callback,parameter);
	};


	// Récupére toutes les informations d'une ressource
    this.getAllRessource = function(Uriressource, callback) {
        var query = [
            "SELECT * WHERE {",
                "<"+Uriressource+"> ?p ?o.",
                "FILTER (lang(?o) = 'fr' || lang(?o) = '' || isIRI(?o)).",
            "}"
        ].join(" ");

        this.execQuery(query,callback);
    };


    // execute une requête en sparql
    // $query requête sparql
    // callback function appeler une fois la requête terminé
    // parameter parametre a transmettre à la fonction de callback
	this.execQuery = function(query,callback,parameter){
		// console.log(query);
		var queryUrl =  this.url+"?query="+ encodeURIComponent(query) +"&format=json";
		$.ajax({
	        dataType: "jsonp",
	        url: queryUrl,
	        success: function( _data ) {
	            var results = _data.results.bindings;
	           	callback(results,parameter);
	        }
    	});
	}
}