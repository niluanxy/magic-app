module.exports = (function() {
    $$.component("mg-back", {
        template: "<slot></slot>",
        ready: function() {
            var that = this, $el = $(this.$el), state = history.state,
            	router = $$.location, call, scope, hasBack = false, cache;

            call  = $el.attr("call");
            scope = $$.getVm(that);
            cache = $el.attr("backCache");

            if (!$el.attr("class")) {
                $el.addClass("button button-clear ion-ios-arrow-left")
            }

			$el.on("tap.back", function() {
				var ret = true;		// 回调返回值

				if (typeof scope[call] == "function") {
					ret = scope[call]();
				}

				if (ret !== false && !hasBack) {
					hasBack = true;
                    router.back();
				}
			})

            if ($$._isRunPage(scope)) {
                $$.__PAGE__.BACKCACHE = cache == "true";

                /* 如果是首个页面，直接隐藏 back 组件 */
    			if (!router || router.check(state, "first")) {
    				var last = router ? router.last.state : null;

    				if (!$J || !$J.router) {
    					if ($$.__STATE__.ROUTER_AFTER) {
    						$el.remove();
    					} else if (state && last && state.id != last.id) {
    						$el.remove();
    					}
    				}
    			}
            } else {
                /* 如果运行在 modal 模式，修正返回动作为关闭 modal */
                $el.off("tap.back").on("tap.modal", function() {
                    if (scope._MODAL_) scope._MODAL_.hide();
                })
            }
        }
    });
})();
