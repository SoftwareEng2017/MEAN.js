'use strict';

// Setting up route
angular.module('core.user.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('user', {
        abstract: true,
        url: '/user',
        template: '<ui-view/>',
        data: {
          roles: ['user']
        }
      })
      .state('user.schedule', {
        
        url: '/userSchedule',
        templateURL: '',
        data: {
          roles: ['user']
        }
      });
     
  }
]);