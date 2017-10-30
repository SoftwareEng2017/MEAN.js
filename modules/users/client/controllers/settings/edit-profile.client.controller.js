'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'SchedulesService',
  function ($scope, $http, $location, Users, Authentication, SchedulesService) {
    $scope.user = Authentication.user;
    $scope.days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    $scope.shifts = [1,2,3,4]
    $scope.schedules = undefined;
    $scope.mon = [];
    

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
    $scope.getSchedules = function(){
      $scope.schedules = SchedulesService.query();
      $scope.schedules.$promise.then(function(result){
        $scope.schedules = result;
        $scope.mon = $scope.schedules[0].monday;
      });
      
    };
  }

]);
