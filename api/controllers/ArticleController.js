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
  			    return res.redirect("/article/"+created.id);
  			});

		  }
		  else
		  	return res.view();
	},


	list : function(req,res){
		Article.find({}).exec(function(err,articles){
			console.log(articles);
			res.view({articles:articles});
 		});
	},

	view : function(req,res){
		if(req.param('id')==null)
			return res.notFound("Paramêtre manquant");
		Article.findOne({id:req.param('id')}).exec(function(err,article){
			console.log(article);
			 if (err) return res.serverError(err);
  			 if (!article) return res.notFound(article);
  			 return res.view({article:article});
  		});
	},

	edit: function(req,res){
		if(req.param('id')==null)
			return res.notFound("Paramêtre manquant");
		if(req.method=="POST" && req.param("Article",null)!=null){
			Article.update({id:req.param('id')},req.param("Article")).exec(function(err,updated){
		 		if(err)
		      		return res.view("article/create",{errors:err,article:req.param("Article")});
				return res.redirect("/article/"+created.id);
		 	});
		}
		else {
		  	Article.findOne({id:req.param('id')}).exec(function(err,article){
		  	 if (err) return res.serverError(err);
  			 if (!article) return res.notFound(article);
  			 return res.view("article/create",{article:article});
  			});
		}

	},

	delete : function(req,res){
		if(req.param('id')==null)
			return res.notFound("Paramêtre manquant");
		Article.destroy({id:req.param('id')}).exec(function(err){  
			req.flash('info', 'Article supprimé')
  			res.redirect('/article/');
		});
	}
};

 