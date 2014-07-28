// js/controllers/uploadCtrl.js

var app = angular.module('uploadController', []);

app.controller('uploadController', function($scope, $http, Images) {
	$scope.formData = {};

	//POST
	$scope.createImage = function(){
		if (!$.isEmptyObject($scope.formData)){
			Images.create($scope.formData)
				.success(function(data){
					$scope.formData = {};
					$scope.images = data;
				});
		}
	};

	$scope.test = function(){
		console.log($scope.formData);
	}
})