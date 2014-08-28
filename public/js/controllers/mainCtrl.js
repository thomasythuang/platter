// js/controllers/mainCtrl.js

var app = angular.module('mainController', []);

app.controller('mainController', function($scope, $location){
	/*
	$scope.test = function(){
		console.log($scope.user);
	}; */

	$scope.login = function(){ 
		window.location.assign('http://localhost:8080/auth/facebook');
	};

	$scope.logout = function(){ 
		window.location.assign('http://localhost:8080/logout');
	};

	$scope.nav = function(route){
		$location.path(route);
	};

});