var Promise 	= require("bluebird");

module.exports = function(file){

	return new Promise(function(resolve, reject){
		// reject();

		resolve(file);
	})
};