module.exports = (function() {
    var $$ = window.mvue, $native = window.MgNative;

    /**
     * 数据 Store 相关方法
     */
    $$.store = function(name, option) {
        if (arguments.length == 1) {
            option = name;   // 只有一个参数时，修正顺序
            name   = undefined;
        }

        var obj = {}, store, type, item, actions;

        if (option.state) obj.state = option.state;
        if (option.mutations) obj.mutations = option.mutations;
        if (option.modules) obj.modules = option.modules;
        if (option.middlewares) obj.middlewares = option.middlewares;

        if (!obj.mutations) obj.mutations = {};

        actions = option.actions;
        delete option.actions;
        store = new Vuex.Store(obj);

        if (!actions) actions = {};

        // actions 方法绑定到对象上
        for(var key in actions) {
            item = actions[key];
            type = typeof item;

            if (type == "function") {
                store[key] = (function(call) {
                    return function(/* store... */) {
                        var args, _store, ret;

                        if (arguments[0] instanceof Vuex.Store) {
                            args = $.slice(arguments, 1);
                        } else {
                            args = $.slice(arguments);
                        }

                        _store = store;
                        args.unshift(_store);

                        ret = call.apply(undefined, args);
                        return ret;
                    }
                })(item);
            } else if (type == "string") {
                store[key] = (function(mutation) {
                    return function(/* store... */) {
                        var dispatch, args, _store, ret;

                        if (arguments[0] instanceof Vuex.Store) {
                            args = $.slice(arguments, 1);
                        } else {
                            args = $.slice(arguments);
                        }

                        _store = store;
                        dispatch = _store.dispatch;
                        args.unshift(mutation);

                        ret = dispatch.apply(undefined, args);
                        return ret;
                    }
                })(item);
            }
        }

        // 设置 数据快照 备份方法
        store.$snapshot = function() {
            return $.extend(true, {}, store.state);
        }

        // 设置 数据快照 备份方法
        store.$recover = function(snapshot) {
            if (arguments.length >= 2) {
                snapshot = arguments[1];
            }

            if (typeof snapshot == "object") {
                for(var key in snapshot) {
                    var copy, item = snapshot[key];

                    if ($.isArray(item) || $.isObject(item)) {
                        copy = $.isArray(item) ? [] : {};

                        $.extend(true, copy, snapshot[key]);
                    } else {
                        copy = item;
                    }

                    store.state[key] = copy;
                }
            }
        }

        // 注册为全局的对象
        if (typeof name == "string") {
            $$.store[name] = store;
        }

        return store;
    };
})();
