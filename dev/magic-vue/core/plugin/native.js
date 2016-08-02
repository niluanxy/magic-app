module.exports = (function() {
    window.onMgNativeReady = function() {
        var $route = $$.location, $core = MgNative.core;

        // 重写页面跳转方法
        $route.local = $route.go;
        $route.go = function(url, clear) {
            var item = $route.fire(url), title;

            if (item && item.length) {
                title = item[item.length-1].item.title;

                $core.goWeb({ url: url, title: title, clear: clear})
            }
        }

        // 重写页面返回方法
        $route.back = function(noCache) {
            $core.back({cache: !!noCache});
        }
    };
})();
