(function () {
  'use strict';

  // Profilepages controller
  angular
    .module('profilepages')
    .controller('ProfilepagesController', ProfilepagesController);

  ProfilepagesController.$inject = ['$scope', '$state', '$window', 'Authentication', '$http'];//, 'profilepageResolve'];

  function ProfilepagesController ($scope, $state, $window, Authentication, $http){//, profilepage) {

    var vm = this;

    vm.authentication = Authentication;
    vm.profilepage ={};// profilepage;
    vm.error = null;
    vm.form = {};
    //vm.remove = remove;
    //vm.save = save;
    vm.test = "string";
    console.log(vm.authentication.user);

    $scope.tabTagsInfo= [
      {
        url: "modules/profilepages/client/views/userInfo.html",
        tagName: "Info"
      },
      {
        url: "modules/profilepages/client/views/scheduleView.html",
        tagName: "Schedule"
      },
      {
        url: "modules/profilepages/client/views/userInfo.html",
        tagName: "Person"
      }
    ];

    $scope.getHours = function(){
      $http.get('http://localhost:3000/api/scheduleHours').success(function(response){
        console.log(response);
      });
    };

    $scope.tabIndex= 0;

    $scope.setIndex = function(index){
      $scope.tabIndex = index;

    };

    // // Remove existing Profilepage
    // function remove() {
    //   if ($window.confirm('Are you sure you want to delete?')) {
    //     vm.profilepage.$remove($state.go('profilepages.list'));
    //   }
    // }
    //
    // // Save Profilepage
    // function save(isValid) {
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'vm.form.profilepageForm');
    //     return false;
    //   }
    //
    //   // TODO: move create/update logic to service
    //   if (vm.profilepage._id) {
    //     vm.profilepage.$update(successCallback, errorCallback);
    //   } else {
    //     vm.profilepage.$save(successCallback, errorCallback);
    //   }
    //
    //   function successCallback(res) {
    //     $state.go('profilepages.view', {
    //       profilepageId: res._id
    //     });
    //   }
    //
    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }
    // }
  }
}());
