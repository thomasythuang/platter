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
		})

		//
		.when('/profile', {
			templateUrl: 'views/profile.html',
			controller: 'profileController',
		})

		.when('/location/:loc_name', {
			templateUrl: '../views/location.html', 
			controller: 'locationController',
		});

	$locationProvider.html5Mode(true);

}]);