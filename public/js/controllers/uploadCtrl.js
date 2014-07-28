// js/controllers/uploadCtrl.js

var app = angular.module('uploadController', []);

app.controller('uploadController', function($scope, $http, Images) {
	$scope.formData = {};
	$scope.files = [];
	$scope.model = {
		name: "",
	};

	// Listen for the file selected event
	$scope.$on("fileSelected", function(event, args){
		$scope.$apply(function() {
			$scope.files.push(args.file);
		});
		console.log($scope.files);
	});

	// POST
	$scope.createImage = function(){
		if (!$.isEmptyObject($scope.formData)){
			Images.create($scope.formData)
				.success(function(data){
					//$scope.formData = {};
				});
		}
	};

	$scope.upload = function(){ 
		
	};

	$scope.test = function(){
		console.log($scope.formData);
	}
})