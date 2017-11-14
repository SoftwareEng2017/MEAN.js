'use strict';

describe('Profilepages E2E Tests:', function () {
  describe('Test Profilepages page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/profilepages');
      expect(element.all(by.repeater('profilepage in profilepages')).count()).toEqual(0);
    });
  });
});
