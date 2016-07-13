module.exports = (function() {
    var $$ = window.mvue;

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

        // 设置 数据快照 数据恢复底层方法
        if (!obj.mutations) obj.mutations = {};
        obj.mutations._$RECOVER_ = function(state, snapshot) {
            for(var key in snapshot) {
                var copy, item = snapshot[key];

                if ($.isArray(item) || $.isObject(item)) {
                    copy = $.isArray(item) ? [] : {};

                    $.extend(true, copy, snapshot[key]);
                } else {
                    copy = item;
                }

                state[key] = copy;
            }
        }

        actions = option.actions;
        delete option.actions;
        store = new Vuex.Store(obj);

        // 数据快照 备份和恢复具体方法定义
        if (!actions) actions   = {};
        // 设置 数据快照 备份方法
        actions.$snapshot = function() {
            return $.extend(true, {}, store.state);
        }
        // 设置 数据快照 备份方法
        actions.$recover = function(snapshot) {
            if (arguments.length >= 2) {
                snapshot = arguments[1];
            }

            if (typeof snapshot == "object") {
                store.dispatch("_$RECOVER_", snapshot);
            }
        }

        // actions 方法绑定到对象上
        for(var key in actions) {
            item = actions[key];
            type = typeof item;

            if (type == "function") {
                store[key] = (function(call) {
                    return function(/* store... */) {
                        var args, _store;

                        if (arguments[0] instanceof Vuex.Store) {
                            args = $.slice(arguments, 1);
                        } else {
                            args = $.slice(arguments);
                        }

                        _store = store;
                        args.unshift(_store);

                        return call.apply(undefined, args);
                    }
                })(item);
            } else if (type == "string") {
                store[key] = (function(mutation) {
                    return function(/* store... */) {
                        var dispatch, args, _store;

                        if (arguments[0] instanceof Vuex.Store) {
                            args = $.slice(arguments, 1);
                        } else {
                            args = $.slice(arguments);
                        }

                        _store = store;
                        dispatch = _store.dispatch;
                        args.unshift(mutation);

                        return dispatch.apply(undefined, args);
                    }
                })(item);
            }
        }

        // 注册为全局的对象
        if (typeof name == "string") {
            $$.store[name] = store;
        }

        return store;
    };
})();
