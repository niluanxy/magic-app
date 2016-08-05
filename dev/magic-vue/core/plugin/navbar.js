module.exports = (function() {
    var $$ = window.mvue, $route = $$.location, goUrl;


    /**
     * 自动给页面添加 nav 导航栏，相关说明如下:
     *
     *============================================================
     * 全局配置中，暴露的配置参数如下：
     *
     * navFoot:         要添加的导航内容，HTML模板，默认会去查找子元
     * 素，然后获得上面的 match 属性，match 属性用来定义在那个路由的
     * 时候显示，支持正则语句。
     *
     * ============================================================
     * 路由表中得暴漏的配置参数如下：
     *
     * navFoot:         此为一个 boolean 类型的值，如果为 flase，则
     * 就算匹配了 URL ，也强制不显示。
     *
     */

    function testMatch(match, url) {
        url = url.replace(/^[\#|\/|\\]/g, '');

        for(var i=0; i<match.length; i++) {
            if (match[i].match.test(url)) return i;
        }

        return -1;
    }

    $$.on("routeInit.navbar", function($route, options) {
        var navfoot = options.navFoot, match = [], wrap;

        if (navfoot && navfoot.template) {
            var $navs = $(navfoot.template).children(),
                items = $navs[0].children;

            for(var i=0; i<items.length; i++) {
                var reg, $item = $(items[i]), str = $item.attr("match");

                if (str[0] != "/") str = '^'+str;

                match.push({
                    match: new RegExp(str),
                    html : $item.removeAttr("match").outerHtml(),
                });
            }

            wrap = $navs.html("").outerHtml();

            $$.on("routeBefore.navbar", function(lastUrl, nowUrl, match, handle) {
                goUrl = nowUrl; // 缓存前往的URL，防止同步组件URL获取错误
            })

            // 如果有相关对象和配置，才绑定事件
            $$.on("viewReady.navbar", function($wshow, scope) {
                var $dom, url = goUrl || $route.geturl(),
                    find = testMatch(match, url);

                $wshow.children(".navs").remove();

                if (find !== -1) {
                    $dom = $(wrap).addClass("navs");

                    for(var i=0; i<match.length; i++) {
                        var $item = $(match[i].html);

                        if (i == find) $item.addClass("actived");

                        $dom.append($item);
                    }

                    $wshow.addClass("hasNavBar").append($dom);
                } else {
                    $wshow.removeClass("hasNavBar");
                }
            });
        }
    });
})();
