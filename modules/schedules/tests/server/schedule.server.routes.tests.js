'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Schedule = mongoose.model('Schedule'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  schedule;

/**
 * Schedule routes tests
 */
describe('Schedule CRUD tests', function () {

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

    // Save a user to the test db and create new Schedule
    user.save(function () {
      schedule = {
        name: 'Schedule name'
      };

      done();
    });
  });

  it('should be able to save a Schedule if logged in', function (done) {
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

        // Save a new Schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(200)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Handle Schedule save error
            if (scheduleSaveErr) {
              return done(scheduleSaveErr);
            }

            // Get a list of Schedules
            agent.get('/api/schedules')
              .end(function (schedulesGetErr, schedulesGetRes) {
                // Handle Schedules save error
                if (schedulesGetErr) {
                  return done(schedulesGetErr);
                }

                // Get Schedules list
                var schedules = schedulesGetRes.body;

                // Set assertions
                (schedules[0].user._id).should.equal(userId);
                (schedules[0].name).should.match('Schedule name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Schedule if not logged in', function (done) {
    agent.post('/api/schedules')
      .send(schedule)
      .expect(403)
      .end(function (scheduleSaveErr, scheduleSaveRes) {
        // Call the assertion callback
        done(scheduleSaveErr);
      });
  });

  it('should not be able to save an Schedule if no name is provided', function (done) {
    // Invalidate name field
    schedule.name = '';

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

        // Save a new Schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(400)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Set message assertion
            (scheduleSaveRes.body.message).should.match('Please fill Schedule name');

            // Handle Schedule save error
            done(scheduleSaveErr);
          });
      });
  });

  it('should be able to update an Schedule if signed in', function (done) {
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

        // Save a new Schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(200)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Handle Schedule save error
            if (scheduleSaveErr) {
              return done(scheduleSaveErr);
            }

            // Update Schedule name
            schedule.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Schedule
            agent.put('/api/schedules/' + scheduleSaveRes.body._id)
              .send(schedule)
              .expect(200)
              .end(function (scheduleUpdateErr, scheduleUpdateRes) {
                // Handle Schedule update error
                if (scheduleUpdateErr) {
                  return done(scheduleUpdateErr);
                }

                // Set assertions
                (scheduleUpdateRes.body._id).should.equal(scheduleSaveRes.body._id);
                (scheduleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Schedules if not signed in', function (done) {
    // Create new Schedule model instance
    var scheduleObj = new Schedule(schedule);

    // Save the schedule
    scheduleObj.save(function () {
      // Request Schedules
      request(app).get('/api/schedules')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Schedule if not signed in', function (done) {
    // Create new Schedule model instance
    var scheduleObj = new Schedule(schedule);

    // Save the Schedule
    scheduleObj.save(function () {
      request(app).get('/api/schedules/' + scheduleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', schedule.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Schedule with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/schedules/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Schedule is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Schedule which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Schedule
    request(app).get('/api/schedules/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Schedule with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Schedule if signed in', function (done) {
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

        // Save a new Schedule
        agent.post('/api/schedules')
          .send(schedule)
          .expect(200)
          .end(function (scheduleSaveErr, scheduleSaveRes) {
            // Handle Schedule save error
            if (scheduleSaveErr) {
              return done(scheduleSaveErr);
            }

            // Delete an existing Schedule
            agent.delete('/api/schedules/' + scheduleSaveRes.body._id)
              .send(schedule)
              .expect(200)
              .end(function (scheduleDeleteErr, scheduleDeleteRes) {
                // Handle schedule error error
                if (scheduleDeleteErr) {
                  return done(scheduleDeleteErr);
                }

                // Set assertions
                (scheduleDeleteRes.body._id).should.equal(scheduleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Schedule if not signed in', function (done) {
    // Set Schedule user
    schedule.user = user;

    // Create new Schedule model instance
    var scheduleObj = new Schedule(schedule);

    // Save the Schedule
    scheduleObj.save(function () {
      // Try deleting Schedule
      request(app).delete('/api/schedules/' + scheduleObj._id)
        .expect(403)
        .end(function (scheduleDeleteErr, scheduleDeleteRes) {
          // Set message assertion
          (scheduleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Schedule error error
          done(scheduleDeleteErr);
        });

    });
  });

  it('should be able to get a single Schedule that has an orphaned user reference', function (done) {
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

          // Save a new Schedule
          agent.post('/api/schedules')
            .send(schedule)
            .expect(200)
            .end(function (scheduleSaveErr, scheduleSaveRes) {
              // Handle Schedule save error
              if (scheduleSaveErr) {
                return done(scheduleSaveErr);
              }

              // Set assertions on new Schedule
              (scheduleSaveRes.body.name).should.equal(schedule.name);
              should.exist(scheduleSaveRes.body.user);
              should.equal(scheduleSaveRes.body.user._id, orphanId);

              // force the Schedule to have an orphaned user reference
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

                    // Get the Schedule
                    agent.get('/api/schedules/' + scheduleSaveRes.body._id)
                      .expect(200)
                      .end(function (scheduleInfoErr, scheduleInfoRes) {
                        // Handle Schedule error
                        if (scheduleInfoErr) {
                          return done(scheduleInfoErr);
                        }

                        // Set assertions
                        (scheduleInfoRes.body._id).should.equal(scheduleSaveRes.body._id);
                        (scheduleInfoRes.body.name).should.equal(schedule.name);
                        should.equal(scheduleInfoRes.body.user, undefined);

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
      Schedule.remove().exec(done);
    });
  });
});
