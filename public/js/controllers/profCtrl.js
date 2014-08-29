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

	// true/false if an image is favorited by the user
	$scope.checkFav = function(img){
		if ($scope.user){
			var index = $scope.user.favorites.indexOf(img._id);
			if (index > -1){
				return true;
			} else {
				return false;
			}
		}
	}

	// PUT
	$scope.rmvFav = function(imgId){
		Users.removeFav(imgId)
			.success(function(data){
				$scope.user.images = data;
			});
	};

	// DELETE
	$scope.deleteImage = function(imgId){
		Users.deleteUpload(imgId)
			.success(function(data){
				$scope.uploads = data;
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
		console.log($scope.favorites);
	};

})