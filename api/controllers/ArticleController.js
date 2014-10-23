/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	create : function(req,res){
		 
		  if(req.method=="POST"	&& req.param("Article",null)!=null){
		     Article.create(req.param("Article")).exec(function(err,created){
		     	if(err)
		     		return res.view({errors:err,article:req.param("Article")});
  				console.log(created);
  			});

		  }
		  return res.view();
	},


	list : function(req,res){
		Article.find({}).exec(function(err,articles){
			res.view({articles:articles});
 		});
	},

	view : function(req,res){
		console.log(req.param('id'));
		if(req.param('id')==null)
			return res.notFound("Paramêtre manquant");
		Article.findOne({id:req.param('id')}).exec(function(err,article){
			 if (err) return res.serverError(err);
  			 if (!article) return res.notFound(article);
  			 console.log(article.title);
  			 return res.view({article:article});
  		});
	}
};

 