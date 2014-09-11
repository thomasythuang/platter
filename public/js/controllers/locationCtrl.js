// js/controllers/locationCtrl.js

var app = angular.module('locationController', []);

app.controller('locationController', function($scope, $http, $location, $routeParams) {
	$scope.sortMethod = "-favorites";
	$scope.imgLimit = 10;

	$scope.params = $routeParams;

	$http.get('/location/imgs/' + $scope.params.loc_name)
		.success(function(data){
			$scope.imgs = data;
		})
		.error(function(data){
			console.log("Location not found");
			$location.path('/location/404');
		});
	
	$scope.test = function(){
		console.log($scope.user);
		console.log($scope.imgs);
	};
})