require("./style.scss");

module.exports = (function() {
    $$.component("mg-content", {
        template: "<div class='scroll_body'><slot></slot></div>",
        ready: function() {
            var $el = $(this.$el), $scroll, childs, scope,
                handle, refresh, opt = {}, repos;   // 定义操作对象

            scope = $$.getVm(this);

            refresh = $el.attr("refresh")   // 默认开启自动刷新
            opt.refresh = refresh=="true"?"true":"once";
            opt.pullRefreshDown = scope[$el.attr("pullRefreshDown")] || null;
            opt.pullRefreshUp   = scope[$el.attr("pullRefreshUp")]   || null;

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
            if (handle && scope[handle] !== undefined) {
                scope[handle] = $scroll;
            }

            /* 如果父元素是 mg-page 说明是主内容区域 */
            if ($el.parent().tagName() == "mg-page") {
                $$.__PAGE__.CONTENT = $scroll;
                scope.$dispatch("pageRender", $scroll);
            }

            // 是否监控数据自动刷新内容
            repos = $el.attr("repos");
            if (scope[refresh] != undefined) {
                scope.$watch(refresh, function(newVal) {
                    Vue.nextTick(function() {
                        $scroll.refresh();
                        if (repos) $scroll.scrollTo(0, 0);
                    })
                })
            }
        }
    });

    $$.component("mg-scroll", {
        template: "<div><slot></slot></div>",
        ready: function() {
            var $el = $(this.$el), $scroll, handle,
                refresh, repos, opt = {}, scope;   // 定义操作对象

            scope = $$.getVm(this);

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
            if (handle && scope[handle] !== undefined) {
                scope[handle] = $scroll;
            }

            // 是否监控数据自动刷新内容
            repos = $el.attr("repos");
            if (scope[refresh] !== undefined) {
                scope.$watch(refresh, function() {
                    Vue.nextTick(function() {
                        $scroll.refresh();
                        if (repos) $scroll.scrollTo(0, 0);
                    })
                })
            }
        }
    })
})();