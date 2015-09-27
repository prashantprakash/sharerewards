(function() {

  'use strict';
 angular
   .module('myApp', ['ui.router'])
   .config(function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/");
      $stateProvider
        .state('user', {
          url: "/user/:customerId",
          templateUrl: "views/index.html",
          controller: "DashBoardController",
          param: {
            contactId: null,
          }
        })
        .state('description', {
          url: "/description",
          templateUrl: "views/description.html"
        })
    });

})();
