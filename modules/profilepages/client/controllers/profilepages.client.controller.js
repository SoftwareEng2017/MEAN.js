(function () {
  'use strict';

  // Profilepages controller
  angular
    .module('profilepages')
    .controller('ProfilepagesController', ProfilepagesController);

  ProfilepagesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'profilepageResolve'];

  function ProfilepagesController ($scope, $state, $window, Authentication, profilepage) {
    var vm = this;

    vm.authentication = Authentication;
    vm.profilepage = profilepage;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Profilepage
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.profilepage.$remove($state.go('profilepages.list'));
      }
    }

    // Save Profilepage
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.profilepageForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.profilepage._id) {
        vm.profilepage.$update(successCallback, errorCallback);
      } else {
        vm.profilepage.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('profilepages.view', {
          profilepageId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
