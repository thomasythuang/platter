// js/controllers/uploadCtrl.js

var app = angular.module('uploadController', []);

app.controller('uploadController', function($scope, $http, $upload, $materialDialog) {
	$scope.formData = {};
	$scope.selectedFiles = [];
	$scope.data = {};

	$scope.test = function(){
		console.log($scope.formData);
		console.log($scope.selectedFiles);
		//console.log($scope.user)
	};

	// Add files to selected files array
	$scope.onFileSelect = function(file){
		$scope.selectedFiles = $scope.selectedFiles.concat(file);
	};

	// Deselect files
	$scope.unselect = function(file){
		var index = $scope.selectedFiles.indexOf(file);
		if (index > -1){
			$scope.selectedFiles.splice(index, 1);
		}
	};

	// Clear the upload form
	$scope.clearForm = function(){
		var input = document.getElementById('f-input');
		if (input != null){
			document.getElementById('f-input').outerHTML = input.outerHTML;
			$scope.selectedFiles = [];
		}
		$scope.formData = {};
  	$scope.selectedFiles = [];
	};

	$scope.upload = function(file){ 
		$upload.upload({
    	url: '/upload',
    	method: 'POST',
    	data: {
      		name: 	$scope.formData.name,
      		city: 	$scope.formData.city,
      		state: 	$scope.formData.state,
    	},
    	file: $scope.selectedFiles[0],
    	fileFormDataName: 'image',
  	}).success(function(data) {
    	console.log('Upload complete!');
    	$scope.clearForm();
    	$scope.uplDialog(data);
  	}).error(function(err) {
    	console.log('Error uploading file: ' + err.message || err);
  	});
	};

	// Open dialog upon image upload completion
	$scope.uplDialog = function(img) {
    var hideDialog = $materialDialog({
      templateUrl: '/templates/upl-done.html',
      //targetEvent: $event,
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