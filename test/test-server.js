var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

chai.use(chaiHttp);

describe('Stores', function() {

    it('should list all zones on /ui/api/zones GET', function(done) {
        chai.request(server)
            .get('/ui/api/zones')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('object');
                done();
            });
    });

    it('should list all tags on /ui/api/tags GET', function(done) {
        chai.request(server)
            .get('/ui/api/tags')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });

    it('should list all names on /ui/api/names GET', function(done) {
        chai.request(server)
            .get('/ui/api/names')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });

     it('should list all markers on /ui/api/locationMarkers GET', function(done) {
        chai.request(server)
            .get('/ui/api/locationMarkers')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });

     it('should list all groups on /ui/api/locationGroups GET', function(done) {
        chai.request(server)
            .get('/ui/api/locationGroups')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });

    it('should list all moves places on /ui/api/movesPlaces GET', function(done) {
        chai.request(server)
            .get('/ui/api/movesPlaces')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });

    it('should return index.html on /ui/ GET', function(done) {
        chai.request(server)
            .get('/ui/')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                done();
            });
    });

    it('should store a zone tag on /ui/api/tagZone POST', function(done) {
        let newTag = {
            date: "2018-01-01T16:28:48.274Z",
            lat: -33.918861,
            lon: 18.423300,
            tag: "test"
        };
        chai.request(server)
            .post('/ui/api/tagZone')
            .send(newTag)
            .end(function(err, res) {
                // Res = 200 is only sent upon a successful tag store
                res.should.have.status(200);
                done();
            });
    });


    it('should store a name override on /ui/api/renameZone POST', function(done) {
        let newRename = {
            lat: -33.918861,
            lon: 18.423300,
            name: "test"
        };
        chai.request(server)
            .post('/ui/api/renameZone')
            .send(newRename)
            .end(function(err, res) {
                // Res = 200 is only sent upon a successful zone rename
                res.should.have.status(200);
                done();
            });
    });


});