// js/controllers/mainCtrl.js

var app = angular.module('mainController', []);

app.controller('mainController', function($scope, $location){

	$scope.go = function(path){
		
	};

	$scope.test = function(){
		console.log(location.href);
	};

});