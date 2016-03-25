module.exports = (function() {
    $$.component("mg-back", {
        template: "<slot></slot>",
        ready: function() {
            var that = this, $el = $(this.$el), state = history.state,
            	router = $$.location, call, scope, hasBack = false;

            call  = $el.attr("call");
            scope = $$.getVm(that);
            
			$el.addClass("button button-clear ion-ios-arrow-left")
			.on("tap.common", function() {
				var ret = true;		// 回调返回值

				if (typeof scope[call] == "function") {
					ret = scope[call]();
				}

				if (ret !== false && !hasBack) {
					hasBack = true;
					router.back();
				}
			});

			/* 如果是首个页面，直接隐藏 back 组件 */
			if (router.check(state, "first")) {
				var last = router.last.state;

				if (!$J || !$J.router) {
					if ($$.__STATE__.ROUTER_AFTER) {
						$el.remove();
					} else if (state && last && state.id != last.id) {
						$el.remove();
					}
				}
			}
        }
    });
})();