(function () {
  'use strict';

  angular
    .module('schedules')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Schedules',
      state: 'schedules.list',
      roles: ['*']
    });
    /*menuService.addMenuItem('topbar', {
      title: 'Create',
      state: 'schedules.create',
      roles: ['*']
    });
    */
    /*
    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'schedules', {
      title: 'List Schedules',
      state: 'schedules.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'schedules', {
      title: 'Create Schedule',
      state: 'schedules.create',

    });
    */
  }
}());
