'use strict';

// TODO: Move this file to a more meaningful folder.

var Promise = require('promise');
var events = require('events');
var util = require("util");

/**
 * Provides basic reusable functionality for a json patch document.
 *
 *
 * @constructor PatchDocument
 */
function PatchDocument ()
{
	events.EventEmitter.call(this);
}

util.inherits(PatchDocument, events.EventEmitter);

/**
 * Runs a set of json patch document instructions asynchronously, and passes to callback(cb) each
 * instruction and expects a Promise returned from callback. Once completed, the
 * 'complete' event will be emitted/triggered with the results in the order that they were in the
 * patch document.
 * @method run
 * @param  {Array}    instructions  Array of json patch document instructions.
 * @param  {Function} cb           Callback that expects 1 instruction as parameter, and resolves with a status code.
 */
PatchDocument.prototype.run = function (instructions, cb) {

	// No instructions? Okay then.
	if (!instructions || !instructions.length)
	{
		this.emit('complete', []);
		return;
	}

	var length = instructions.length;

	// We know that we'll need N many responses.
	var responses = new Array(length);
	var promises = new Array(length);

	// ES6 has lexical `this`, ES5 does not, hence the need for `that`.
	// Could also use bind(), but that introduces a touch more syntax complexity.
	var that = this;

	for (var i = 0; i < length; i++) {

		var j = i;
		promises[i] = new Promise( function (resolve, reject) {
			cb(instructions[i]).then( function (value) {
				responses[j] = value;
				resolve();
			});
        });

	};

	// Let subscriber know that all is complete.
	Promise.all(promises).then(function(){
		that.emit('complete', responses);
	});
}

module.exports = PatchDocument;
