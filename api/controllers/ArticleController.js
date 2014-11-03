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
  			    return res.redirect("/article/"+created.id);
  			});

		  }
		  else
		  	return res.view();
	},


	list : function(req,res){
		Article.find({}).exec(function(err,articles){
			res.view({articles:articles});
 		});
	},

	getJsonRefLinkArticle : function(req,res){
		if(req.param('id')==null)
			return res.notFound("Paramètre manquant");
		Article.findOne({id:req.param('id')}).exec(function(err,article){
			 if (err) return res.serverError(err);
			 return res.json(article.createJsonGraph());
  		});
	},


	view : function(req,res){
		if(req.param('id')==null)
			return res.notFound("Paramètre manquant");
		Article.findOne({id:req.param('id')}).exec(function(err,article){
			 if (err) return res.serverError(err);
			 if (req.xhr) return res.json(article);
  			 if (!article) return res.notFound(article);
  			 return res.view({article:article});
  		});
	},

	graph : function(req,res){
		if(req.param('id')==null)
			return res.notFound("Paramètre manquant");
		Article.findOne({id:req.param('id')}).exec(function(err,article){
			 if (err) return res.serverError(err);
  			 if (!article) return res.notFound(article);
  			 return res.view({id:req.param('id')});
  		});
		
	},

	edit: function(req,res){
		if(req.param('id')==null)
			return res.notFound("Paramètre manquant");
		if(req.method=="POST" && req.param("Article",null)!=null){
			Article.update({id:req.param('id')},req.param("Article")).exec(function(err,updated){
		 		if(err)
		      		return res.view("article/edit/"+req.param('id'),{errors:err,article:req.param("Article")});
				return res.redirect("/article/"+req.param('id'));
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
			return res.notFound("Paramètre manquant");
		Article.destroy({id:req.param('id')}).exec(function(err){  
			req.flash('info', 'Article supprimé')
  			res.redirect('/article/');
		});
	},


	search : function(req,res){
		console.log("test");
		if(req.param('query')==null)
			return res.notFound("Paramètre manquant");
		else{
			Article.find({title : {'contains' : req.param('query')} }).exec(function(err,articles){  
			if (err) return res.serverError(err);
			if (req.xhr) return res.json(articles);
			else return res.view("article/list",{articles:articles});
			});
		}
	}

};

 