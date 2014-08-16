// js/services/coreDirective.js

var app = angular.module('coreDirective', []);

app.directive('mainResources', function(){
	return{
		restrict: 'E',
		// using templateUrl slows down css loading for some reason
		//templateUrl: '/templates/resources.html',
		template: 
		//'<script src="/resources/polymer-components/platform/platform.js"></script>'+
		//'<link rel="import" href="/resources/polymer-components/paper-elements/paper-elements.html">'+
		//'<link rel="import" href="/resources/polymer-components/core-elements/core-elements.html">'+
		//'<link rel="import" href="/resources/polymer-components/core-icons/core-icons.html">'+
		'<link rel="import" href="/resources/polymer-components/font-roboto/roboto.html">'+
		'<link rel="shortcut icon" href="/img/favicon.ico">'+
		'<link rel="stylesheet" href="/resources/bootstrap.min.css">'+
		'<link rel="stylesheet" href="/resources/font-awesome.min.css">'+
		'<link rel="stylesheet" href="/css/main.css">'+
		'<script src="/resources/jquery-2.1.1.min.js"></script>'+
		'<script src="/resources/bootstrap.min.js"></script>',
	};
});

app.directive('mainNavbar', function(){
	return{
		restrict: 'E', 
		//templateUrl: '/templates/navbar.html',
		template:
		'<header>'+
		'<nav class="navbar navbar-default">'+
			'<div class="container">'+
		      	'<div class="navbar-header">'+
		        	'<a class="navbar-brand" href="#">Platter</a>'+
		      	'</div>'+
		      	'<ul class="nav navbar-nav navbar-right">'+
		        	'<li><a href="/"><span class="fa fa-home"></span> Home</a></li>'+
		        	'<li><a href="/upload"><span class="fa fa-upload"></span> Upload</a></li>'+
		        	'<li ng-hide="user"><a href="/login"><span class="fa fa-sign-in"></span> Login</a></li>'+
		        	'<li ng-show="user"><a href="/profile"><span class="fa fa-facebook-square"></span> {{user.facebook.name}}</a></li>'+
		  		'</ul>'+
			'</div>'+
		'</nav>'+
		'</header>'
	};
});