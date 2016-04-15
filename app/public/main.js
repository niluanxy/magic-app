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
	}).init({
		authBase: 2,					// 所有的页面都要登陆
		authPage: "/user/auth",			// 需要验证的页面跳转的地址
	},true);
})