$(document).ready(function() {
  $("#markdown-editor").markdown({
      additionalButtons: [
        [{
              name: "groupCustom",
              data: [{
                name: "wikiRed",
                toggle: false,
                title: "Réference wiki",
                icon: "glyphicon glyphicon-book",
                callback: function(e){


                  $("#wiki-modal").modal("show");
                  $("#wiki-modal #searchRef").on('change keyup paste',searhRef);

                }
              }]
        }]
      ]
    })
});


var searhRef = function(evt){
  var content = $(this).val();
  if(content.length > 1){
      $("#wiki-modal #res-ref-article #res-dbpedia").html("<h5 class='text-center'>Recherche en cour ...</h5>");
      dbpedia.searchRef(content,extractRefDbpedia);
      searchRefWikiSails(content);
  }
}

// Cherche parmis les articles internes
var searchRefWikiSails = function(content){
  $.getJSON( "/article/search/"+content, function(result) {
      var resHthml = "";
      if(result.length == 0)
        resHthml += "<h5 class='text-center'> Aucun résultat </h5>";
      else{
        resHthml += "<ul class='list-group'>";
        $.each(result,function( index, element ) {
          var label = element.title;
          resHthml += "<li class='ref-wiki list-group-item' data-uri='"+element.id+"'>"+label+'</li>';
        });
        resHthml += "</ul>";
      }
      $("#wiki-modal #res-ref-article #res-wikisails").html(resHthml);
      $("#wiki-modal #res-ref-article #res-wikisails .ref-wiki").click(clickCreateRef);
  });
}

// Extrait les resultat de dbpedia
var extractRefDbpedia = function(result){

  var resHthml = "";
  if(result.length == 0)
    resHthml += "<h5 class='text-center'> Aucun résultat </h5>";
  else{
    resHthml += "<ul class='list-group'>";
    $.each(result,function( index, element ) {
      var label = element.label.value;
      var uriRessource = element.r.value;
      resHthml += "<li class='ref-wiki list-group-item' data-uri='"+uriRessource+"'>"+label+'</li>';
    });
    resHthml += "</ul>";
  }
  $("#wiki-modal #res-ref-article #res-dbpedia").html(resHthml);
  $("#wiki-modal #res-ref-article #res-dbpedia .ref-wiki").click(clickCreateRef);
}

// Clique sur un élement de la liste pour créer une reférence
var clickCreateRef = function(evt){
    var label = $(this).text();
    var uriRessource = $(this).attr("data-uri");
    if(uriRessource.match("^http"))
      var link = "["+label+"](##refWiki##"+uriRessource+")";
    else 
      var link = "["+label+"](##refInner##"+uriRessource+")";
    $("#markdown-editor").data('markdown').replaceSelection(link);
    $("#wiki-modal").modal("hide");
}