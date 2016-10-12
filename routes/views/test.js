var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'test';

    // Load the tests by sortOrder
    view.query('tests', keystone.list('Test').model.find().sort('sortOrder'));

	// Render the view
	view.render('test');
};
