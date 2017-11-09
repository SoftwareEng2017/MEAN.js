(function () {
  'use strict';

  // Schedules controller
  angular
    .module('schedules')
    .controller('SchedulesController', SchedulesController);

  SchedulesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'scheduleResolve', '$stateParams', 'Admin', '$http'];

  function SchedulesController ($scope, $state, $window, Authentication, schedule, $stateParams, Admin, $http) {
    var vm = this;
    //this queries the admin.users service for a list of users, you should be able to reference users in any page that uses this controller
    //cheers
    Admin.query(function(data){
      $scope.users = data;
    });
    vm.authentication = Authentication;
    vm.schedule = schedule;
    vm.shift=undefined;
    vm.index= $stateParams.index;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    function hasDuplicates(input , array) {
      for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (input === value._id) {
          return true;
        }
      }
      return false;
    }

    /*check if two arrays are equal*/
    $scope.areEqual = function(array1, array2) {
      for(var i =0; i < array1.length; i++){
        if(array1[i] === array2[i]){
        }
        else{
          return false;
        }
      }
      return true;
    };

    // Remove existing Schedule
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.schedule.$remove();
        window.location.reload(true, $state.go('schedules.list'));
        
      }
    }
    $scope.setShift = function(index){
      $stateParams.index = index;
    };

    $scope.addEmployee = function(shift, firstname, lastname, _id, assigned){
      var employeeName = firstname + " " + lastname;
      var newAssigned = assigned;
      var newEmployee = {
        name: employeeName,
        id: _id
      };

      

      
      if(!hasDuplicates(_id , shift.employees)){
        shift.employees.push(newEmployee);
      }
      vm.save(true);
    };

    $scope.removeEmployee = function (shift, index, id){
      shift.employees.splice(index , 1);
      vm.save(true);
    };
    /*
    $scope.addShift = function(shiftArray, shift){
      shiftArray.push(shift);
      vm.save(true);
    };
    */
    // Save Schedule
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.scheduleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.schedule._id) {
        vm.schedule.$update(successCallback, errorCallback);
      } else {
        vm.schedule.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('schedules.view', {
          scheduleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
