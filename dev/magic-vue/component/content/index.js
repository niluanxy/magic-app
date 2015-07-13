require("./style.scss");

module.exports = (function() {
    Vue.component("mg-content", {
        template: "<div class='scroll_body'><content></content></div>",
        replace: false,
        inherit: true,
        ready: function() {
            var $el = $(this.$el), $scroll, $parent, handle;   // 定义操作对象

            $scroll = $el.addClass("content").scroll(); // 初始化

            $parent = $el.parent();
            if ($parent.find("mg-header").length) {
                $el.addClass("has-header");
            }
            if ($parent.find("mg-footer").length || 
                $parent.find("tabs-footer").length) {
                $el.addClass("has-footer");
            }

            handle = $el.attr("handle");
            if (handle && this[handle] !== undefined) {
                this[handle] = $scroll;
            }

            // 是否开启触屏后刷新，默认 开启 触屏刷新
            if ($el.attr("refresh") !== false) {
                var $body = $el.children(), last = 0;

                $el.on("touchstart", function(event) {
                    var height = $body.height();

                    if (height != last) {
                        $scroll.refresh();      // 强制刷新高度
                        last = height;          // 更新内容高度
                    }
                })
            }
        }
    });

    Vue.component("mg-scroll", {
        template: "<div><content></content></div>",
        replace: false,
        inherit: true,
        ready: function() {
            var $el = $(this.$el), $scroll, handle;   // 定义操作对象

            $scroll = $el.addClass("mg-scroll").scroll();       // 初始化

            handle = $el.attr("handle");
            if (handle && this[handle] !== undefined) {
                this[handle] = $scroll;
            }

            // 是否开启触屏后刷新，默认 开启 触屏刷新
            if ($el.attr("refresh") !== false) {
                var $body = $el.children(), last = 0;

                $el.on("touchstart", function(event) {
                    var height = $body.height();

                    if (height != last) {
                        $scroll.refresh();      // 强制刷新高度
                        last = height;          // 更新内容高度
                    }
                })
            }
        }
    })
})();