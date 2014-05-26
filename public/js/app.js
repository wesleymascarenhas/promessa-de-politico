angular
  .module("politiciansPromiseApp", ["ui.bootstrap", "ui.knob", "angularMoment", "infinite-scroll", "nya.bootstrap.select", "textAngular", "jackrabbitsgroup.angular-image-upload"])
  .config(function($interpolateProvider) {
    $interpolateProvider.startSymbol("<%");
    $interpolateProvider.endSymbol("%>");
  });