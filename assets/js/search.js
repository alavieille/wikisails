$(document).ready(function(){
	$("#searchArticle").on('keyup paste', searchArticle);
	$("#searchAside").keypress(searchAside);
});

// Cherche parmis les articles internes
var searchArticle = function(){
  var content = $(this).val();
  $.getJSON( "/article/search/"+content, function(result) {
      var resHtml = "";
      if(result.length == 0)
        resHtml += "<p> Aucun résultat </p>";
      else{
        resHtml += "<div class='list-group'>";
        $.each(result,function(index, element) {
          resHtml += "<a class='ref-wiki list-group-item' href='/article/"+element.id+"'>";
     	  resHtml += "<h4>"+element.title+"</h4>";
     	  resHtml += "<p>"+element.abstract+"<p/>";
     	  resHtml += "<div class='list-group-separator'></div>";
        });
        resHtml += "</div>";
      }
      $("#search-result").html(resHtml);
  });
}

var searchAside = function(e) {
	if (e.which == 13) {
		if ($(this).is(':focus')) {
			var content = $(this).val();
			var url = "/article/search/"+content;
			window.location.replace(url);
		} 
	}
}