(function () {
  'use strict';

  describe('Schedules Route Tests', function () {
    // Initialize global variables
    var $scope,
      SchedulesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SchedulesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SchedulesService = _SchedulesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('schedules');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/schedules');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SchedulesController,
          mockSchedule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('schedules.view');
          $templateCache.put('modules/schedules/client/views/view-schedule.client.view.html', '');

          // create mock Schedule
          mockSchedule = new SchedulesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Schedule Name'
          });

          // Initialize Controller
          SchedulesController = $controller('SchedulesController as vm', {
            $scope: $scope,
            scheduleResolve: mockSchedule
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:scheduleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.scheduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            scheduleId: 1
          })).toEqual('/schedules/1');
        }));

        it('should attach an Schedule to the controller scope', function () {
          expect($scope.vm.schedule._id).toBe(mockSchedule._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/schedules/client/views/view-schedule.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SchedulesController,
          mockSchedule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('schedules.create');
          $templateCache.put('modules/schedules/client/views/form-schedule.client.view.html', '');

          // create mock Schedule
          mockSchedule = new SchedulesService();

          // Initialize Controller
          SchedulesController = $controller('SchedulesController as vm', {
            $scope: $scope,
            scheduleResolve: mockSchedule
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.scheduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/schedules/create');
        }));

        it('should attach an Schedule to the controller scope', function () {
          expect($scope.vm.schedule._id).toBe(mockSchedule._id);
          expect($scope.vm.schedule._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/schedules/client/views/form-schedule.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SchedulesController,
          mockSchedule;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('schedules.edit');
          $templateCache.put('modules/schedules/client/views/form-schedule.client.view.html', '');

          // create mock Schedule
          mockSchedule = new SchedulesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Schedule Name'
          });

          // Initialize Controller
          SchedulesController = $controller('SchedulesController as vm', {
            $scope: $scope,
            scheduleResolve: mockSchedule
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:scheduleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.scheduleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            scheduleId: 1
          })).toEqual('/schedules/1/edit');
        }));

        it('should attach an Schedule to the controller scope', function () {
          expect($scope.vm.schedule._id).toBe(mockSchedule._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/schedules/client/views/form-schedule.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
