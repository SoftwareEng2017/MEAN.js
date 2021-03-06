'use strict';

// Setting up route
angular.module('users.employees.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    .state('employees', {
      abstract: true,
      url: '/employees',
      emplate: '<ui-view/>'
    })
    .state('employees.users', {
      url: '/users',
      templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
      controller: 'UserListController'
    });

  }
]);
