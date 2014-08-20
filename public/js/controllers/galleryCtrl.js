// js/controllers/galleryCtrl.js

var app = angular.module('galleryController', []);

app.controller('galleryController', function($scope, $http, $location, Images) {
	$scope.sortMethod = "name";
	$scope.imgLimit = 12;

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

	$scope.test = function(){
		console.log($scope.images);
	}
})