// js/controllers/uploadCtrl.js

var app = angular.module('foodApp', [
	'coreDirective',
	]);

app.controller('testController', function($scope) {
	
	$scope.test = function(){
		console.log($scope.tab);
	}

	
});