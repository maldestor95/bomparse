var fs = require('fs'),
fileList = 'BOM 907-2489D';

exports.convert = function(input,output,done){

	fs.readFile(input, function(err, data) {
	    if(err) throw err;
	    data = data.toString();
	    data = data.replace(/,/g, '-');
	    data = data.replace(/;/g, ',');
	    fs.writeFile(output, data, function(err) {
	        err ;//|| console.log('Data replaced \n', "data");
	        done();
	    });
	});
};

