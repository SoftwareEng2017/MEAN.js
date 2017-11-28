'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
  'use strict';

  app.registerModule('profilepages');
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('schedules');
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);
ApplicationConfiguration.registerModule('users.employees');
ApplicationConfiguration.registerModule('users.employees.routes');

'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    /*
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'List Articles',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create Articles',
      state: 'articles.create',
      roles: ['user']
    });
    */
  }
]);

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html'
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/create-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html'
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
  function ($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Employee Directory',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
    Menus.addMenuItem('topbar', {
      title: 'Employees',
      state: 'admin',
      type: 'dropdown',
      roles: ['employee']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

(function () {
  'use strict';

  angular
    .module('profilepages')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'List ProfilePages',
      state: 'profilepages.list',
      roles: ['admin', 'user']
    });
    // Set top bar menu items
    // menuService.addMenuItem('topbar', {
    //   title: 'Profilepages',
    //   state: 'profilepages',
    //   type: 'dropdown',
    //   roles: ['*']
    // });
    //
    // // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'profilepages', {
    //   title: 'List Profilepages',
    //   state: 'profilepages.list'
    // });
    //
    // // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'profilepages', {
    //   title: 'Create Profilepage',
    //   state: 'profilepages.create',
    //   roles: ['user']
    // });
  }
}());

(function () {
  'use strict';

  angular
    .module('profilepages')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('profilepages', {
        abstract: true,
        url: '/profilepages',
        templateUrl: '<ui-view/>'
      })
      .state('profilepages.list', {
        url: '',
        templateUrl: 'modules/profilepages/client/views/list-profilepages.client.view.html',
        controller: 'ProfilepagesController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Profilepages List'
        }
      })
      .state('profilepages.create', {
        url: '/create',
        templateUrl: 'modules/profilepages/client/views/form-profilepage.client.view.html',
        controller: 'ProfilepagesController',
        controllerAs: 'vm',
        resolve: {
          profilepageResolve: newProfilepage
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Profilepages Create'
        }
      })
      .state('profilepages.edit', {
        url: '/:profilepageId/edit',
        templateUrl: 'modules/profilepages/client/views/form-profilepage.client.view.html',
        controller: 'ProfilepagesController',
        controllerAs: 'vm',
        resolve: {
          profilepageResolve: getProfilepage
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Profilepage {{ profilepageResolve.name }}'
        }
      })
      .state('profilepages.view', {
        url: '/:profilepageId',
        templateUrl: 'modules/profilepages/client/views/view-profilepage.client.view.html',
        controller: 'ProfilepagesController',
        controllerAs: 'vm',
        resolve: {
          profilepageResolve: getProfilepage
        },
        data: {
          pageTitle: 'Profilepage {{ profilepageResolve.name }}'
        }
      });
  }

  getProfilepage.$inject = ['$stateParams', 'ProfilepagesService'];

  function getProfilepage($stateParams, ProfilepagesService) {
    return ProfilepagesService.get({
      profilepageId: $stateParams.profilepageId
    }).$promise;
  }

  newProfilepage.$inject = ['ProfilepagesService'];

  function newProfilepage(ProfilepagesService) {
    return new ProfilepagesService();
  }
}());

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

(function () {
  'use strict';

  angular
    .module('profilepages')
    .controller('ProfilepagesListController', ProfilepagesListController);

  ProfilepagesListController.$inject = ['ProfilepagesService'];

  function ProfilepagesListController(ProfilepagesService) {
    var vm = this;

    vm.profilepages = ProfilepagesService.query();
  }
}());

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

(function () {
  'use strict';

  // Profilepages controller
  angular
    .module('profilepages')
    .controller('ProfilepagesController', ProfilepagesController);

  ProfilepagesController.$inject = ['$scope', '$state', '$window', 'Authentication'];//, 'profilepageResolve'];

  function ProfilepagesController ($scope, $state, $window, Authentication){//, profilepage) {

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

// Profilepages service used to communicate Profilepages REST endpoints
(function () {
  'use strict';

  angular
    .module('profilepages')
    .factory('ProfilepagesService', ProfilepagesService);

  ProfilepagesService.$inject = ['$resource'];

  function ProfilepagesService($resource) {
    return $resource('api/profilepages/:profilepageId', {
      profilepageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('schedules')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Schedules',
      state: 'schedules.list',
      roles: ['user', 'admin']
    });
    /*menuService.addMenuItem('topbar', {
      title: 'Create',
      state: 'schedules.create',
      roles: ['*']
    });
    */
    /*
    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'schedules', {
      title: 'List Schedules',
      state: 'schedules.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'schedules', {
      title: 'Create Schedule',
      state: 'schedules.create',

    });
    */
  }
}());

(function () {
  'use strict';

  angular
    .module('schedules')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('schedules', {
        abstract: true,
        url: '/schedules',
        template: '<ui-view/>'
      })
      .state('shift', {
        abstract: true,
        url: '/shift',
        template: '<ui-view/>'
      })
      .state('schedules.list', {
        url: '',
        templateUrl: 'modules/schedules/client/views/list-schedules.client.view.html',
        controller: 'SchedulesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Schedules List'
        }
      })
      .state('schedules.create', {
        url: '/create',
        templateUrl: 'modules/schedules/client/views/form-schedule.client.view.html',
        controller: 'SchedulesController',
        controllerAs: 'vm',
        resolve: {
          scheduleResolve: newSchedule
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Schedules Create'
        }
      })
      .state('schedules.edit', {
        url: '/:scheduleId/edit',
        templateUrl: 'modules/schedules/client/views/form-schedule.client.view.html',
        controller: 'SchedulesController',
        controllerAs: 'vm',
        resolve: {
          scheduleResolve: getSchedule
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Schedule {{ scheduleResolve.name }}'
        }
      })
      .state('shift.edit', {
        url: '/:scheduleId/:shiftId/:index/edit',
        templateUrl: 'modules/schedules/client/views/form-shift.client.view.html',
        controller: 'SchedulesController',
        controllerAs: 'vm',
        resolve: {
          scheduleResolve: getSchedule
        },

        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Shift',
        }

      })

      .state('shift.create', {
        url: '/:scheduleId/createShift',
        templateUrl: 'modules/schedules/client/views/form-shift.client.view.html',
        controller: 'SchedulesController',
        controllerAs: 'vm',
        resolve: {
          scheduleResolve: getSchedule
        },

        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Add Shift',
        }

      })

      .state('shift.addEmployee', {
        url: '/:scheduleId/:shiftId/:index/addEmployee',
        templateUrl: 'modules/schedules/client/views/form-shift-addEmployee.client.view.html',
        controller: 'SchedulesController',
        controllerAs: 'vm',
        resolve: {
          scheduleResolve: getSchedule
        },

        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Add Employee',
        }
      })

      .state('schedules.view', {
        url: '/:scheduleId',
        templateUrl: 'modules/schedules/client/views/view-schedule.client.view.html',
        controller: 'SchedulesController',
        controllerAs: 'vm',
        resolve: {
          scheduleResolve: getSchedule
        },
        data: {
          pageTitle: 'Schedule {{ scheduleResolve.name }}'
        }
      });
  }

  getSchedule.$inject = ['$stateParams', 'SchedulesService'];

  function getSchedule($stateParams, SchedulesService) {
    return SchedulesService.get({
      scheduleId: $stateParams.scheduleId
    }).$promise;
  }

  newSchedule.$inject = ['SchedulesService'];

  function newSchedule(SchedulesService) {
    return new SchedulesService();
  }
}());

(function () {
  'use strict';

  angular
    .module('schedules')
    .controller('SchedulesListController', SchedulesListController);

  SchedulesListController.$inject = ['SchedulesService'];

  function SchedulesListController(SchedulesService) {
    var vm = this;

    vm.schedules = SchedulesService.query();
  }
}());

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
          shift_day: day,
          shift_role: shift.role,
          which_shift: shift.whichShift,
          value: 1
        };
        shift.employees.push(newEmployee);
        shift.available.splice(index,1);
        shift.required = (shift.required - 1);
        console.log(newEmployee);
        //make http request to server route defined in users.server.routes
        $http.post('https://vast-tundra-19351.herokuapp.com/api/users/updateAssignment', newEmployee).success(function (response) {
        // If successful we assign the response to the global user model
        
          //console.log(response.message);
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
        shift_day: day,
        shift_role: shift.role,
        which_shift: shift.whichShift,
        value: 0
      };
      console.log(newEmployee);
      shift.available.push(newEmployee);
      shift.required = (shift.required + 1);
      shift.employees.splice(index , 1);

      $http.post('https://vast-tundra-19351.herokuapp.com/api/users/updateAssignment', newEmployee).success(function (response) {
        // If successful we assign the response to the global user model
        
        //console.log(response.message);
        // And redirect to the previous or home page
        
      }).error(function (response) {
        $scope.error = response.message;
      });

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
      var newSchedule = {
        weekName: vm.schedule.weekName,
        users: $scope.users,
        requirements:{
          open: [1,1,1],
          close: [1,1,1],
          full: [3,2,1] 

        }
      };
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.scheduleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.schedule._id) {
        vm.schedule.$update(successCallback, errorCallback);
      } else {
        //test
        $http.post('https://vast-tundra-19351.herokuapp.com/api/schedules', newSchedule).success(successCallback).error(errorCallback);
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

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'List Employees',
      state: 'admin.users'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Add Employee',
      state: 'authentication.signup'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

angular.module('users.employees').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'EmployeesTest',
      state: 'employees',
      type: 'dropdown',
      roles: ['user']
    });
    Menus.addSubMenuItem('topbar', 'employees', {
      title: 'View Employees',
      state: 'employees.users'
    });

    /*
    // Add the articles dropdown item
    
    // Add the dropdown list item
    

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create Articles',
      state: 'articles.create',
      roles: ['user']
    });
    */
  }
]);
'use strict';

// Setting up route
angular.module('users.employees.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
    .state('employees', {
      abstract: true,
      url: '/employees',
      emplate: '<ui-view/>'
    })
    .state('employees.users', {
      url: '/users',
      templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
      controller: 'UserListController'
    });

  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.returnRole = function(roleArray){
      var Roles = '';
      if(roleArray[0] === 1){
        Roles += ("Driver" + ' ');
      }
      if(roleArray[1] === 1){
        Roles += ("Kitchen" + ' ');
      }
      if(roleArray[2] === 1){
        Roles += ("Front" + ' ');
      }
      return Roles;
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.returnRole = function(roleArray){
      var Roles = '';
      if(roleArray[0] === 1){
        Roles += ("Driver" + ' ');
      }
      if(roleArray[1] === 1){
        Roles += ("Kitchen" + ' ');
      }
      if(roleArray[2] === 1){
        Roles += ("Front" + ' ');
      }
      return Roles;
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }


      var user = $scope.user;

      user.$update(function () {
        window.location.reload(true, $state.go('admin.user', {
          userId: user._id

        }));
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    $scope.previousUser = undefined;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;
      //The idea is a create a blank JSON of the user model defined in MEAN.js\modules\users\server\models
        //and write to it using scope.employeeCredentials in the view.
    $scope.days = ['mon','tue','wed','thu','fri','sat','sun'];
    $scope.shifts = [0,1,2,3];
    $scope.employeeCredentials = {
      username: '',
      password: '',
      availibility: {
        sun: [0,0,0,0,0,0,0,0,0],
        sat: [0,0,0,0,0,0,0,0,0],
        fri: [0,0,0,0,0,0,0,0,0],
        thu: [0,0,0,0,0,0,0,0,0],
        wed: [0,0,0,0,0,0,0,0,0],
        tue: [0,0,0,0,0,0,0,0,0],
        mon: [0,0,0,0,0,0,0,0,0],
      },
      email: '',
      type: [0,0,0],
      lastName: '',
      firstName: ''
    };

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      //$location.path('/');
    }

    $scope.setType= function(index){
      $scope.employeeCredentials.type = [0,0,0];
      $scope.employeeCredentials.type[index]= 1;
    };

    $scope.signup = function (isValid) {
      $scope.error = null;
      $scope.previousUser = $scope.authentication.user;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.employeeCredentials).success(function (response) {
        // If successful we assign the response to the global user model
        

        // And redirect to the previous or home page
        $state.go('home', $state.params);
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

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

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

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
