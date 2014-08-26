// js/services/coreDirective.js

var app = angular.module('coreDirective', []);

app.directive('mainResources', function(){
	return{
		restrict: 'E',
		// using templateUrl for resources slows down css loading for some reason
		//templateUrl: '/templates/resources.html', 
		template: 
		'<link rel="shortcut icon" href="/img/favicon.ico">'+
		'<link rel="stylesheet" href="/css/main.css">',
	};
});

app.directive('mainNavbar', function(){
	return{
		restrict: 'E', 
		templateUrl: '/templates/navbar.html',
	};
});

app.directive('ig', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fid: '@'
    },
    template: 
      '<material-input-group>' +
        '<label for="{{fid}}">Description</label>' +
        '<material-input id="{{fid}}" type="text" ng-model="data.description">' +
      '</material-input-group>'
  };
});