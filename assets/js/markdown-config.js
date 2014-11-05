// Variable représentant toutes les metadatas d'un article
var md = {};


// Configuration de l'éditeur de markdown pour la création et édition d'un article
$(document).ready(function() {
  // Initialisation des metadatas
  if($("#mdForm").val().length)
      md = JSON.parse($('#mdForm').val());

  $("#markdown-editor").markdown({
    //créer un bouton pour gérer les références d'un article
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
            // recherche des référence a wikipedia
            $("#searchRef").on('keyup paste', searhRef);
          }
        }]
      }]
    ]
  });

  // Recherche des articles wikipedia ayant le même titre
  $('input#titre').on('keyup paste', function(){
    var content = $(this).val();
    if (content.length > 1) {
      $('#res-art-dbpedia').html("<h5 class='text-center'>Recherche en cours ...</h5>");
      dbpedia.searchRef(content, extractArtDbpedia);
    }
  });

  // Fenètre modal d'ajout de namespaces
  $(document).on('click', '#nsModal', function(){
    $('#ns-modal').modal("show");
    return false;
  });

  // Validation et ajout du namespace
  $('#ajoutNs').on('click', function(){
    if ($('#nsName').val().length) {
      var ns = $('#nsName').val();
      $('#nsName').val("");

      addPanel(ns);
      md[ns] = {};
      updateForm();
      createVue();
      $('#ns-modal').modal("hide");
    } else {
      $('#nsName').addClass("has-error")
        .after(
          $('<p class="text-danger">Veuillez donner un nom au namespace.</p>')
        );
    }
  });

  // Validation du champ
  $('#nsName').on('keyup paste', function(){
    if ($(this).val().length) {
      $(this).removeClass('has-error')
        .next().remove();
    } else if (!$('#nsName + .text-danger').length) {
      $(this).addClass('has-error')
        .after(
          $('<p class="text-danger">Veuillez donner un nom au namespace.</p>')
        );
    }
  });

  // Fenètre modal d'ajout d'un attribut dans un namespace
   $(document).on('click','.attrModal',function(){
      console.log($(this));
      $('.ns-name').text($(this).data('ns'));

      $('#nsAttr-modal').modal('show');
      return false;
  });

  // Validation et ajout de l'attribut
  $('#ajoutAttr').on('click', function(){
    if ($('#attrName').val().length && $('#attrValue').val().length) {
      var ns = $('.ns-name').text(),
          attr = $('#attrName').val(),
          value = $('#attrValue').val();
      $('#attrName, #attrValue').val("");
      

      if (!md[ns][attr]) {
        md[ns][attr] = [];
      }

      // Ajout dans le modèle
      md[ns][attr].push({
        ns: "" + ns,
        uri: "",
        property: "" + attr,
        value: {
          ns: "",
          uri: "",
          property: "",
          value: "" + value
        }
      });
      updateForm();

      // Affichage des modifications
      updatePanel(ns);

      $('#nsAttr-modal').modal("hide");
    } else {
      if ($('#attrName').val().length) {

      }

      if ($('#attrValue').val().length) {

      }
    }
  });
});


// Recherche les références wikipedia
var searhRef = function(evt){
  var content = $(this).val();
  if(content.length > 1){
    $("#res-ref-article #res-dbpedia").html("<h5 class='text-center'>Recherche en cours ...</h5>");
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
  // $(document).on('click', "#wiki-modal #res-ref-article .ref-wiki", clickCreateRef);
   $("#res-ref-article #res-dbpedia .ref-wiki").click(clickCreateRef);
  // $("#res-ref-article #res-dbpedia .tt").click(clickCreateRef);

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
  $("#res-art-dbpedia .ref-wiki").on('click', clickLoadArticle);
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

    // Insertion dans le formulaire
    updateForm();
    createVue();

  });

  return false;
}

var createVue = function(){
      // Génération de la vue
    var accordion = $('<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true" />');
    $(".rightbar-content").empty().append('<h3>METADATA</h3>')
      .append(accordion)
      .append('<a id="nsModal" class="btn btn-default btn-block"><i class="glyphicon glyphicon-plus"></i> Ajouter un espace de noms</a>');

    for (ns in md) {
      var body = addPanel(ns),
          list = $('<dl />');
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
      body.append(
        $('<a href="#" data-ns="'+ns+'" class="btn btn-primary attrModal"><i class="glyphicon glyphicon-plus"></i> Ajouter un attribut</a>')
      );
    }
}

// Ajout d'un namespace dans la vue
var addPanel = function(namespace) {
  var panel =  $('<div class="panel panel-default" />');
  panel.append(
    '<div class="panel-heading" role="tab" id="' + namespace + '">' +
      '<h4 class="panel-title">' +
        '<a data-toggle="collapse" data-parent="#accordion" href="#collapse' + namespace + '" aria-expanded="true" aria-controls="collapse' + namespace + '">' +
          namespace +
        '</a>' +
      '</h4>' +
    '</div>'
  );

  panel.append(
    $('<div id="collapse' + namespace + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + namespace + '" />').append(
      $('<div class="panel-body"></div>')
    )
  );

  $('#accordion').append(panel);

  return $(panel).find('.panel-body').first();
};

// Mise à jour de la vue d'un namespace
var updatePanel = function(namespace) {
  var list = $('#' + namespace + ' + .panel-collapse .panel-body dl').empty();
  for (type in md[namespace]) {
    if (md[namespace][type][0].uri.length) {
      list.append(
        '<dt>' +
          '<a href="' + md[namespace][type][0].uri + '">' + namespace  + ':' + type + '</a>' +
        '</dt>'
      );
    } else {
      list.append('<dt>' + namespace  + ':' + type + '</dt>');
    }

    for (i in md[namespace][type]) {
      if (md[namespace][type][i].value.value.length) {
        list.append(
          '<dd>' +
            (md[namespace][type][i].value.uri.length ? '<a href="' + md[namespace][type][i].value.uri +'">' + md[namespace][type][i].value.value + '</a>' : md[namespace][type][i].value.value) +
          '</dd>'
        );
      } else {
        list.append(
          '<dd>' +
            '<a href="' + md[namespace][type][i].value.uri + '">' + md[namespace][type][i].value.namespace + ':' + md[namespace][type][i].value.property + '</a>' +
          '</dd>'
        );
      }
    }
  }
};

// Mise à jour du formulaire
var updateForm = function() {
  console.log(md);
  console.log(JSON.stringify(md));
  $('#mdForm').val(JSON.stringify(md));
};