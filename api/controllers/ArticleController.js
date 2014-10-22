/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	create : function(req,res){
		 
		  if(req.method=="POST"	&& req.param("Article",null)!=null){
		  	 sails.log.info(req.method=="POST");  
		  	 sails.log.info(req.param("Article",null));  
		  	 sails.log.info("oki");  

		     Article.create(req.param("Article")).exec(function(err,created){
		     	console.log(err);
  				// console.log('Created user with name '+created.title);
  			});

		  }
		  sails.log.info("view");  
		  res.view();
	}	
};

 // findByPseudo: function (req, res) {     
 // 	sails.log.debug("*******************findByPseudo");     
 // 	User.findOneByPseudo(req.body.pseudo).done(function (err, user) { 
 // 	      if (err) res.json({ error: 'oups error' }, 500);       
 // 	      if (user) {  
 // 	               res.json(user)
 // 	       } 
 // 	      else {         
 // 	      	res.json({ message: 'User not found' });       
 // 	      }    
 // 	  });   
 // 	}
