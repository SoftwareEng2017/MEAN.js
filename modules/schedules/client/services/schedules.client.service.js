// Schedules service used to communicate Schedules REST endpoints
(function () {
  'use strict';

  angular
    .module('schedules')
    .factory('SchedulesService', SchedulesService);

  SchedulesService.$inject = ['$resource'];

  function SchedulesService($resource) {
    return $resource('api/schedules/:scheduleId', {
      scheduleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
