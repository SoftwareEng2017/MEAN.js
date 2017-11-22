'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'SchedulesService',
  function ($scope, $http, $location, Users, Authentication, SchedulesService) {
    $scope.user = Authentication.user;
    $scope.days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
    $scope.shifts = [1,2,3,4];
    $scope.schedules = undefined;
    $scope.mon = [];
    
   


    $scope.compareArray= function(array1,array2){
      return (JSON.stringify(array1) === JSON.stringify(array2));
    };

    $scope.returnRole = function(roleArray){
      if(roleArray[0] === 1){
        return "Driver";
      }
      else if(roleArray[1] === 1){
        return "Kitchen";
      }
      else if(roleArray[2] === 1){
        return "Front";
      }
    };

    $scope.findShift = function(array1, array2) {
      for(var i =0; i < array1.length; i++){
        if(array1[i] === 1){
          if(array1[i] === array2[i]){
            return true;
          }
          else{
            return false;
          }
         
        }
        
      }
      
    };
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
