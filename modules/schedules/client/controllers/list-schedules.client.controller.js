(function () {
  'use strict';

  angular
    .module('schedules')
    .controller('SchedulesListController', SchedulesListController);

  SchedulesListController.$inject = ['SchedulesService', '$scope', '$http'];

  function SchedulesListController(SchedulesService, $scope, $http) {
    var vm = this;
    $scope.nextWeekArray = [];
    $scope.noWeek = 0;

    $scope.noNextWeek = function(){
      for(var i = 0; i < $scope.nextWeekArray.length; ++i){
        if($scope.nextWeekArray[i] === true){
          $scope.nextWeekArray = [];
          $scope.noWeek = 0;
          return false;
        }
      }
      $scope.nextWeekArray = [];
      $scope.noWeek = 1;
      return true;
    };

    $scope.isNextWeek = function(schedule){
      var _MS_PER_DAY = 1000*60*60*24;
      var d = new Date();
      var today = d.getDay();
      var date1;
      if(today === 0){
        date1 = new Date(d.setTime(d.getTime() - 6*86400000));
      }
      else if(today === 1){
        date1 = new Date(d.setTime(d.getTime()));
      }
      else if(today === 2){
        date1 = new Date(d.setTime(d.getTime() - 1*86400000));
      }
      else if(today === 3){
        date1 = new Date(d.setTime(d.getTime() - 2*86400000));
      }
      else if(today === 4){
        date1 = new Date(d.setTime(d.getTime() - 3*86400000));
      }
      else if(today === 5){
        date1 = new Date(d.setTime(d.getTime() - 4*86400000));
      }
      else if(today === 6){
        date1 = new Date(d.setTime(d.getTime() - 5*86400000));
      }
      console.log(date1);
      var w = new Date(schedule.weekStart);
      console.log(w);
      var utcWeekStart = w.getTime();

      var utcMonday = date1.getTime();

      if(utcWeekStart > utcMonday) {
        return true;
      }
      else if ((utcMonday - utcWeekStart) <= 7*86400000){
        return false;
      }
      else if ((utcMonday - utcWeekStart) > 7*86400000){
        return false;
      }
      return false;
    };

    $scope.pushNextWeek = function(schedule){
      $scope.nextWeekArray.push($scope.isNextWeek(schedule));
      return true;
    };

    $scope.isThisWeek = function(schedule){
      var _MS_PER_DAY = 1000*60*60*24;
      var d = new Date();
      var today = d.getDay();
      var date1;
      if(today === 0){
        date1 = new Date(d.setTime(d.getTime() - 6*86400000));
      }
      else if(today === 1){
        date1 = new Date(d.setTime(d.getTime()));
      }
      else if(today === 2){
        date1 = new Date(d.setTime(d.getTime() - 1*86400000));
      }
      else if(today === 3){
        date1 = new Date(d.setTime(d.getTime() - 2*86400000));
      }
      else if(today === 4){
        date1 = new Date(d.setTime(d.getTime() - 3*86400000));
      }
      else if(today === 5){
        date1 = new Date(d.setTime(d.getTime() - 4*86400000));
      }
      else if(today === 6){
        date1 = new Date(d.setTime(d.getTime() - 5*86400000));
      }
      console.log(date1);
      var w = new Date(schedule.weekStart);
      console.log(w);
      var utcWeekStart = w.getTime();

      var utcMonday = date1.getTime();

      if(utcWeekStart > utcMonday) {
        return false;
      }
      else if ((utcMonday - utcWeekStart) <= 7*86400000){
        return true;
      }
      else if ((utcMonday - utcWeekStart) > 7*86400000){
        return false;
      }
      return false;
    };
    $scope.isOtherWeek = function(schedule){
      var _MS_PER_DAY = 1000*60*60*24;
      var d = new Date();
      var today = d.getDay();
      var date1;
      if(today === 0){
        date1 = new Date(d.setTime(d.getTime() - 6*86400000));
      }
      else if(today === 1){
        date1 = new Date(d.setTime(d.getTime()));
      }
      else if(today === 2){
        date1 = new Date(d.setTime(d.getTime() - 1*86400000));
      }
      else if(today === 3){
        date1 = new Date(d.setTime(d.getTime() - 2*86400000));
      }
      else if(today === 4){
        date1 = new Date(d.setTime(d.getTime() - 3*86400000));
      }
      else if(today === 5){
        date1 = new Date(d.setTime(d.getTime() - 4*86400000));
      }
      else if(today === 6){
        date1 = new Date(d.setTime(d.getTime() - 5*86400000));
      }
      console.log(date1);
      var w = new Date(schedule.weekStart);
      console.log(w);
      var utcWeekStart = w.getTime();

      var utcMonday = date1.getTime();

      if(utcWeekStart > utcMonday) {
        return false;
      }
      else if ((utcMonday - utcWeekStart) <= 7*86400000){
        return false;
      }
      else if ((utcMonday - utcWeekStart) > 7*86400000){
        return true;
      }
      return false;
    };

    vm.schedules = SchedulesService.query();
  }
}());
