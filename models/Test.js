var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Test Model
 * =============
 */

var Test = new keystone.List('Test', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Test.add({
	name: { type: String, required: true }
});

Test.register();
