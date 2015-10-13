window.Vue = require("./lib/vue.min.js")
require("./lib/magic.vue.js");

$(function() {
	$$.route({
		"/home": function() {
			console.log("should load home")
	        require(["../page/home"], loadView);
	    },

		"/list": function() {
			console.log("should load list")
	        require(["../page/list"], loadView);
	    },

		"/user": function() {
			console.log("should load user")
	        require(["../page/user"], loadView);
	    }
	}).init(true);
})