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
      for(var i =0; i < array2.length; i++){
        if(array2[i] === 1){
          if(array1[i]===1){
            return true;
          }
        }
        
      }
      return false;
      
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

    $scope.addEmployee = function(shift, employee, day, index){
      var employeeName = employee.name;
      //set new assigned to current employee assigned.
      var newAssigned = employee.assigned;
      var shift_num;
      //update newAssigned based on the shift they were just assigned to.
      for (var i = 0; i<3; i++){
        if(shift.role[i]===1){
          shift_num = i*3;
        }
      }
      //prep request.
      

      //check for duplicates already in shift list
      if(!hasDuplicates(employee._id, shift.employees)){
        //update assigned array to include the shift the employee was just added to.
        for(var j = 0; j<3; j++){
          if(shift.whichShift[j] === 1){
            newAssigned[day][shift_num + j] = 1;
          }
        }
        //create a new employee
        var newEmployee = {
          name: employeeName,
          id: employee.id,
          assigned: newAssigned,
          totalHours: employee.totalHours
        };
        shift.employees.push(newEmployee);
        shift.available.splice(index,1);
        console.log(newEmployee);
        //make http request to server route defined in users.server.routes
        $http.post('http://localhost:3000/api/users/updateAssignment', newEmployee).success(function (response) {
        // If successful we assign the response to the global user model
        
          console.log(response.message);
        // And redirect to the previous or home page
        
        }).error(function (response) {
          $scope.error = response.message;
        });
      }
      
      vm.save(true);
  
      
    };

    $scope.removeEmployee = function (shift, index, day, employee){
     
      var employeeName = employee.name;
      //we know the day, the type of shift and which shift; we store employees without their assigned arrays
      //so we need to contact the server to make those changes with the above information.
      var newAssigned = employee.assigned;
      var shift_num;
      for (var i = 0; i<3; i++){
        if(shift.role[i]===1){
          shift_num = i*3;
        }
      }
      
      for(var j = 0; j<3; j++){
        if(shift.whichShift[j] === 1){
          newAssigned[day][shift_num + j] = 0;
        }
      }


      var newEmployee = {
        name: employeeName,
        id: employee.id,
        assigned: newAssigned,
        totalHours: employees.totalHours
      };
      console.log(newEmployee);

      $http.post('http://localhost:3000/api/users/updateAssignment', newEmployee).success(function (response) {
        // If successful we assign the response to the global user model
        
        console.log(response.message);
        // And redirect to the previous or home page
        
      }).error(function (response) {
        $scope.error = response.message;
      });
      shift.available.push(employee);

      shift.employees.splice(index , 1);
      vm.save(true);
      vm.$update();
    
     
      
    };
    /*
    $scope.addShift = function(shiftArray, shift){
      shiftArray.push(shift);
      vm.save(true);
    };
    */
    // Save Schedule
    function save(isValid) {
      var newSchedule ={
        weekName: vm.schedule.weekName,
        users: $scope.users
      };
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.scheduleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.schedule._id) {
        vm.schedule.$update(successCallback, errorCallback);
      } else {
        $http.post('http://localhost:3000/api/schedules', newSchedule).success(successCallback).error(errorCallback);
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
