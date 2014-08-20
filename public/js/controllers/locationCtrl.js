// js/controllers/locationCtrl.js

var app = angular.module('locationController', []);

app.controller('locationController', function($scope, $http, $routeParams) {
	$scope.sortMethod = "-favorites";
	$scope.imgLimit = 12;

	$scope.params = $routeParams;

	$http.get('/location/imgs/' + $scope.params.loc_name)
		.success(function(data){
			console.log("works!");
			$scope.imgs = data;
		})
		.error(function(data){
			console.log("Location not found");
		});
	/*
	// GET
	Images.get()
		.success(function(data){
			$scope.images = data;
		});

	// DELETE
	$scope.deleteImage = function(id){
		Images.delete(id)
			.success(function(data){
				$scope.images = data;
			}); 
	}; 

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
	}; */

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
	
	$scope.test = function(){
		console.log($scope.user);
		console.log($scope.imgs);
	};
})