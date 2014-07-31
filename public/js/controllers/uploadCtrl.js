// js/controllers/uploadCtrl.js

var app = angular.module('uploadController', []);

app.controller('uploadController', function($scope, $http, $upload, Images) {
	$scope.formData = {};

	// POST
	$scope.createImage = function(){
		if (!$.isEmptyObject($scope.formData)){
			Images.create($scope.formData)
				.success(function(data){
					$scope.formData = {};
				});
		}
	};

	$scope.test = function(){
		console.log($scope.formData);
		console.log($scope.files);
	}

	$scope.onFileSelect = function(files) {
  		$scope.uploadInProgress = true;
  		$scope.uploadProgress = 0;
  		
	  	//if (angular.isArray(files)) {
	    	image = files[0];
	    	console.log(image.name);
	  	//} 

	  	$scope.upload = $upload.upload({
	    	url: '/upload',
	    	method: 'POST',
	    	headers: {'Content-Type': 'multipart/form-data'},
	    	data: {
	      		type: 'profile'
	    	},
	    	file: image,
	    	fileFormDataName: 'myUpload',
	  	}).progress(function(event) {
	    	$scope.uploadProgress = parseInt(100.0 * event.loaded / event.total);
	    	console.log('Progress: ' + $scope.uploadProgress + '%');
	    	//$scope.$apply();
	  	}).success(function(data, status, headers, config) {
	    	console.log('Photo uploaded!');
	    	console.log(data);
	  	}).error(function(err) {
	    	$scope.uploadInProgress = false;
	    	console.log('Error uploading file: ' + err.message || err);
	  	});
	};
	
})