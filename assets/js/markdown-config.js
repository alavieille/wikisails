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
      dbpedia.searchRef(content,extractRef);
  }
}



var extractRef = function(result){
  var resHthml = "";
  if(result.length == 0)
    resHthml += "<p> Aucun résultat </p>";
  else{
    resHthml += "<ul>";
    $.each(result,function( index, element ) {
      var label = element.label.value;
      var uriRessource = element.r.value;
      resHthml += "<li class='ref-wiki' data-uri='"+uriRessource+"'>"+label+'</li>';
    });
    resHthml += "</ul>";
  }
  $("#wiki-modal #res-wiki-article").html(resHthml);
  console.log("ok");
  $("#wiki-modal #res-wiki-article .ref-wiki").click(function(){
    console.log("ok");
    var label = $(this).text();
    var uriRessource = $(this).attr("data-uri");

    var link = "["+label+"](##refWiki##"+uriRessource+")";
    $("#markdown-editor").data('markdown').replaceSelection(link);
    $("#wiki-modal").modal("hide");
    // $("#markdown-editor").mardown().replaceSelection(label);
  });
}