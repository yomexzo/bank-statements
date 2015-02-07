var banks 		= require("./lib/banks");

var parsers 	= {};
banks.forEach(function(bank){
	if(!bank.enabled) return;
	parsers[bank.key] = bank.parser;
})

module.exports = {
	banks: banks,
	crunch: function(bank, files, cb){
		if(!bank || !(bank in parsers)) return cb(new Error("Specified bank is not supported"), null);
	}
}