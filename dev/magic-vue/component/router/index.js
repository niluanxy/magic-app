module.exports = (function() {

	function runBackAction(scope, call, router) {
		var ret = true;		// 回调返回值

		if (scope[call] && typeof scope[call] == "function") {
			ret = scope[call]();
		}

		if (ret !== false) router.back();
	}

    $$.component("mg-back", {
        template: "<slot></slot>",
        ready: function() {
            var that = this, $el = $(this.$el), state = history.state,
            	router = $$.location, call, scope;

            call  = $el.attr("call");
            scope = $$._getPage(that);
            
			$el.addClass("button button-clear ion-ios-arrow-left")
			.on("tap.common", function() {
				runBackAction(scope, call, router);
			});

			/* 根据不同的情况选择判断逻辑隐藏后退按钮 */
			if (!$$._isRunPage(scope)) {
				$el.off("tap.common").on("tap.modal", function() {
					if (scope.$parent.__MODAL) {
						scope.$parent.__MODAL.hide();
					}
				})
			} else if (router.check(state, "first")) {
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