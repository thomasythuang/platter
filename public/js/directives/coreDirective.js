// js/services/coreDirective.js

var app = angular.module('coreDirective', []);

app.directive('mainResources', function(){
	return{
		restrict: 'E',
		// using templateUrl for resources slows down css loading for some reason
		//templateUrl: '/templates/resources.html', 
		template: 
		'<link rel="import" href="/resources/polymer-components/paper-elements/paper-elements.html">'+
		'<link rel="import" href="/resources/polymer-components/core-elements/core-elements.html">'+
		'<link rel="import" href="/resources/polymer-components/core-icons/core-icons.html">'+
		'<link rel="import" href="/resources/polymer-components/font-roboto/roboto.html">'+
		'<link rel="shortcut icon" href="/img/favicon.ico">'+
		'<link rel="stylesheet" href="/css/main.css">',
	};
});

app.directive('mainNavbar', function(){
	return{
		restrict: 'E', 
		templateUrl: '/templates/navbar.html', /*
		template:
		'<core-toolbar class="" id="mainheader">'+
	    '<a href="/">'+
	    	'<paper-icon-button id="navicon" icon="arrow-back"></paper-icon-button>'+
	  	'</a>'+
	    '<span style="font-size:40px">Roboto</span>'+
	    '<span flex>'+
		    '<paper-tabs class="fit" ng-model="tab">'+
		    	'<paper-tab ng-click="test()">Home</paper-tab>'+
		    	'<paper-tab>Upload</paper-tab>'+
		    	'<paper-tab>Login<paper-tab>'+
		  	'</paper-tabs>'+
	  	'</span>'+
	    '<paper-icon-button id="searchbutton"'+ 
	      'icon="search" ng-click="test()"></paper-icon-button>'+
	  '</core-toolbar>', */
	};
});