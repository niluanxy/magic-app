module.exports = (function(win) {
    var $$ = win.mvue, rouext = {}, $config = $$.config,
        tables = [], Router = require("route");

    /* 页面跳转前的回调方法 */
    rouext.before = function(lastUrl, nowUrl, match, handle) {
        $$.emit("routeBefore", lastUrl, nowUrl, match, handle);
    };

    /* 页面跳转成功后的回调方法 */
    rouext.after = function(lastUrl, nowUrl, match, handle) {
        $$.emit("routeAfter", lastUrl, nowUrl, match, handle);
    };

    rouext.always = function(lastUrl, nowUrl, match, handle) {
        $$.refreshView = true;  // 重置下次页面数据是否刷新状态
        $$.emit("routeAlways", lastUrl, nowUrl, match, handle);
    };

    // 先创建一个全局的路由对象用于其他方法调用
    $$.location = new Router({}, rouext).init(false);

    /**
     * 添加一个新的路由表信息
     * @param  {[type]} route [description]
     * @return {[type]}       [description]
     */
    $$.route = function(route) {
        $$.location.when(route);

        return this;
    }

    /**
     * 初始化整个页面，创建路由对象
     * @param  {[type]} option  [description]
     * @param  {[type]} repatch [description]
     * @return {[type]}         [description]
     */
    $$.init = function(option, repath) {
        var $route = $$.location, fire,
            rouopt = $.extend($route.options, rouext, option || {}, true);

        $config.common      = option || {};
        $config.routeOption = rouopt;

        fire = $route.geturl();
        fire = fire == "#" || !fire ? rouopt.home : fire;

        if (repath) {
            $route.go(rouopt.home, true, false, true);
        } else if (!$route.state.length) {
            $route.go(fire, true, false, true);
        }

        // 路由对象创建完成后触发一个事件
        $$.emit("routeInit", $route, rouopt);

        return this;
    }

    /**
     * 返回当前是停留在第一个页面中
     */
    $$.inFirstView = function() {
        var $route = $$.location,
            last = $route.last.state;

        return !$route.state.length || $route.check(last, "first");
    }

    $config.backButtonClass = "button button-clear ion-ios-arrow-left";

    /**
     * 返回组件创建
     */
    $$.component("mg-back", {
        template: "<slot></slot>",
        ready: function() {
            var that = this, $el = $(this.$el), hasBack,
            	router = $$.location, call, scope, cache;

            call  = $el.attr("call");
            scope = $$.getVm(that);
            cache = $el.attr("backCache");

            if (!$el.attr("class")) {
                $el.addClass($config.backButtonClass);
            }

            scope.$on("mgViewShow", function() {
                hasBack = false; // 重置状态
            })

			$el.on("tap.back", function() {
				var ret = true;		// 回调返回值

				if (typeof scope[call] == "function") {
					ret = scope[call]();
				}

				if (ret !== false && !hasBack) {
                    hasBack = true; router.back();
                }
			})

            if ($$.isRunPage(scope)) {
                $$.refreshView = !(cache == "true");

                /* 如果是首个页面，直接隐藏 back 组件 */
    			if ($$.inFirstView()) {
    				$el.remove();
    			}
            } else {
                /* 如果运行在 modal 模式，修正返回动作为关闭 modal */
                $el.off("tap.back").on("tap.modal", function() {
                    scope.$emit("_ui_back");
                })
            }
        }
    });
})(window);
