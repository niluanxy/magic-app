require("./lib/magic.vue.js");

$(function() {
	var init = $$.initView, load = $$.loadView;

	/**
	 * 同步组件加载示例代码
	 * 
	 * load("sync-page", require("page/sync-page"));
	 */

	$$.route({
		"/home": {
			title: "首页的信息",
			on: load("home", function(defer) {
				require(["page/home"], init(defer));
			})
		},

		// "/home": {
		// 	title: "首页的信息",
		// 	on: load("home", require("page/home"))
		// },

		"/list": {
			title: "列表页",
			on: load("list", function(defer) {
				require(["page/list"], init(defer));
			})
		},

	    "/shop/:shopid": {
	    	title: "商品页",
	    	on: load("shop", function(defer) {
		    	require(["page/shop"], init(defer));
		    })
	    },

		"/cart": {
			title: "购物车",
			on: load("cart", function(defer) {
		    	require(["page/cart"], init(defer));
		    })
		},

	    "/user/home": {
	    	title: "用户首页",
	    	on: load("user", function(defer) {
		    	require(["page/user"], init(defer));
		    })
		},
	}).init({
		authBase: 2,					// 所有的页面都要登陆
		authPage: "/user/auth",			// 需要验证的页面跳转的地址
	},true);
})