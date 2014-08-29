// js/controllers/profCtrl.js

var app = angular.module('profileController', []);

app.controller('profileController', function($scope, $http, Users) {

	// If user is logged in, load user data (images & favorites) into page
	if ($scope.user){
		Users.getInfo()
			.success(function(data){
				var userInfo = data;
				$scope.uploads = userInfo.uploads;
				$scope.favorites = userInfo.favorites;
			})
			.error(function(data){
				console.log(data);
			});
	}

	// DELETE
	// Delete an image from a user's profile page
	$scope.deleteImage = function(imgId){
		Users.deleteUpload(imgId)
			.success(function(data){
				$scope.uploads = data;
			})
			.error(function(data){
				console.log(data);
			});
	};

	// PUT
	// Reset a user's favorites and uploads to {}: debugging only
	$scope.reset = function(){
		Users.reset()
			.success(function(data){
				$scope.user.images = data;
			});
	};

	$scope.test = function(){
		console.log($scope.user);
		console.log($scope.uploads);
		console.log($scope.favorites);
	};

})