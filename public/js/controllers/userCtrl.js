// js/controllers/profCtrl.js

var app = angular.module('userController', []);

app.controller('userController', function($scope, $location, $http, $routeParams, Users) {
	$scope.params = $routeParams;
	$scope.selectedIndex = 0;

	// If user is logged in, load user data (images & favorites) into page
	Users.userInfo($scope.params.user_id)
		.success(function(data){
			var userInfo = data;
			$scope.uploads = userInfo.uploads;
			$scope.favorites = userInfo.favorites;
			$scope.profile = userInfo.user;
		})
		.error(function(data){
			console.log(data);
		});

	// Navigate between tabs on profile page
	$scope.go = function(tab){
		$scope.selectedIndex = tab;
		console.log($scope.selectedIndex);
	};

	$scope.test = function(){
		console.log($scope.user);
		console.log($scope.uploads);
		//console.log($scope.favorites);
	};
 	
});