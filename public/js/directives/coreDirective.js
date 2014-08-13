// js/services/coreDirective.js

var app = angular.module('coreDirective', []);

app.directive('mainResources', function(){
	return{
		restrict: 'E',
		templateUrl: '/templates/resources.html',
	};
});

app.directive('mainNavbar', function(){
	return{
		restrict: 'E', 
		templateUrl: '/templates/navbar.html',
	};
});