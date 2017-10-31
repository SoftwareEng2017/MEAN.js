(function () {
  'use strict';

  angular
    .module('users.employees')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Employees',
      state: 'employees.list',
      roles: ['user']
    });
  }
}());