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

    metadatas: {
        type: 'json'
    },

    extractRefLink : function(){
        var re = /\[([^\]]+)\]\(([^)]+)\)/g;
        var m;

        var listLink = [];
        while ((m = re.exec(this.content)) != null) {
            if (m.index === re.lastIndex) {
                re.lastIndex++;
            }
            var link = {};
            link["label"] = m[1];
            link["uri"] = m[2];
            listLink.push(link);
        }
        return listLink;
    },


     createJsonGraph : function(){

          var linkRef = this.extractRefLink();
          var graph = "{ ";

          var nodes = ' "nodes" : [ ';

          var links = ' "links": [ ';

          nodes += " { ";
          nodes += ' "name" : "'+this.title+'" ,';
          nodes += ' "id" : "'+this.id+'" ,';
          nodes += ' "ref" : "base"';
          nodes += ' },';

          for (var i = 0; i < linkRef.length ; i++) {
            var link = linkRef[i];
            nodes += " { ";
            nodes += ' "name" : "'+link.label+'" ,';
            var ref = "wikipedia";
            if(link.uri.indexOf("##refInner##") == 0){

              var id = link.uri.replace("##refInner##", "");
              nodes += ' "id" : "'+id+'" ,';
              // nodes += ' "idArticle" : "'+id+'"';
              ref = "interne";
            }
            nodes += ' "ref" : "'+ref+'"';
            nodes += ' },';


            links += " { ";
            links += ' "source" : 0 ,';
            links += ' "target" : '+(i+1)+',';
            var value = 15;
            if(link.uri.indexOf("##refWiki##") == 0)
              value = 5;
            links += ' "value" : '+value;
            links += ' },';
          }
          nodes += ']';
          links += ']';

          graph += nodes + ' ,'+links+' }';
          graph = eval("(" + graph+ ")");
          return graph;

     }



  }
};

