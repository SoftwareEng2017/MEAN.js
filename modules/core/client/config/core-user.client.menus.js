'use strict';

angular.module('core').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Employee',
      state: 'user',
      type: 'dropdown',
      roles: ['user']
    });
    Menus.addSubMenuItem('topbar', {
    	title: 'View Schedule'
    	state: 'user.schedule'
    	roles:['user']

    });
  }
]);