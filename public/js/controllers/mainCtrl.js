// js/controllers/mainCtrl.js

// Global Controller- contains functions needed for multiple views

var app = angular.module('mainController', []);

app.controller('mainController', function($scope, $location, $http, $materialDialog, Images){
	/*
	$scope.test = function(){
		console.log($scope.user);
	}; */

	// Remove '#_=_' hash from FB login- might not be best way to do so
	if (window.location.href.indexOf('#_=_') > 0){
		console.log('yup');
		window.location = window.location.href.replace(/#.*/, '');
	}

	$scope.login = function(){ 
		//window.location.assign('http://platter.herokuapp.com/auth/facebook');
		window.location.assign('http://localhost:8080/auth/facebook');
	};

	$scope.logout = function(){ 
		//window.location.assign('http://platter.herokuapp.com/logout');
		window.location.assign('http://localhost:8080/logout');
	};

	// Watch for route changes and select to correct tab
	$scope.$on('$locationChangeStart', function(event){
		//console.log($location.path());
		$scope.selectTab();
	})

	// Navigate to a page
	$scope.nav = function(route){
		$location.path(route);
		$scope.selectTab();
	};

	// Highlight the correct page on the navbar
	$scope.selectTab = function(){
		switch($location.path()){
			case '/':
				$scope.selectedIndex = 0;
				break;
			case '/upload':
				$scope.selectedIndex = 1;
				break;
			case '/login':
				$scope.selectedIndex = 2;
				break;
			case '/profile':
				$scope.selectedIndex = 3;
				break;
			default:
				$scope.selectedIndex = -1;
				break;
		}
	};

	//// IMAGE RELATED FUNCTIONS

	// Open a dialog with larger picture/more info about an image
	$scope.imgDialog = function(img, $event) {
    var hideDialog = $materialDialog({
      templateUrl: '/templates/img-lg.html',
      targetEvent: $event,
      controller: 
    	['$scope', '$hideDialog', function($scope, $hideDialog){
    		$scope.img = img;

      	$scope.close = function(){
      		$hideDialog();
      	};
      }] 
    });
  };

	// PUT
	// Add/remove an image from user's favorites
	$scope.modFavs = function(img){
		if ($scope.user){
			var index = $scope.user.favorites.indexOf(img._id);
			if (index > -1){
				console.log("remove");
				$scope.user.favorites.splice(index, 1); //This is hacky and should be changed
				
				img.favorites--;
				Images.rmvFav(img)
					.success(function(data){
						img = data;
						//$scope.images = data;
					}); 
			} else {
				console.log("add");
				$scope.user.favorites.push(img._id); //This is hacky and should be changed
				
				img.favorites++;
				Images.addFav(img)
					.success(function(data){
						img = data;
						//$scope.images = data;
					}); 
			}
		} else {
			//alert("Sorry! You need to sign in or register to favorite a picture!");
			$scope.favsDialog();
		} 
	};

	// Dialog telling users to login to favorite an image
	$scope.favsDialog = function() {
    var hideDialog = $materialDialog({
      templateUrl: '/templates/fav-login.html',
      controller: 
    	['$scope', '$hideDialog', function($scope, $hideDialog){
      	$scope.close = function(){
      		$hideDialog();
      	};
      }] 
    });
  };

	// true/false if an image is favorited by the user
	$scope.checkFav = function(img){
		if ($scope.user){
			var index = $scope.user.favorites.indexOf(img._id);
			if (index > -1){
				return true;
			} else {
				return false;
			}
		}
	};

});