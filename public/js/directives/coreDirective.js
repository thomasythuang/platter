// js/services/coreDirective.js

var app = angular.module('coreDirective', []);

app.directive('mainResources', function(){
	return{
		restrict: 'E',
		// using templateUrl for resources slows down css loading for some reason
		//templateUrl: '/templates/resources.html', 
		//template: 
		//'<link rel="stylesheet" href="/css/main.css">',
	};
});

app.directive('mainNavbar', function(){
	return{
		restrict: 'E', 
		templateUrl: '/templates/navbar.html',
	};
});

