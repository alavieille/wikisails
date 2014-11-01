$(document).ready(function(){
	$("#searchArticle").change(searchArticle);

});

var searchArticle = function() {
	var query = $(this).val();

	var url = $(this).parents("form").attr("action");

	console.log(url);
}