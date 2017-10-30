'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Profilepage = mongoose.model('Profilepage'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  profilepage;

/**
 * Profilepage routes tests
 */
describe('Profilepage CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Profilepage
    user.save(function () {
      profilepage = {
        name: 'Profilepage name'
      };

      done();
    });
  });

  it('should be able to save a Profilepage if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Profilepage
        agent.post('/api/profilepages')
          .send(profilepage)
          .expect(200)
          .end(function (profilepageSaveErr, profilepageSaveRes) {
            // Handle Profilepage save error
            if (profilepageSaveErr) {
              return done(profilepageSaveErr);
            }

            // Get a list of Profilepages
            agent.get('/api/profilepages')
              .end(function (profilepagesGetErr, profilepagesGetRes) {
                // Handle Profilepages save error
                if (profilepagesGetErr) {
                  return done(profilepagesGetErr);
                }

                // Get Profilepages list
                var profilepages = profilepagesGetRes.body;

                // Set assertions
                (profilepages[0].user._id).should.equal(userId);
                (profilepages[0].name).should.match('Profilepage name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Profilepage if not logged in', function (done) {
    agent.post('/api/profilepages')
      .send(profilepage)
      .expect(403)
      .end(function (profilepageSaveErr, profilepageSaveRes) {
        // Call the assertion callback
        done(profilepageSaveErr);
      });
  });

  it('should not be able to save an Profilepage if no name is provided', function (done) {
    // Invalidate name field
    profilepage.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Profilepage
        agent.post('/api/profilepages')
          .send(profilepage)
          .expect(400)
          .end(function (profilepageSaveErr, profilepageSaveRes) {
            // Set message assertion
            (profilepageSaveRes.body.message).should.match('Please fill Profilepage name');

            // Handle Profilepage save error
            done(profilepageSaveErr);
          });
      });
  });

  it('should be able to update an Profilepage if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Profilepage
        agent.post('/api/profilepages')
          .send(profilepage)
          .expect(200)
          .end(function (profilepageSaveErr, profilepageSaveRes) {
            // Handle Profilepage save error
            if (profilepageSaveErr) {
              return done(profilepageSaveErr);
            }

            // Update Profilepage name
            profilepage.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Profilepage
            agent.put('/api/profilepages/' + profilepageSaveRes.body._id)
              .send(profilepage)
              .expect(200)
              .end(function (profilepageUpdateErr, profilepageUpdateRes) {
                // Handle Profilepage update error
                if (profilepageUpdateErr) {
                  return done(profilepageUpdateErr);
                }

                // Set assertions
                (profilepageUpdateRes.body._id).should.equal(profilepageSaveRes.body._id);
                (profilepageUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Profilepages if not signed in', function (done) {
    // Create new Profilepage model instance
    var profilepageObj = new Profilepage(profilepage);

    // Save the profilepage
    profilepageObj.save(function () {
      // Request Profilepages
      request(app).get('/api/profilepages')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Profilepage if not signed in', function (done) {
    // Create new Profilepage model instance
    var profilepageObj = new Profilepage(profilepage);

    // Save the Profilepage
    profilepageObj.save(function () {
      request(app).get('/api/profilepages/' + profilepageObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', profilepage.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Profilepage with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/profilepages/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Profilepage is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Profilepage which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Profilepage
    request(app).get('/api/profilepages/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Profilepage with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Profilepage if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Profilepage
        agent.post('/api/profilepages')
          .send(profilepage)
          .expect(200)
          .end(function (profilepageSaveErr, profilepageSaveRes) {
            // Handle Profilepage save error
            if (profilepageSaveErr) {
              return done(profilepageSaveErr);
            }

            // Delete an existing Profilepage
            agent.delete('/api/profilepages/' + profilepageSaveRes.body._id)
              .send(profilepage)
              .expect(200)
              .end(function (profilepageDeleteErr, profilepageDeleteRes) {
                // Handle profilepage error error
                if (profilepageDeleteErr) {
                  return done(profilepageDeleteErr);
                }

                // Set assertions
                (profilepageDeleteRes.body._id).should.equal(profilepageSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Profilepage if not signed in', function (done) {
    // Set Profilepage user
    profilepage.user = user;

    // Create new Profilepage model instance
    var profilepageObj = new Profilepage(profilepage);

    // Save the Profilepage
    profilepageObj.save(function () {
      // Try deleting Profilepage
      request(app).delete('/api/profilepages/' + profilepageObj._id)
        .expect(403)
        .end(function (profilepageDeleteErr, profilepageDeleteRes) {
          // Set message assertion
          (profilepageDeleteRes.body.message).should.match('User is not authorized');

          // Handle Profilepage error error
          done(profilepageDeleteErr);
        });

    });
  });

  it('should be able to get a single Profilepage that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Profilepage
          agent.post('/api/profilepages')
            .send(profilepage)
            .expect(200)
            .end(function (profilepageSaveErr, profilepageSaveRes) {
              // Handle Profilepage save error
              if (profilepageSaveErr) {
                return done(profilepageSaveErr);
              }

              // Set assertions on new Profilepage
              (profilepageSaveRes.body.name).should.equal(profilepage.name);
              should.exist(profilepageSaveRes.body.user);
              should.equal(profilepageSaveRes.body.user._id, orphanId);

              // force the Profilepage to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Profilepage
                    agent.get('/api/profilepages/' + profilepageSaveRes.body._id)
                      .expect(200)
                      .end(function (profilepageInfoErr, profilepageInfoRes) {
                        // Handle Profilepage error
                        if (profilepageInfoErr) {
                          return done(profilepageInfoErr);
                        }

                        // Set assertions
                        (profilepageInfoRes.body._id).should.equal(profilepageSaveRes.body._id);
                        (profilepageInfoRes.body.name).should.equal(profilepage.name);
                        should.equal(profilepageInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Profilepage.remove().exec(done);
    });
  });
});
