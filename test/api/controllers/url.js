var should = require('should');
var request = require('supertest');
var server = require('../../../app');

describe('controllers', function() {

  describe('url', function() {

	describe('POST /url', function() {

	  it('should return a url object', function(done) {

		request(server)
		  .post('/url')
          .send({url: 'http://www.google.com'})
		  .set('Accept', 'application/json')
		  .expect('Content-Type', /json/)
		  .expect(201, {id: 1, url: 'http://www.google.com', visits: 0})
		  .end(function(err, res) {
			should.not.exist(err);

			done();
		  });

	  });

	});


	describe('PATCH /url/{id}', function() {

		it('should return an array of statuses', function(done) {

		  request(server)
			.patch('/url/1')
            .send([{op: 'add', path: '/visits', value: 1}])
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(207, [200])
			.end(function(err, res) {
			  should.not.exist(err);

			  done();
			});
		});

	});

	describe('GET /url/{id}', function() {

	  it('should return a url object with visits = 1', function(done) {

		request(server)
		  .get('/url/1')
		  .set('Accept', 'application/json')
		  .expect('Content-Type', /json/)
		  .expect(200)
		  .end(function(err, res) {
			should.not.exist(err);

			res.body.should.eql({id: "1", url: 'http://www.google.com', visits: 1});

			done();
		  });
	  });

	});

  });

});
