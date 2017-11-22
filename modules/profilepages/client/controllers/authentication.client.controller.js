'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;
    //I have now fucking clue where scope.credentials is declared so we're using our own scope, with blackjack and hookers
      //The idea is a create a blank JSON of the user model defined in MEAN.js\modules\users\server\models
        //and write to it using scope.employeeCredentials in the view.
    $scope.days = ['mon','tue','wed','thu','fri','sat','sun'];
    $scope.shifts = [0,1,2,3];
    $scope.employeeCredentials = {
      username: '',
      password: '',
      availibility: {
        sun: [0,0,0,0],
        sat: [0,0,0,0],
        fri: [0,0,0,0],
        thu: [0,0,0,0],
        wed: [0,0,0,0],
        tue: [0,0,0,0],
        mon: [0,0,0,0],
      },
      email: '',
      type: '',
      lastName: '',
      firstName: ''
    };

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      //$location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.employeeCredentials).success(function (response) {
        // If successful we assign the response to the global user model
        //$scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
