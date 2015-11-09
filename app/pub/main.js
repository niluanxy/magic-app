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

	    "/shop/:shopid": function(para) {
			console.log("should load shop")
			console.log(para)
	        require(["../page/shop"], loadView);
	    },

		"/cart": function() {
			console.log("should load cart")
	        require(["../page/cart"], loadView);
	    },

	    "/user": function() {
			console.log("should load user")
	        require(["../page/user"], loadView);
	    },
	}).init({
		authBase: 2,					// 所有的页面都要登陆
		authPage: "/user/auth",			// 需要验证的页面跳转的地址
	},true);
})