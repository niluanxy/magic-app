module.exports = (function(win) {
    if (window.MgNative && MgNative.core) return;
    
    var $$ = win.mvue, CACHE = [], createLoading = null,
        transend    = "transitionend.load animationend.load",
        slideInCls  = "slideInRight slideInLeft",
        slideOutCls = "slideOutRight slideOutLeft",
        animateCls  = slideInCls + " " + slideOutCls;

    /**
     * ============================================================
     * 路由表相关绑定参数有以下几个：
     *
     * title:           用于生成 load 页面的标题文字
     * loadCall:        调用自定义方法来生成 load 页面
     * loadHead:        是否显示 header 部分，默认为 true
     *
     * ============================================================
     * 全局配置绑定参数有以下几个：
     *
     * loadCall:        全局默认的生成 load 页面的方法
     * loadHead:        是否需要显示 header 部分，默认为 true
     *
     * ============================================================
     * 对象实例上触发的事件有以下几个：
     *
     * mgViewHide: 页面隐藏时，会在实例上触发这个方法，UI组件可以在监听
     * 到这个方法的时候，暂停动画效果或事件，节省资源。
     */


    // 默认创建 load 页面的函数
    createLoading = function(header, title, back) {
        var html = '<div class="loader">', bcls;

        bcls  = $$.config.backButtonClass;

        if (header) {
            html += '<div class="bar bar-header">';

            if (back)   html += '<a class="'+bcls+'"></a>';
            if (title) html += '<h3 class="title">'+title+'</h3>';

            html += '</div>';
        }

        html += '<div class="spiner"></div>';

        return html+"</div>";
    }

    $$.off("routeOn.page");     // 移除默认的页面切换效果

    $$.on("routeOn.animate", function($wshow, $whide, nowMatch, $route) {
        var $config = $$.config.common, showCls, hideCls,
            $loader = $wshow.find(".loader"),
            match = nowMatch[nowMatch.length-1], item = match.item;

        // 如果是缓存的页面，则不需要创建load效果，直接使用旧的
        if (!$loader.length) {
            var make = item.loadCall || $config.loadCall || createLoading;
            $(make($$.needHeader(match), item.title, !$$.inFirstView()))
                .appendTo($wshow);
        }

        if ($route.evetype == "pushstate") {
            showCls = "slideInRight";
            hideCls = "slideOutLeft";
        } else {
            showCls = "slideInLeft";
            hideCls = "slideOutRight";
        }

        $.rafCall(function() {
            $wshow.off(transend).removeClass(animateCls + " hide");

            // 如果隐藏的页面存在，隐藏页面同时触发 页面隐藏事件
            if ($whide && $whide[0].MG_CHILDREN) {
                $whide.off(transend).removeClass(animateCls + " hide");
                $whide[0].MG_CHILDREN.$emit("mgViewHide");
            }
        })

        $.rafCall(function() {
            $wshow.addClass(showCls).on(transend, function(e) {
                // 忽略非容器自身触发的动画事件
                if (e.target != $wshow[0]) return;

                $whide && $whide.addClass("hide").removeClass(animateCls);
                $wshow.off(transend).removeClass(animateCls+" hide");
            })

            $whide && $whide.addClass(hideCls).removeClass("hide");
        })
    });

    $$.on("viewReady.animate", function($wshow, scope) {
        if (!$$.isRunPage(scope)) return;

        var $el = $(scope.$el), $load = $wshow.find(".loader");

        $el.css("opacity", '0');
        $load.find(".spiner").addClass("fadeOut");

        $.rafCall(function() {
            $el.addClass("viewShow").on(transend, function(e) {
                // 忽略非容器自身触发的动画事件
                if (e.target != $el[0]) return;

                $load.addClass("hide");
                $el.off(transend).removeCss("opacity").removeClass("viewShow")
            });
        })
    });
})(window);
