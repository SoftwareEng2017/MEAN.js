// Profilepages service used to communicate Profilepages REST endpoints
(function () {
  'use strict';

  angular
    .module('profilepages')
    .factory('ProfilepagesService', ProfilepagesService);

  ProfilepagesService.$inject = ['$resource'];

  function ProfilepagesService($resource) {
    return $resource('api/profilepages/:profilepageId', {
      profilepageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
