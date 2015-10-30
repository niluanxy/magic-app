/**
 * 图片懒加载插件
 */

module.exports = (function() {
	var img = require("./default.png");

	function checkShow(height, fix, move, check) {
		return (height-fix-move) > (-check);
	};

	Vue.directive("src", {
		bind: function() {
			var $el = $(this.el), load, scope = this.vm, src = this.raw;

			load = $el.attr("load") ? $el.attr("load") : img;
			$el.attr("src", load);		// 初始化设置默认图片

			this.vm.$on("pageRender", function(scroll) {
				var eve = "touchmove._lazy_" + $.getRandom(),
					$wrapper = $(scroll.wrapper);

				$wrapper.on(eve, $.delayCall(function() {
					var hei = $wrapper.height(),
						fix = $wrapper.offset().top,
						tel = $el.offset().top;

					if (checkShow(hei, fix, scroll.y, tel)) {
						if (scope[src]) $el.attr("src", scope[src]);
						$wrapper.off(eve);	// 移除监控事件
					}
				}, 100));

				$wrapper.trigger(eve);		// 手动初始化检测一次
			})
		},
	})
})();