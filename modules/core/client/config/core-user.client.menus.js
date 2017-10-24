'use strict';

angular.module('core.user').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'EmployeeTest',
      state: 'user',
      type: 'dropdown',
      roles: ['user']
    });
    Menus.addSubMenuItem('topbar', 'user', {
      title: 'View Schedule',
      state: 'user.schedule',
      roles: ['user']
    });
  }
]);