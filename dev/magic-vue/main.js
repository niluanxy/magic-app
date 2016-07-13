module.exports = (function() {
    var $$, eveBus = new Vue();

    window.mvue = $$ = {
        location   : null,       // 全局ROUTER对象

        _CACHE_    : [],         // 页面 缓存数据
        _WRAP_     : null,       // 最外层的 mg-view 对象

        refreshView: true,       // 是否刷新页面数据，默认刷新

        config     : {},         // 全局组件相关配置对象
    };

    // 设置最外层的总 显示容器
    $$._WRAP_ = $("body").find("mg-view");

    $$.on = function(eveName, call) {
        eveBus.$on(eveName, call);
    }

    $$.emit = function(eveName) {
        eveBus.$emit.apply(eveBus, arguments);
    }

    $$.once = function(eveName, call) {
        eveBus.$once(eveName, call);
    }

    /**
     * 创建一个全局的 compontent 对象
     * @param  {[type]} ids [description]
     * @param  {[type]} opt [description]
     * @return {[type]}     [description]
     */
    $$.component = function(ids, opt) {
        if (opt /* 参数默认值全局设置 */) {
            if (opt.replace === undefined) {
                opt.replace = false;
            }
            if (opt.inherit === undefined) {
                opt.inherit = true;
            }
        }

        return Vue.component(ids, opt);
    }

    return window.$$ = $$;
})();
