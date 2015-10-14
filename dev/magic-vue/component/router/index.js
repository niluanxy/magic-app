module.exports = (function() {
    $$.component("mg-back", {
        template: "<content></content>",
        attached: function() {
            var that = this, $el = $(this.$el),
            	call = $el.attr("call"), router = $$.__ROUTER__;
            
			$el.addClass("back").on("tap", function() {
				var ret = true;		// 回调返回值

				if (that[call] && typeof that[call] == "function") {
					ret = that[call]();
				}

				if (ret !== false) router.back();
			});

			// 如果当前是第一项，则直接隐藏
			if (router.geturl() == router.state[0].url) {
				$el.addClass("hide");	
			}
        }
    });
})();