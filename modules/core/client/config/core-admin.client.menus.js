'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Employee Directory',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
    Menus.addMenuItem('topbar', {
      title: 'Employees',
      state: 'admin',
      type: 'dropdown',
      roles: ['employee']
    });
  }
]);
