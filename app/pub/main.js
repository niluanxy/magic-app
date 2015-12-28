require("./lib/magic.vue.js");

$(function() {
	var init = $$.initView, load = $$.loadView;

	/**
	 * 同步组件加载示例代码
	 * 
	 * load("sync-page", require("page/sync-page"));
	 */

	$$.route({
		"/home": load("home", function(defer) {
			require(["page/home"], init(defer));
		}),

		"/list": load("list", function(defer) {
			require(["page/list"], init(defer));
		}),

	    "/shop/:shopid": load("shop", function(defer) {
	    	require(["page/shop"], init(defer));
	    }),

		"/cart": load("cart", function(defer) {
	    	require(["page/cart"], init(defer));
	    }),

	    "/user/home": function() {
			console.log("should load user")
	        require(["page/user"], loadView);
	    },
	}).init({
		authBase: 2,					// 所有的页面都要登陆
		authPage: "/user/auth",			// 需要验证的页面跳转的地址
	},true);
})