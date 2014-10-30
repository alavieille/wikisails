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
            $("#wiki-modal #searchRef").on('change keyup paste', searhRef);
          }
        }]
      }]
    ]
  });

  $('input#titre').on('change keyup paste', function(){
    var content = $(this).val();
    if (content.length > 1) {
      $('#res-art-dbpedia').html("<h5 class='text-center'>Recherche en cours ...</h5>");

      dbpedia.searchRef(content, extractArtDbpedia);
    }
  });
});

var searhRef = function(evt){
  var content = $(this).val();
  if(content.length > 1){
    $("#wiki-modal #res-ref-article #res-dbpedia").html("<h5 class='text-center'>Recherche en cours ...</h5>");
    dbpedia.searchRef(content, extractRefDbpedia);
    searchRefWikiSails(content);
  }
}

// Cherche parmis les articles internes
var searchRefWikiSails = function(content){
  $.getJSON( "/article/search/"+content, function(result) {
      var resHtml = "";
      if(result.length == 0)
        resHtml += "<h5 class='text-center'> Aucun résultat </h5>";
      else{
        resHtml += "<ul class='list-group'>";
        $.each(result,function(index, element) {
          var label = element.title;
          resHtml += "<li class='ref-wiki list-group-item' data-uri='"+element.id+"'>"+label+'</li>';
        });
        resHtml += "</ul>";
      }
      $("#wiki-modal #res-ref-article #res-wikisails").html(resHtml);
      $("#wiki-modal #res-ref-article #res-wikisails .ref-wiki").click(clickCreateRef);
  });
}

// Extrait les resultats de dbpedia pour les références internes
var extractRefDbpedia = function(result){
  var resHtml = "";
  if(result.length == 0)
    resHtml += "<h5 class='text-center'>Aucun résultat</h5>";
  else{
    resHtml += "<ul class='list-group'>";
    $.each(result,function(index, element) {
      var label = element.label.value;
      var uriRessource = element.r.value;
      resHtml += "<li class='ref-wiki list-group-item' data-uri='"+uriRessource+"'>"+label+'</li>';
    });
    resHtml += "</ul>";
  }
  $("#wiki-modal #res-ref-article #res-dbpedia").html(resHtml);
  $("#wiki-modal #res-ref-article #res-dbpedia .ref-wiki").click(clickCreateRef);
}

// Clique sur un élement de la liste pour créer une reférence
var clickCreateRef = function(evt){
  var label = $(this).text();
  var uriRessource = $(this).data("uri");
  if(uriRessource.match("^http"))
    var link = "["+label+"](##refWiki##"+uriRessource+")";
  else
    var link = "["+label+"](##refInner##"+uriRessource+")";
  $("#markdown-editor").data('markdown').replaceSelection(link);
  $("#wiki-modal").modal("hide");
}

// Extrait les resultats de dbpedia pour les articles
var extractArtDbpedia = function(result){
  var resHtml = "";
  if (result.length == 0)
    resHtml += "<h5 class='text-center'>Aucun résultat</h5>";
  else {
    resHtml += "<ul class='list-group'>";
    $.each(result,function(index, element) {
      var label = element.label.value;
      var uriRessource = element.r.value;
      resHtml += "<li class='ref-wiki list-group-item' data-uri='"+uriRessource+"'>"+label+'</li>';
    });
    resHtml += "</ul>";
  }
  $("#res-art-dbpedia").html(resHtml);
  $(document).on('click', "#res-art-dbpedia .ref-wiki", clickLoadArticle);
}

// Clique sur un élement de la liste pour charger l'article
var clickLoadArticle = function(evt){
  $('input#titre').val($(this).text());
  $("#res-art-dbpedia").empty();

  dbpedia.getInfoRessource($(this).data('uri'), function(res){
    console.log(res[0]);
    $('textarea#abstract').val(res[0].abstract.value);
  });

  return false;
}