angular
  .module('politiciansPromiseApp', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('politician', {
        url: "/politician",
        templateUrl: "partials/politician.html",
        controller: 'politicianController'
      })
      .state('state1.list', {
        url: "/list",
        templateUrl: "partials/promise.html",
        controller: 'promiseController'
      })      
  });