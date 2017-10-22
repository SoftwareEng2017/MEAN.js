'use strict';

// Setting up route
angular.module('core').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('user', {
        abstract: true,
        url: '/user',
        template: '<ui-view/>',
        data: {
          roles: ['user']
        }
      });
      .state('user.schedule', {
        abstract: true,
        url: '/E_schedule',
        template: //url to employee schedule view,
        data: {
          roles: ['user']
        }
      });
  }
]);