// public/js/ngRoutes.js
	angular.module('ngRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		//
		.when('/', {
			templateUrl: 'views/gallery.html',
			controller: 'galleryController',
		})

		//
		.when('/upload', {
			templateUrl: 'views/upload.html',
			controller: 'uploadController',
		})

		// 
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'loginController',
		});

	$locationProvider.html5Mode(true);

}]);