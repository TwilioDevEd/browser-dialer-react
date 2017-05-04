'use strict';

let expect = require('chai').expect;
let supertest = require('supertest');
let cheerio = require('cheerio');
let app = require('../index.js');

describe('voice route', function() {
  describe('POST /voice/', function() {
    it('responds with twiml', function(done) {
      let testApp = supertest(app);
      testApp
        .post('/voice/')
        .expect(200)
        .end(function(err, res) {
          let $ = cheerio.load(res.text);
          expect($('dial').length).to.equal(1);
          expect($('dial').attr().callerid).to.equal('my-twilio-number');
          done();
        });
    });
  });
});

describe('index route', function() {
  describe('GET /', function() {
    it('responds with 200', function(done) {
      let testApp = supertest(app);
      testApp
        .get('/')
        .expect(200, done);
    });
  });
});

describe('token route', function() {
  describe('GET /token', function() {
    it('responds with token', function(done) {
      let testApp = supertest(app);
      testApp
        .get('/token')
        .expect(200)
        .end(function(err, res) {
          const jsonResponse = JSON.parse(res.text);
          expect(jsonResponse.token.length).to.be.above(0);
          done();
        });
    });
  });
});
