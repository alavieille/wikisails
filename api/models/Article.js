/**
* Article.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	id: {
  		type: 'integer', 
   		primaryKey: true,
    	autoIncrement: true
  	},
  	
  	title: {
  		type: 'string',
  		required: true,
  	},

    abstract: {
      type : 'text',
    },
    
  	content: {
  		type: 'text',
  		required: true,
  	},

  }
};

