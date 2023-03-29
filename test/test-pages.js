var expect  = require('chai').expect;
var request = require('request');

it('Main page content', function(done) {
    request('http://localhost:4200' , function(error, response, body) {
        done();
    });
});