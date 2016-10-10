module.exports = (function() {
    var $$ = window.mvue;

    /**
     * 根据参数判断是否需要渲染 header 部分
     *
     * 先根据 页面 实例配置信息判断，没找到则尝试
     * 根据 全局 配置信息判断，默认为 true 显示
     */
    $$.needHeader = function(match) {
        var $config = $$.config.common,
            item = match.item, value;

        value = item.loadHead !== undefined ? item.loadHead :
                ($config.loadHead !== undefined ? $config.loadHead : undefined);

        if (value !== undefined) {
            if (value === false) {
                return false;
            } else if ($.isFun(value)) {
                return value();
            } else {
                return true;
            }
        } else {
            return true;    // 默认显示 header 部分
        }
    };

    // 检测对象当前是否运行在页面层级
    $$.isRunPage = function(scope) {
        var $tpar = $(scope.$el).parent().parent();

        return $tpar.tag() == "mg-view";
    }

    /**
     * 手动调用 VM对象 的绑定方法
     */
    $$.vmCall = function(scope, evename) {
        var mixins = scope.$options.mixins, arrs;

        for(var i=0; i<mixins.length; i++) {
            for(var key in mixins[i]) {
                if (key == evename) {
                    mixins[i][key].apply(scope);
                }
            }
        }

        // 尝试运行自定义的相关方法
        scope.$emit("hook:"+evename);
    }

    // 获取当前组件的 vm 实例
    $$.getVm = function(vm) {
        var parent = vm, name, ret;

        do {
            name = parent.$options.name;

            if (name.match(/^ma\-/)) {
                ret = parent; break;
            } else {
                parent = parent.$parent;
            }
        } while(parent)

        return ret ? ret : vm;
    };

    // 获取当前组件的 根 page 组件
    $$.getVmRoot = function(vm) {
        return vm.$root.$children[0];
    }

    // 将给定对象添加到指定对象的事件链中
    $$.bindEvent = function(scope, child) {
        var eves = child._events || [],
            pass = "hook:".split(' '),
            bind = scope._eventsCount;

        for(var key in eves) {
            // 忽略掉列表中不监控的方法
            if (pass.indexOf(key) != 0) {
                bind[key] = bind[key] ? bind[key]++ : 1;
            }
        }

        scope.$children.push(child);
    }
})();
