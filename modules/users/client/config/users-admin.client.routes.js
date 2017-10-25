'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/Test HTML File.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('user', {
        abstract: true,
        url: '/employee',
        template: '<ui-view/>',
        data: {
          roles: ['user']
        }
      })
      .state('user.schedule', {
        
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/Test HTML File.html'
       
      })
      .state('user.directory',{
        url:'/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller:'UserListController'       

      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);
