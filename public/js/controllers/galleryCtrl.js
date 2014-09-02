// js/controllers/galleryCtrl.js

var app = angular.module('galleryController', []);

app.controller('galleryController', function($scope, $http, $location, Images) {
	$scope.sortMethod = "-dateAdded";
	$scope.imgLimit = 25;

	// GET
	Images.get()
		.success(function(data){
			$scope.images = data;
		});

	// DELETE 
	// Delete an image from main gallery- only for debugging
	$scope.deleteImage = function(id){
		Images.delete(id)
			.success(function(data){
				$scope.images = data;
			}); 
	};

	$scope.test = function(){
		console.log($scope.images);
	};

	
});