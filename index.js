var banks 		= require("./lib/banks");
var Promise 	= require("bluebird");

var parsers 	= {};
banks.forEach(function(bank){
	if(!bank.enabled) return;
	parsers[bank.key] = bank.parser;
})

module.exports = {
	banks: banks,
	readFile: require("./lib/file-reader"),
	readFiles: function(files){
		self = this;
		return Promise.map(files, function(file){
			return self.readFile(file);
		});
	},
	crunch: function(bank, files, cb){
		if(!bank || !(bank in parsers)) return cb(new Error("Specified bank is not supported"), null);
	}
}