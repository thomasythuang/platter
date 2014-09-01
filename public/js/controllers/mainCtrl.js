// js/controllers/mainCtrl.js

var app = angular.module('mainController', []);

app.controller('mainController', function($scope, $location, $http, Images){
	/*
	$scope.test = function(){
		console.log($scope.user);
	}; */

	$scope.login = function(){ 
		//window.location.assign('http://platter.herokuapp.com/auth/facebook');
		window.location.assign('http://localhost:8080/auth/facebook');
	};

	$scope.logout = function(){ 
		//window.location.assign('http://platter.herokuapp.com/logout');
		window.location.assign('http://localhost:8080/logout');
	};

	$scope.nav = function(route){
		$location.path(route);
	};

	//// IMAGE RELATED FUNCTIONS

	// PUT
	// Add/remove an image from user's favorites
	$scope.modFavs = function(img){
		if ($scope.user){
			var index = $scope.user.favorites.indexOf(img._id);
			if (index > -1){
				console.log("remove");
				$scope.user.favorites.splice(index, 1); //This is hacky and should be changed
				
				img.favorites--;
				Images.rmvFav(img)
					.success(function(data){
						img = data;
						//$scope.images = data;
					}); 
			} else {
				console.log("add");
				$scope.user.favorites.push(img._id); //This is hacky and should be changed
				
				img.favorites++;
				Images.addFav(img)
					.success(function(data){
						img = data;
						//$scope.images = data;
					}); 
			}
		} else {
			alert("Sorry! You need to sign in or register to favorite a picture!");
		}
	};

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

});