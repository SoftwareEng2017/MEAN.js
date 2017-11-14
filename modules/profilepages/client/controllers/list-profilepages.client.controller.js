(function () {
  'use strict';

  angular
    .module('profilepages')
    .controller('ProfilepagesListController', ProfilepagesListController);

  ProfilepagesListController.$inject = ['ProfilepagesService'];

  function ProfilepagesListController(ProfilepagesService) {
    var vm = this;

    vm.profilepages = ProfilepagesService.query();
  }
}());
