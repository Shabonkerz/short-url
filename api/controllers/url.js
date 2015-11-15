'use strict';

// TODO: Move data access into its own class(es).
// TODO: Move error messages somewhere else, and internationalize, perhaps.
// TODO: Maybe introduce enum and change status codes to human-readable identifiers.

var util = require('util');
var base62 = require('base62');
var Promise = require('promise');
var db = require('../../db/db.js')();
var PatchDocument = require('../helpers/PatchDocument.js');

module.exports = {
    get: get,
    post: post,
    patch: patch
};

/**
 * /url GET method
 * @method get
 * @param  {object} req Request
 * @param  {object} res Response
 */
function get(req, res) {
    var params = req.swagger.params;
    var id = params.id.value;

    // Decode id so we can look up in db.
    var decodedId = base62.decode(id);

    var result = db.get('SELECT * from urls where id = ?', decodedId, function(err, row) {

        if (err)
        {
            res.status(500);
            res.json('An error occurred.');
            return;
        }

        if (!row)
        {
            res.status(404);
            res.json({message: 'Url does not exist.'});
            return;
        }

        res.json({
            id: base62.encode(row.id),
            url: row.url,
            visits: row.visits
        });
    });
}

/**
 * /url POST method
 * @method post
 * @param  {object} req Request
 * @param  {object} res Response
 */
function post(req, res) {

    var params = req.swagger.params;
    var url = params.url.value.url;

    // Decode id so we can look up in db.
    db.run('INSERT INTO urls (url) VALUES (?)', url, function (err) {
        if (err)
        {
            res.status(500);
            res.json({message: 'Internal Server Error.'});
            return;
        }

        res.status(201);

        res.json({
            id: base62.encode(this.lastID),
            url: url,
            visits: 0
        });
    });

}


/**
 * /url/{id} PATCH method
 * @method get
 * @param  {object} req Request
 * @param  {object} res Response
 */
function patch(req, res) {

    var params = req.swagger.params;
    var instructions = params.instructions.value;
    var id = params.id.value;

    var decodedId = base62.decode(id);

    var patchDocument = new PatchDocument();

    patchDocument.on('complete', function (responses) {
        res.status(207);
        res.json(responses.map(function (response) {
            return response.toString();
        }));
    });

    patchDocument.run( [].concat(instructions), function (instruction) {
        return new Promise( function(resolve, reject) {

            // TODO: Support more operations and paths.
            if (instruction.op !== 'add') {
                resolve(403);
                return;
            }

            if (instruction.path !== '/visits') {
                resolve(404);
                return;
            }

            // TODO: Be more descriptive than 403. ie. Specify the field.
            if (isNaN( parseInt(instruction.value, 10)) )
            {
                resolve(403);
                return;
            }

            // Make sure it exists.
            db.get('SELECT * from urls where id = ?', decodedId, function(err, row) {

                if (err)
                {
                    resolve(500);
                    return;
                }

                if (!row)
                {
                    resolve(404);
                    return;
                }

                // If it exists, update it.
                db.run('UPDATE urls set visits = visits + ? where id = ?', [parseInt(instruction.value, 10), decodedId], function(err) {

                    if (err)
                    {
                        resolve(500);
                        return;
                    }

                    resolve(200);
                });

            });

        });
    });

}
