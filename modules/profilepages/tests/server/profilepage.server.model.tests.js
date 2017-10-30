'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Profilepage = mongoose.model('Profilepage');

/**
 * Globals
 */
var user,
  profilepage;

/**
 * Unit tests
 */
describe('Profilepage Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      profilepage = new Profilepage({
        name: 'Profilepage Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return profilepage.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      profilepage.name = '';

      return profilepage.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Profilepage.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
