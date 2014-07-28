// js/services/imgService.js

var app = angular.module('imgService', []);

app.factory('Images', function($http){
	return{
		get: function(){
			return $http.get('/images');
		},
		create: function(formData){
			return $http.post('/images', formData);
		},
		delete: function(imgId){
			return $http.delete('/images/' + imgId);
		},
		addFav: function(img){
			return $http.put('/images/favorites/add', img);
		},
		rmvFav: function(img){
			return $http.put('/images/favorites/remove', img);
		},
	}
})