// js/controllers/uploadCtrl.js

var app = angular.module('uploadController', []);

app.controller('uploadController', function($scope, $http, $upload, $filter, $materialDialog) {
	$scope.formData = {};
	$scope.selectedFiles = [];
	$scope.inProgress = false;
	$scope.fileSelected = false;
	$scope.data = {
		progress: 0,
	};

	$scope.test = function(){
		//console.log($scope.formData);
		//console.log($scope.selectedFiles);
		//console.log($scope.user)
		//console.log($scope.progress);
		console.log('Form valid: ' + $scope.upForm.$valid);
		console.log('File valid: ' + $scope.fileSelected);
	};

	// Add files to selected files array
	$scope.onFileSelect = function(file){
		$scope.selectedFiles = $scope.selectedFiles.concat(file);
		$scope.fileSelected = true;
	};

	// Deselect files
	$scope.unselect = function(file){
		var index = $scope.selectedFiles.indexOf(file);
		if (index > -1){
			$scope.selectedFiles.splice(index, 1);
		}
		if ($scope.selectedFiles.length < 1)
			$scope.fileSelected = false;
	};

	// Clear the upload form
	$scope.clearForm = function(){
		$scope.formData = {};
  	$scope.selectedFiles = [];
  	$scope.inProgress = false;
  	$scope.progress = 0;
  	$scope.fileSelected = false;
	};

	$scope.upload = function(file){
		$scope.inProgress = true; 
		$upload.upload({
    	url: '/upload',
    	method: 'POST',
    	data: {
      		name: 	$scope.formData.name,
      		city: 	$scope.formData.city,
      		state: 	$scope.formData.state,
    	},
    	file: $scope.selectedFiles[$scope.selectedFiles.length-1],
    	fileFormDataName: 'image',
  	}).progress(function(evt){
  		$scope.data.progress = parseInt(100.0 * evt.loaded/evt.total);
  		console.log('Progress: ' + $scope.data.progress);
  		//console.log(100.0 * evt.loaded/evt.total);
  	}).success(function(data){
    	console.log('Upload complete!');
    	$scope.clearForm();
    	$scope.uplDialog(data);
  	}).error(function(err){
  		$scope.inProgress = false;
    	$scope.handleError(err);
  	});
	};

	// Error handler
	$scope.handleError = function(err){
		var head;
		var message;
		if (err.code == 415){
			var format = err.fmt;
			head = "Unsupported file type!";
			message = "Sorry! You uploaded an unsupported image type (." + format + "). We support .jpg, .png, and .gif files up to 2MB in size.";
		}else if(err.code == 413){
			var size = $filter('number')(err.size/1000000, 2);
			head = "Image file too large!";
			message = "Sorry! The image file you uploaded was too large (" + size + "MB). We support .jpg, .png, and .gif files up to 2MB in size.";
		}else{
			head = "Error";
			message = "Sorry! The upload failed for an undocumented reason. Please contact an administrator for more assisstance";
		}
		$scope.errDialog(head, message);
	};

	// Open dialog on upload error
	$scope.errDialog = function(head, msg){
		var hideDialog = $materialDialog({
      templateUrl: '/templates/upl-error.html',
      controller: 
    	['$scope', '$hideDialog', function($scope, $hideDialog){
    		$scope.head = head;
    		$scope.message = msg;

      	$scope.close = function(){
      		$hideDialog();
      	};
      }] 
    });
	};

	// Open dialog upon image upload completion
	$scope.uplDialog = function(img){
    var hideDialog = $materialDialog({
      templateUrl: '/templates/upl-done.html',
      controller: 
    	['$scope', '$hideDialog', function($scope, $hideDialog){
    		$scope.img = img;

      	$scope.close = function(){
      		$hideDialog();
      	};
      }] 
    });
  };
	
});