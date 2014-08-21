// js/controllers/loginCtrl.js

var app = angular.module('loginController', []);

app.controller('loginController', function($scope, $http, $location){

	$scope.what = function(){
		console.log("what");
		$http.get('/test')
			.success(function(data){
				console.log(data);
			});
	};


});