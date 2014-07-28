// js/controllers/profCtrl.js

var app = angular.module('profileController', []);

app.controller('profileController', function($scope, $http, Users) {

	// PUT
	$scope.rmvFav = function(imgId){
		Users.removeFav($scope.user.facebook.id, imgId)
			.success(function(data){
				$scope.user.images = data;
			});
	};

	// DELETE
	$scope.deleteImage = function(imgId){
		Users.deleteUpload($scope.user.facebook.id, imgId)
			.success(function(data){
				$scope.user.images = data;
			});
	};

	// PUT (debugging function)
	$scope.reset = function(){
		Users.reset()
			.success(function(data){
				$scope.user.images = data;
			});
	};

	$scope.test = function(){
		console.log($scope.user);
		console.log($scope.uploads);
	};

})