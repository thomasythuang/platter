// public/js/ngRoutes.js
	angular.module('ngRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// Gallery
		.when('/', {
			templateUrl: 'views/gallery.html',
			controller: 'galleryController',
		})

		// Upload Page
		.when('/upload', {
			templateUrl: 'views/upload.html',
			controller: 'uploadController',
		})

		// Login Page
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'loginController',
		})

		// (Private) Profile Page
		.when('/profile', {
			templateUrl: 'views/profile.html',
			controller: 'profileController',
		})

		// (Public) Profile Page 
		.when('/user/:user_id', {
			templateUrl: '../views/user.html', 
			controller: 'userController',
		})

		// Location 
		.when('/location/:loc_name', {
			templateUrl: '../views/location.html', 
			controller: 'locationController',
		})

		.when('/404', {
			templateUrl: '../views/404.html',
		});

	$locationProvider.html5Mode(true);

}]);