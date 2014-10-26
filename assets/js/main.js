$(function(){
	console.log("// Wiki sails");

	var content = $("article .article-content").html();
	console.log(content);
	$("article .article-content").html(markdown.toHTML(content));
});