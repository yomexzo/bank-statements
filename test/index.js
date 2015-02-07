var chai 		= require('chai'),
	should 		= chai.should(),
	expect 		= chai.expect,
	fixtures	= require('fixtures'),
	path 		= require('path');
	app 		= require('../index'),




chai.use(require('chai-things'));

describe('#banks: ', function() {
	
	it('at least one bank supported and enabled', function() {
		app.should.have.property("banks");
		expect(app.banks).to.be.an("array");

		app.banks.should.all.have.property("enabled");
		app.banks.should.all.have.property("key");
		app.banks.should.all.have.property("name");
		app.banks.should.all.have.property("parser");

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
			
			expect(fixtures[bank.key]["valid-statements"]).to.be.an("array");
			expect(fixtures[bank.key]["invalid-statements"]).to.be.an("array");

			expect(fixtures[bank.key]["valid-statements"]).to.be.at.least(1);

			fixtures[bank.key]["valid-statements"].should.all.have.property("fd");
			fixtures[bank.key]["invalid-statements"].should.all.have.property("fd");
		});
	})
});