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
});