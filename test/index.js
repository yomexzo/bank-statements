var chai 		= require('chai'),
	should 		= chai.should(),
	expect 		= chai.expect,
	fixtures	= require('node-fixtures'),
	path 		= require('path'),
	app 		= require('../index');
	// fileDir 	= path.join(__dirname, '..' + path.sep + 'views' + path.sep + 'emails' + path.sep);




chai.use(require('chai-things'));

describe('#banks: ', function() {
	
	it('at least one bank supported and enabled', function() {
		app.should.have.property("banks");
		expect(app.banks).to.be.an("array");

		app.banks.should.all.have.property("enabled");
		app.banks.should.all.have.property("key");
		app.banks.should.all.have.property("name");
		app.banks.should.all.have.property("parse");

		var enabled = 0;
		app.banks.forEach(function(bank){
			enabled += bank.enabled ? 1 : 0;
		});

		expect(enabled).to.be.at.least(1);
	});

	(app.banks || []).forEach(function(bank){
		if(!bank.enabled) return;

		it(bank.name + ' - has valid fixtures', function() {
			fixtures.should.have.property(bank.key);

			fixtures[bank.key].should.have.property("valid-statements");
			fixtures[bank.key].should.have.property("invalid-statements");
			
			expect(fixtures[bank.key]["valid-statements"], "valid-statements is an array").to.be.an("array");
			expect(fixtures[bank.key]["invalid-statements"], "invalid-statements is an array").to.be.an("array");

			expect(fixtures[bank.key]["valid-statements"].length, "valid statement at least 1").to.be.at.least(1);

			fixtures[bank.key]["valid-statements"].should.all.have.property("fd");
			fixtures[bank.key]["invalid-statements"].should.all.have.property("fd");
		});

		it(bank.name + ' - successfully parses valid statement(s)', function() {
			var parsedData = bank.parse(fixtures[bank.key]["valid-statements"]);
			expect(parsedData, "parsedData to be an array").to.be.an("array");
			expect(parsedData.length, "parsedData length to be at least 1").to.be.at.least(1);

			parsedData.should.all.have.property("bank");
			parsedData.should.all.have.property("date");
			parsedData.should.all.have.property("amount");
			parsedData.should.all.have.property("remarks");
			parsedData.should.all.have.property("flow");
		});

		it(bank.name + ' - returns [] for empty or invalid statement(s)', function() {
			var parsedData = bank.parse(fixtures[bank.key]["invalid-statements"]);
			expect(parsedData, "parsedData to be an array").to.be.an("array");
			expect(parsedData.length, "parsedData length to be at equal 0").to.be.at.equal(0);
		});
	})
});