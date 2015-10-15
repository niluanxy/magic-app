module.exports = (function() {
    $$.component("mg-back", {
        template: "<content></content>",
        ready: function() {
            var that = this, $el = $(this.$el), state = history.state,
            	call = $el.attr("call"), router = $$.location;
            
			$el.addClass("back").on("tap", function() {
				var ret = true;		// 回调返回值

				if (that[call] && typeof that[call] == "function") {
					ret = that[call]();
				}

				if (ret !== false) router.back();
			});

			/* 根据不同的情况选择判断逻辑隐藏后退按钮 */
			if (router.check(state, "first")) {
				if ($$.__STATE__.ROUTER_AFTER) {
					$el.addClass("hide");
				} else if (state.id != router.last.state.id) {
					$el.addClass("hide");
				}
			}
        }
    });
})();