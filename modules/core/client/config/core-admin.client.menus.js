'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Manager',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);
