// js/controllers/profCtrl.js

var app = angular.module('profileController', []);

app.controller('profileController', function($scope, $location, $http, $materialDialog, Users) {

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

	$scope.test = function(){
		console.log($scope.user);
		console.log($scope.uploads);
		console.log($scope.favorites);
	};

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

	$scope.openDialog = function(img, $event) {
    var hideDialog = $materialDialog({
      templateUrl: '/templates/edit-img.html',
      targetEvent: $event,
      controller: 
    	['$scope', '$hideDialog', function($scope, $hideDialog, $watch){
      	$scope.img = img;
      	$scope.nameLabel = img.name;
      	$scope.cityLabel = img.city;
      	$scope.stateLabel = img.state;
      	$scope.name = "";
      	$scope.city = "";
      	$scope.state = "";
      	$scope.$watch('name', function(){
      		if ($scope.name.length > 0){
	      		$scope.nameLabel = "Name";
	      	}else{
	      		$scope.nameLabel = $scope.img.name;
	      	}
      	});
      	$scope.$watch('city', function(){
      		if ($scope.city.length > 0){
	      		$scope.cityLabel = "City";
	      	}else{
	      		$scope.cityLabel = $scope.img.city;
	      	}
      	});
      	$scope.$watch('state', function(){
      		if ($scope.state.length > 0){
	      		$scope.stateLabel = "State";
	      	}else{
	      		$scope.stateLabel = $scope.img.state;
	      	}
      	});

      	$scope.close = function(){
      		$hideDialog();
      	};
      }] 
    });
  };


});