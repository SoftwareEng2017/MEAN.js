(function () {
  'use strict';

  angular
    .module('profilepages')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
      menuService.addMenuItem('topbar', {
          title: 'List ProfilePages',
          state: 'profilepages.list',
          roles: ['admin', 'user']
      });
    // Set top bar menu items
    // menuService.addMenuItem('topbar', {
    //   title: 'Profilepages',
    //   state: 'profilepages',
    //   type: 'dropdown',
    //   roles: ['*']
    // });
    //
    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'profilepages', {
    //   title: 'List Profilepages',
    //   state: 'profilepages.list'
    // });
    //
    // // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'profilepages', {
    //   title: 'Create Profilepage',
    //   state: 'profilepages.create',
    //   roles: ['user']
    // });
  }
}());
