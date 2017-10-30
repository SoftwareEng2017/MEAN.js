(function () {
  'use strict';

  angular
    .module('profilepages')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('profilepages', {
        abstract: true,
        url: '/profilepages',
        template: '<ui-view/>'
      })
      .state('profilepages.list', {
        url: '',
        templateUrl: 'modules/profilepages/client/views/list-profilepages.client.view.html',
        controller: 'ProfilepagesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Profilepages List'
        }
      })
      .state('profilepages.create', {
        url: '/create',
        templateUrl: 'modules/profilepages/client/views/form-profilepage.client.view.html',
        controller: 'ProfilepagesController',
        controllerAs: 'vm',
        resolve: {
          profilepageResolve: newProfilepage
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Profilepages Create'
        }
      })
      .state('profilepages.edit', {
        url: '/:profilepageId/edit',
        templateUrl: 'modules/profilepages/client/views/form-profilepage.client.view.html',
        controller: 'ProfilepagesController',
        controllerAs: 'vm',
        resolve: {
          profilepageResolve: getProfilepage
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Profilepage {{ profilepageResolve.name }}'
        }
      })
      .state('profilepages.view', {
        url: '/:profilepageId',
        templateUrl: 'modules/profilepages/client/views/view-profilepage.client.view.html',
        controller: 'ProfilepagesController',
        controllerAs: 'vm',
        resolve: {
          profilepageResolve: getProfilepage
        },
        data: {
          pageTitle: 'Profilepage {{ profilepageResolve.name }}'
        }
      });
  }

  getProfilepage.$inject = ['$stateParams', 'ProfilepagesService'];

  function getProfilepage($stateParams, ProfilepagesService) {
    return ProfilepagesService.get({
      profilepageId: $stateParams.profilepageId
    }).$promise;
  }

  newProfilepage.$inject = ['ProfilepagesService'];

  function newProfilepage(ProfilepagesService) {
    return new ProfilepagesService();
  }
}());
