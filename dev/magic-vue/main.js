module.exports = (function() {
    var Event = function() {
        this.eveData = {};
    }

    /* 返回命名空间的指定位置 */
    function getfix(name, last) {
        var left, right;

        right = name.match(/\.+.*$/);
        right = right?right[0]:"";
        left  = name.replace(right, "");

        return last?right.replace(".", ""):left;
    }

    function argsfix(args, start, end) {
        var copy = [], end = args.length-1;

        for(var i=start; i<=end; i++) {
            copy.push(args[i]);
        }

        return copy;
    }

    Event.prototype.on = function(name, callback) {
        var data = this.eveData, pre = getfix(name);

        if (!data[pre]) data[pre] = [];

        data[pre].push({ name: name, call: callback })
    }

    Event.prototype.off = function(name) {
        var pre = getfix(name), data = this.eveData[pre];

        if (!data || data.length <= 0) return;

        for(var i=0; i<data.length; i++) {
            if (data[i].name.search(name) == 0) {
                data.splice(i--, 1);
            }
        }

        if (data.length == 0) delete this.eveData[pre];
    }

    Event.prototype.emit = function(name /* args... */) {
        var pre = getfix(name), copy,
            args = argsfix(arguments, 1),
            data = this.eveData[pre];

        if (!data || data.length <= 0) return;

        // 防止 once 方法执行报错
        copy = data.slice(0);

        for(var i=0; i<copy.length; i++) {
            if (copy[i].name.search(name) == 0) {
                copy[i].call.apply(null, args);
            }
        }
    }

    Event.prototype.once = function(name, callback) {
        var fixs = name+".once_"+(''+Math.random()).replace(/\D/g, ''),
            that = this;

        this.on(fixs, function() {
            callback.apply(this, arguments);
            that.off(fixs);
        })
    }

    var $$, eveBus = new Event();

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
        eveBus.on.apply(eveBus, arguments);
    }

    $$.emit = function(eveName) {
        eveBus.emit.apply(eveBus, arguments);
    }

    $$.off = function(eveName, callBack) {
        eveBus.off.apply(eveBus, arguments);
    }

    $$.once = function(eveName, call) {
        eveBus.once.apply(eveBus, arguments);
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

    // 暴漏出 native 调用接口对象
    if (window.MgNative && MgNative.core) {
        $$.ncore = {
            pageCacheRun : true,    // 页面是否缓存没运行任何方法
        };  // 声明快捷增强方法
        var webBind = MgNative.webBind,
            $native = MgNative.core;

        // 通知原生框架，当前H5页面已经加载完成
        $$.emitViewReady = function(removeFix) {
            $$.ncore.pageCacheRun = false;

            var fire = $$.location.fire(),
                $cache = $$._CACHE_, mitem;

            // 主要解决初次加载页面闪烁问题
            if (!MgNative.webShow) {
                $$.delayHideOld();
            } else {
                // 当前激活的页面DOM 显示出来
                if (removeFix == true) {
                    mitem = fire[fire.length-1].item;
                    for(var i=0; i<$cache.length; i++) {
                        if ($cache[i].item == mitem) {
                            $cache[i].$wrap.removeClass("hide");
                        }
                    }
                }
            }

            $$.ncore.setHeader(false);
            $native.emitViewReady({bindId: webBind});
        }

        $$.delayHideOld = function(time) {
            time = parseInt(time) || 500;
            $$.ncore.delayHide = setTimeout(function() {
                for(var i=0; i<$$._CACHE_.length; i++) {
                    $$._CACHE_[i].$wrap.addClass("hide");
                }

                $native.clearExtButton({bindId: webBind});
            }, time);
        }

        // 设置原生容器的 header 的标题内容
        $$.ncore.setTitle = function(title) {
            $native.setWebTitle({
                bindId: webBind,
                title: title || ""
            })
        }

        // 设置原生容器的 header 是否显示
        $$.ncore.setHeader = function(show) {
            $native.setWebHeader({
                bindId: webBind, display: !!show
            })
        }

        $$.ncore.setExtButton = function(name, call) {
            if (!name || !call) return;

            $native.setExtButton({
                bindId: webBind,
                name: name, action: call
            })
        }
    } 

    return window.$$ = $$;
})();
