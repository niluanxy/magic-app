/**
 * 图片懒加载插件
 */

module.exports = (function() {
	$$.compontent.lazy = {
		default: require("./default.png")
	}
	
	var DEFAULT = $$.compontent.lazy.default;

	function checkShow(height, fix, move, check) {
		return (height-fix-move) > (-check);
	};

	function initLazy(scroll, $el, newVal) {
		scroll = scroll ? scroll : $$.__PAGE__.CONTENT;
		if (!scroll) return true;		// 参数不合法退出

		var $wrapper = $(scroll.wrapper), func;

		func = $.delayCall(function() {
			var hei = $wrapper.height(),
				fix = $wrapper.offset().top,
				tel = $el.offset().top;

			if (hei == "auto" /* content未渲染 */) {
				$wrapper.render(function() {
					scroll._execEvent("scroll")
				})
			} else {
				if (checkShow(hei, fix, scroll.y, tel)) {
					if (newVal) $el.attr("src", newVal);

					/* 尝试设定头像的大小 */
					if ($el.attr("resize") == "true") {
						$el.css("height", $el.width()+"px");
					}
					
					scroll.off("scroll", func);	// 移除监控事件
				}
			}
		}, 100);

		scroll.on("scroll", func);
		scroll._execEvent("scroll");			// 手动初始化检测一次
	}

	Vue.directive("src", {
		update: function(newVal) {
			var $el = $(this.el), load, $root, content;

			load = $el.attr("load") ? $el.attr("load") : DEFAULT;
			$el.attr("src", load);		// 初始化设置默认图片

			$root = this.vm.$root;

			$root.$on("pageRender", function(scroll) {
				initLazy(scroll, $el, newVal);
			});

			content = $$.__PAGE__.CONTENT;
			if (content /* 后插入组件修复 */) {
				initLazy(content, $el, newVal);
			}
		},

		unbind: function() {
			if ($$.__PAGE__.CONTENT /* 后插入组件修复 */) {
				var wrapper = $($$.__PAGE__.CONTENT.wrapper);
				
				wrapper.off("scroll.lazy");	// 移除监控事件
			}
		}
	})
})();