$(document).ready(function() {
		console.log("// Wiki sails");
		if($("article .article-content").length){
			var content = $("article .article-content").html();
			$("article .article-content").html(markdown.toHTML(content));
		}
		// var query = [
		//  "SELECT DISTINCT ?s ?label ?abstract",
		//  "WHERE {",
		//         "?s rdfs:label ?label .",
	 //            "FILTER (lang(?label) = 'fr').",
	 //            "?label bif:contains 'Obama' .", 
	 //            "?s dbpedia-owl:abstract ?abstract .",
	 //            "FILTER (lang(?abstract) = 'fr').",
		//  "} LIMIT 10"
		// ].join(" ");

		// dbpedia.searchRef("obama",function(result){console.log(result);});
		// dbpedia.getInfoRessource("http://fr.dbpedia.org/resource/Administration_Obama",function(result){console.log(result);});

});



// $(function(){
// 	console.log("// Wiki sails");
// 	if($("article .article-content").length){
// 		var content = $("article .article-content").html();
// 		$("article .article-content").html(markdown.toHTML(content));
// 	}
// 	// var query = [
// 	//  "SELECT DISTINCT ?s ?label ?abstract",
// 	//  "WHERE {",
// 	//         "?s rdfs:label ?label .",
//  //            "FILTER (lang(?label) = 'fr').",
//  //            "?label bif:contains 'Obama' .", 
//  //            "?s dbpedia-owl:abstract ?abstract .",
//  //            "FILTER (lang(?abstract) = 'fr').",
// 	//  "} LIMIT 10"
// 	// ].join(" ");

// 	dbpedia.searchRef("obama",function(result){console.log(result);});
// 	// dbpedia.getInfoRessource("Barack Obama",function(result){console.log(result);});
// });




// SELECT DISTINCT ?s ?label ?abstract WHERE {
//             ?s rdfs:label ?label . 
//             FILTER (lang(?label) = 'fr'). 
//             ?label bif:contains "Obama" . 
//             ?s dbpedia-owl:abstract ?abstract .
//             FILTER (lang(?abstract) = 'fr'). 
// } LIMIT 10

      // PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
      // PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      // PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      // SELECT ?label ?abstract ?thumbnail ?wikipage
      // where {
      //   <http://fr.dbpedia.org/resource/Association_pour_le_maintien_d'une_agriculture_paysanne> rdfs:label ?label .
      //   <http://fr.dbpedia.org/resource/Association_pour_le_maintien_d'une_agriculture_paysanne> dbpedia-owl:abstract ?abstract .
      //   OPTIONAL {
      //     <http://fr.dbpedia.org/resource/Association_pour_le_maintien_d'une_agriculture_paysanne> dbpedia-owl:thumbnail ?thumbnail .
      //   }
      //   OPTIONAL {
      //     <http://fr.dbpedia.org/resource/Association_pour_le_maintien_d'une_agriculture_paysanne> foaf:isPrimaryTopicOf ?wikipage .
      //   }
      // }