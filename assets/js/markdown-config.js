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
    $('textarea#abstract').val(res[0].abstract.value);
  });

  dbpedia.getAllRessource($(this).data('uri'), function(result){
    // Construction du modèle
    var md = {};
    for (i in result) {
      var triple = result[i],
        pFound = false,
        oFound = false,
        dataStruct = {
          ns: "",
          uri: "",
          property: "",
          value: {
            ns: "",
            uri: "",
            property: "",
            value: ""
          }
        };

      // L'objet est un littéral
      if (triple.o.type == "literal" || triple.o.type == "typed-literal") {
        dataStruct.value.value = triple.o.value;
        oFound = true;
      }

      dataStruct.uri = triple.p.value;

      // Recherche de namespace pour le prédicat et l'objet
      for (j in namespaces) {
        var ns = namespaces[j];
        if (!pFound && (resRegPredicat = ns.re.exec(triple.p.value)) != null) {
          pFound = true;
          dataStruct.ns = ns.ns;
          dataStruct.property = resRegPredicat[1];
        }

        if (!oFound && (resRegObjet = ns.re.exec(triple.o.value)) != null) {
          oFound = true;
          dataStruct.value.ns = ns.ns;
          dataStruct.value.uri = triple.o.value;
          dataStruct.value.property = resRegObjet[1];
        }
      }

      // Utilise l'url complète si namespace inconnu pour le prédicat
      if (!pFound) {
        dataStruct.ns = triple.p.value;
      }

      // Utilise l'url complète si namespace inconnu pour l'objet
      if (!oFound) {
        dataStruct.value.value = triple.o.value;
        dataStruct.value.uri = triple.o.value;
      }

      // Création du namespace dans la structure de données si besoin
      if (!md[dataStruct.ns]) {
        md[dataStruct.ns] = {};
      }

      // Création du type dans la structure de données si besoin
      if (!md[dataStruct.ns][dataStruct.property]) {
        md[dataStruct.ns][dataStruct.property] = [];
      }

      md[dataStruct.ns][dataStruct.property].push(dataStruct);
    }

    // Génération de la vue
    var accordion = $('<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true" />');
    for (ns in md) {
      var panel =  $('<div class="panel panel-default" />');
      panel.append(
        '<div class="panel-heading" role="tab" id="' + ns + '">' +
          '<h4 class="panel-title">' +
            '<a data-toggle="collapse" data-parent="#accordion" href="#collapse' + ns + '" aria-expanded="true" aria-controls="collapse' + ns + '">' +
              ns +
            '</a>' +
          '</h4>' +
        '</div>'
      );

      var body = $('<div class="panel-body"></div>');
      var list = $('<dl />');
      for (type in md[ns]) {
        list.append(
          '<dt>' +
            '<a href="' + md[ns][type][0].uri + '">' + ns  + ':' + type + '</a>' +
          '</dt>'
        );

        for (i in md[ns][type]) {
          if (md[ns][type][i].value.value.length) {
            list.append(
              '<dd>' +
                (md[ns][type][i].value.uri.length ? '<a href="' + md[ns][type][i].value.uri +'">' + md[ns][type][i].value.value + '</a>' : md[ns][type][i].value.value) +
              '</dd>'
            );
          } else {
            list.append(
              '<dd>' +
                '<a href="' + md[ns][type][i].value.uri + '">' + md[ns][type][i].value.ns + ':' + md[ns][type][i].value.property + '</a>' +
              '</dd>'
            );
          }
        }
      }

      body.append(list);
      panel.append(
        $('<div id="collapse' + ns + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + ns + '" />').append(body)
      );
      accordion.append(panel);
    }
    $(".rightbar-content").empty().append('<h3>METADATA</h3>');
    $(".rightbar-content").append(accordion);
  });

  return false;
}