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

		it(bank.name + ' - reader correctly reads valid statements', function() {
			app.readFiles(fixtures[bank.key]["valid-statements"]).then(function(records){
				expect(records, "records to be an array").to.be.an("array");
				expect(records.length, "records.length to be equal valid-statements.length").to.be.equal(fixtures[bank.key]["valid-statements"].length);
				


				it(bank.name + ' - successfully parses read records', function() {
					var parsedData = bank.parse(records);
					expect(parsedData, "parsedData to be an array").to.be.an("array");
					expect(parsedData.length, "parsedData length to be at least 1").to.be.at.least(1);

					parsedData.should.all.have.property("bank");
					parsedData.should.all.have.property("date");
					parsedData.should.all.have.property("amount");
					parsedData.should.all.have.property("remarks");
					parsedData.should.all.have.property("flow");
				});
			}).catch(function(err){
				expect(err, "err to be equal null").to.be.equal(null);
			});
		});

		it(bank.name + ' - reader throws error with invalid statements', function() {
			if(fixtures[bank.key]["invalid-statements"].length == 0) return;

			app.readFiles(fixtures[bank.key]["invalid-statements"]).then(function(records){
				expect(records, "records to be equal null").to.be.equal(null);
			}).catch(function(err){
				expect(err, "err to not be equal null").to.not.be.equal(null);
			});
		});
	})
});