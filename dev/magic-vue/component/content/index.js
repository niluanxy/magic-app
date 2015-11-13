require("./style.scss");

module.exports = (function() {
    $$.component("mg-content", {
        template: "<div class='scroll_body'><content></content></div>",
        ready: function() {
            var $el = $(this.$el), $scroll, childs,
                handle, refresh, opt = {}, repos;   // 定义操作对象

            refresh = $el.attr("refresh")   // 默认开启自动刷新
            opt.refresh = refresh=="true"?"true":"once";
            opt.pullRefreshDown = this[$el.attr("pullRefreshDown")] || null;
            opt.pullRefreshUp   = this[$el.attr("pullRefreshUp")]   || null;

            $scroll = $el.addClass("content").scroll(opt); // 初始化

            childs = $el.parent()[0].children;
            for(var i=0; i<childs.length; i++) {
                var tagname = childs[i].tagName.toLowerCase();

                if (tagname == "mg-header") {
                    $el.addClass("has-header");
                } else if ("mg-footer mg-tabs".search(tagname) > -1) {
                    $el.addClass("has-footer");
                }
            }

            handle = $el.attr("handle");
            if (handle && this[handle] !== undefined) {
                this[handle] = $scroll;
            }

            /* 如果父元素是 mg-page 说明是主内容区域 */
            if ($el.parent().tagName() == "mg-page") {
                $$.__PAGE__.CONTENT = $scroll;
                this.$dispatch("pageRender", $scroll);
            }

            // 是否监控数据自动刷新内容
            repos = $el.attr("repos");
            if (this[refresh] != undefined) {
                this.$watch(refresh, function(newVal) {
                    Vue.nextTick(function() {
                        $scroll.refresh();
                        if (repos) $scroll.scrollTo(0, 0);
                    })
                })
            }
        }
    });

    $$.component("mg-scroll", {
        template: "<div><content></content></div>",
        ready: function() {
            var $el = $(this.$el), $scroll, handle,
                refresh, repos, opt = {};   // 定义操作对象

            refresh = $el.attr("refresh")   // 默认开启自动刷新
            opt.refresh = refresh=="true"?"true":"once";
            opt.scrollbars = $el.attr("scrollbars");

            if ($el.attr("scroll-x")) {
                opt.scrollX = true;
                opt.scrollY = false;
                $el.children().addClass("scroll-x");
            }

            $scroll = $el.addClass("mg-scroll").scroll(opt);

            handle = $el.attr("handle");
            if (handle && this[handle] !== undefined) {
                this[handle] = $scroll;
            }

            // 是否监控数据自动刷新内容
            repos   = $el.attr("repos");
            if (this[refresh] !== undefined) {
                this.$watch(refresh, function() {
                    Vue.nextTick(function() {
                        $scroll.refresh();
                        if (repos) $scroll.scrollTo(0, 0);
                    })
                })
            }
        }
    })
})();