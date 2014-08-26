// js/controllers/uploadCtrl.js

var app = angular.module('uploadController', []);

app.controller('uploadController', function($scope, $http, $injector) {
	$scope.formData = {};
	$scope.selectedFiles = [];
	$scope.data = {};

	$scope.test = function(){
		console.log($scope.formData);
		console.log($scope.selectedFiles);
		//console.log($scope.user)
	}

	// Add files to selected files array
	$scope.onFileSelect = function(files){
		$scope.selectedFiles = $scope.selectedFiles.concat(files);
	}

	// Deselect files
	$scope.unselect = function(file){
		var index = $scope.selectedFiles.indexOf(file);
		if (index > -1){
			$scope.selectedFiles.splice(index, 1);
		}
	}

	$scope.upload = function(file){
		document.getElementById("name").value = $scope.formData.name;
		document.getElementById("city").value = $scope.formData.city;
		document.getElementById("state").value = $scope.formData.state;

		document.getElementById("upForm").submit();
	}

 	/*
	// POST
	// Upload all selected files 
	$scope.submit = function(){
		var length = $scope.selectedFiles.length;
		if (length < 1){
			alert("you must select at least one image file!");
			return;
		} 

		
		for (var i = 0; i < length; i++){
  		$scope.uploadInProgress = true;
  		$scope.uploadProgress = 0;

	  	$scope.upload = $upload.upload({
	    	url: '/upload',
	    	method: 'POST',
	    	headers: {'content-Type': 'multipart/form-data'},
	    	data: {
	      		name: 	$scope.formData.name,
	      		city: 	$scope.formData.city,
	      		state: 	$scope.formData.state,
	    	},
	    	file: $scope.selectedFiles[i],
	    	fileFormDataName: 'myUpload',
	  	}).progress(function(event) {
	    	$scope.uploadProgress = parseInt(100.0 * event.loaded / event.total);
	    	//console.log('Progress: ' + $scope.uploadProgress + '%');
	    	//$scope.$apply();
	  	}).success(function(data, status, headers, config) {
	    	console.log('Upload complete!');
	    	$scope.formData = {};
	    	$scope.selectedFiles = [];
	  	}).error(function(err) {
	    	$scope.uploadInProgress = false;
	    	console.log('Error uploading file: ' + err.message || err);
	  	});
		} 
	};  */
	
})