var csvjson = require('csvjson');
var async=require('async');
var prompt = require('prompt');
var fs = require('fs');
var _=require("underscore"); //http://devdocs.io/underscore-object/
var convert= require('./convert_BOM_to_CSV');

var liste={
		REPERE:function(filename){
			console.log(filename);
			var MYCSV=csvjson.toObject(filename);
			 // console.log(MYCSV);
			var Ref1=_.map(MYCSV,function(item){
				return item;
			})
			// console.log('res'+Ref1);
			Ref1=Ref1[0];
			// var result="nop";
		 	var result=_.map(Ref1,function(item){
		 		return item.REFERENCE;
		 	});
		 	// console.log('res'+result);
		 	return result
		},
		CODE:function(filename){
			var MYCSV=csvjson.toObject(filename);
			var Ref1=_.map(MYCSV,function(item){
				return item;
			})
			Ref1=Ref1[0];
		 	return _.map(Ref1,function(item){
		 		return [item.REFERENCE,item.NOMCODE];
		 	});
		}
	};

var main=function(filename1,filename2){
	var BOMA=liste.REPERE('./input/'+filename1+'mod.txt');
	var BOMB=liste.REPERE('./input/'+filename2+'mod.txt');
	var BOMACode=liste.CODE('./input/'+filename1+'mod.txt');
	var BOMBCode=liste.CODE('./input/'+filename2+'mod.txt');
	var outputdata="comparaison entre "+filename1+"et "+filename2;
	outputdata=outputdata+"\n"+"*********repères topos identiques**********"

	var intersection= _.intersection(BOMA,BOMB);

	outputdata=outputdata+"\n"+intersection;

	//créer tableau avec les intersections
	var InterTable=[['REPERE',filename1,filename2]];
	_.each(intersection,function(item){
		// console.log(item);//InterTable.push([item,_.indexOf(BOMACode,item)]);
		var a,b
		_.each(BOMACode,function(i){
			if (i[0]==item){a=i[1];
				// console.log(a);
							};
		});
		_.each(BOMBCode,function(j){
			if (j[0]==item){b=j[1];
				// console.log(b);
						};
		});
		InterTable.push([item,a,b]);
		});

	outputdata=outputdata+"\n"+"*********repère topos identique avec REFERENCE différentes**********";
	// console.log(InterTable);
	var diff=_.filter(InterTable,function(item){
		if (item[1]!=item[2]) { return item};
	});

	outputdata=outputdata+"\n"+_.toArray(diff);


	outputdata=outputdata+"\n"+"*********repère topos differents**********";
	outputdata=outputdata+"\n"+"composants absents de "+filename2;
	var diffA=_.difference(BOMA,BOMB);
	outputdata=outputdata+"\n"+_.filter(BOMACode,function(item){
		return _.find(diffA,function(i){return i==item[0]}); 
	});

	outputdata=outputdata+"\n"+"composants absents de "+filename1;
	var diffB=_.difference(BOMB,BOMA);
	outputdata=outputdata+"\n"+_.filter(BOMBCode,function(item){
		return _.find(diffB,function(i){return i==item[0]}); 
	})
	console.log(outputdata);
	fs.writeFile('./output/delta_'+filename1+'_'+filename2+'.txt', outputdata, function(err) {
	        err || console.log('Output Data \n', outputdata);
	    });
};//end main

// 
  // Start the prompt 
  // 
  prompt.start();
 
  // 
  // Get two properties from the user: username and email 
  // 
  console.log('fichier à comparer (ne pas mettre d\'extension)');
  prompt.get(['premier_fichier','deuxieme_fichier'], function (err, result) {
    // 
    // Log the results. 
    // 
 	console.log(result.deuxieme_fichier);
// conv();
	async.series([
		function(cb){
			convert.convert('./input/'+result.deuxieme_fichier+'.txt','./input/'+result.deuxieme_fichier+'mod.txt',cb);
			},
		function(cb){
			convert.convert('./input/'+result.premier_fichier+'.txt','./input/'+result.premier_fichier+'mod.txt',cb);
  			},
		function(cb){
			main(result.premier_fichier,result.deuxieme_fichier);
			cb();
			}	
  		]);
});
  
