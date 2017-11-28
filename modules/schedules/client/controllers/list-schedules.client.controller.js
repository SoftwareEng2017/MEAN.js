(function () {
  'use strict';

  angular
    .module('schedules')
    .controller('SchedulesListController', SchedulesListController);

  SchedulesListController.$inject = ['SchedulesService', '$scope'];

  function SchedulesListController(SchedulesService, $scope) {
    var vm = this;
    $scope.nextWeekArray = [];
    $scope.noWeek = 0;
    $scope.pushNextWeek = function(num){
      console.log(num);
      $scope.nextWeekArray.push(num);
      return true;
    };

    $scope.updateWeek = function(createdDate){
      var d = new Date();
      var utc1 = Date.UTC(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());

      var utc2 = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    };

    $scope.noNextWeek = function(){
      for(var i =0; i < $scope.nextWeekArray.length; ++i){
        if($scope.nextWeekArray[i] === 1){
          $scope.nextWeekArray = [];
          $scope.noWeek = 0;
          return false;
        }
      }
      $scope.nextWeekArray = [];
      $scope.noWeek = 1;
      return true;
    };

    vm.schedules = SchedulesService.query();
  }
}());
