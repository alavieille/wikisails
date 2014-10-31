/**
* Article.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	title: {
  		type: 'string',
  		required: true,
  	},

    abstract: {
      type : 'text',
      required: true,
    },
    
  	content: {
  		type: 'text',
  		required: true,
  	},

    extractRefLink : function(){
        var re = /\[([^\]]+)\]\(([^)]+)\)/g; 
        var m;
        var links = ' "links" : [ ';
        while ((m = re.exec(this.content)) != null) {
            if (m.index === re.lastIndex) {
                re.lastIndex++;
            }
            var link = '{ ';
            link += ' "label" : "'+m[1]+ '" ,'; 
            link += ' "uri" : "'+m[2]+ '"'; 
            link +=' },';

            links += link;
        }
        links += ']';
        var resjson = '{ '+links+' }';
        return eval("(" + resjson+ ")");
    },



  }
};

