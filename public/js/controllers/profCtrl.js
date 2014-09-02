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
		//console.log($scope.user);
		console.log($scope.uploads);
		//console.log($scope.favorites);
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

	// PUT
	// Opens a pop-up dialog that allows for editing of image information
	$scope.openDialog = function(img, $event) {
    var hideDialog = $materialDialog({
      templateUrl: '/templates/edit-img.html',
      targetEvent: $event,
      controller: 
    	['$scope', '$hideDialog', '$http', 'Images', function($scope, $hideDialog, $http, Images){
      	$scope.formData = {};
      	$scope.nameLabel = img.name;
      	$scope.cityLabel = img.city;
      	$scope.stateLabel = img.state;
      	$scope.formData.name = $scope.formData.city = $scope.formData.state = "";
      	$scope.formData._id = img._id;

      	// Change between label name and the previous name (this is really convoluted)
      	$scope.$watch('formData.name', function(){
      		if ($scope.formData.name.length > 0){
	      		$scope.nameLabel = "Name";
	      	}else{
	      		$scope.nameLabel = img.name;
	      	}
      	});
      	$scope.$watch('formData.city', function(){
      		if ($scope.formData.city.length > 0){
	      		$scope.cityLabel = "City";
	      	}else{
	      		$scope.cityLabel = img.city;
	      	}
      	});
      	$scope.$watch('formData.state', function(){
      		if ($scope.formData.state.length > 0){
	      		$scope.stateLabel = "State";
	      	}else{
	      		$scope.stateLabel = img.state;
	      	}
      	});

      	// Submit the update request to the server
      	$scope.submit = function(){
      		if ($scope.formData.name.length < 1)
      			$scope.formData.name = img.name;
      		if ($scope.formData.city.length < 1)
      			$scope.formData.city = img.city;
      		if ($scope.formData.state.length < 1)
      			$scope.formData.state = img.state;
      		console.log($scope.formData);
      		Images.update($scope.formData)
      			// refresh the page
      			.success(function(data){
      				img = data;
      				$hideDialog();
      				location.reload();
      			})
      			// log the error
      			.error(function(err){
      				console.log(err);
      			});
      	};

      	$scope.close = function(){
      		$hideDialog();
      	};
      }] 
    });
  };

});