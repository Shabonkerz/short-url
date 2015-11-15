
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
var fs = require('fs');
var created = false;

function init(){

	if (created)
	{
		return db;
	}

	var data = fs.readFileSync('./db/schema.sql', "utf8");

	db.run(data);

	created = true;

	return db;
}

module.exports = init;
