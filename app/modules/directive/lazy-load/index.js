/**
 * 图片懒加载插件
 */

module.exports = (function() {
	var img = require("./default.png");

	function checkShow(height, fix, move, check) {
		return (height-fix-move) > (-check);
	};

	function initLazy(scroll, $el, scope) {
		scroll = scroll ? scroll : $$.__PAGE__.CONTENT;
		if (!scroll) return true;		// 参数不合法退出

		var eve = "touchmove._lazy_" + $.getRandom(),
			$wrapper = $(scroll.wrapper);

		/* 尝试设定头像的大小 */
		if ($el.attr("resize") == "true") {
			$el.css("height", $el.width()+"px");
		}

		$wrapper.on(eve, $.delayCall(function() {
			var hei = $wrapper.height(),
				fix = $wrapper.offset().top,
				tel = $el.offset().top;

			if (checkShow(hei, fix, scroll.y, tel)) {
				if (scope && scope.val) $el.attr("src", scope.val);
				$wrapper.off(eve);	// 移除监控事件
			}
		}, 100));

		$wrapper.trigger(eve);		// 手动初始化检测一次
	}

	Vue.directive("src", {
		bind: function(value) {
			var $el = $(this.el), load, scope, src = this.raw, $root;
			
			load = $el.attr("load") ? $el.attr("load") : img;
			$el.attr("src", load);		// 初始化设置默认图片

			scope = $$.objParse(this.vm, src);
			$root = this.vm.$root;

			$root.$on("pageRender", function(scroll) {
				initLazy(scroll, $el, scope);
			});

			if ($$.__PAGE__.CONTENT /* 后插入组件修复 */) {
				initLazy($$.__PAGE__.CONTENT, $el, scope);
			}
		},
	})
})();