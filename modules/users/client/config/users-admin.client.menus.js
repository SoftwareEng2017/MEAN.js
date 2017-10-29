'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'EmployeeTest',
      state: 'user',
      type: 'dropdown',
      roles: ['user']
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Add User',
      state: 'authentication.signup'
    });
    Menus.addSubMenuItem('topbar', 'user', {
      title: 'View Schedule',
      state: 'user.schedule',
      roles: ['user']
    });
    Menus.addSubMenuItem('topbar', 'user', {
      title: 'Co-Workers',
      state: 'user.directory',
      roles: ['user']
    });
  }
]);
