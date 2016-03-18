module.exports = (function() {
    $$.component("mg-select", {
        template: "<slot></slot>",
        ready: function() {
            var scope = $$.getVm(this), $el = $(this.$el), bind,
                opt = {}, val, pos, show, call, handle;

            pos  = $el.attr("pos")
            show = $el.attr("text");
            val  = $el.attr("val");
            call = $el.attr("call");

            opt.mult = !!$el.attr("multiple");
            opt.init = pos && scope[pos] ? scope[pos] : -1;

            opt.call = function(newVal, newPos, newText) {
                if (scope[val]  !== undefined) scope[val]  = newVal;
                if (scope[pos]  !== undefined) scope[pos]  = newPos;
                if (scope[show] !== undefined) scope[show] = newText;

                if ($.isFun(scope[call]) /* 运行对象回调方法 */) {
                    scope[call](newVal, newPos, newText);
                }
            }

            handle = $el.select(opt);   // 创建对象

            if (val && scope[val] !== undefined) {
                scope.$watch(val, function(newVal) {
                    if (handle.val() != newVal) {
                        // 同步更新组件
                        handle.set(newVal, true);
                    }
                })
            }

            scope.$on("pageDestroy", function() {
                handle.destroy();
            })
        }
    });

    Vue.directive("select", {
        bind: function() {
            var $el = $(this.el), key = this.raw, ctrl,
                data = $el.attr("data"), scope = this.vm;

            if (scope[data] !== undefined /* 值存在的话 */) {
                var tval, pos, text, mult, call, handle, show;

                pos  = $el.attr("pos");
                show = $el.attr("text");
                tval = $el.attr("key-val");
                text = $el.attr("key-text");
                mult = $el.attr("multiple");
                call = $el.attr("call");
                ctrl = $el.attr("handle");

                handle = $.select(scope[data] || [], {
                    text : text, val : tval, mult: mult,
                    modal: true, call: function(newVal, newPos, newText) {
                        if (scope[key]  !== undefined) scope[key]  = newVal;
                        if (scope[pos]  !== undefined) scope[pos]  = newPos;
                        if (scope[show] !== undefined) scope[show] = newText;

                        if ($.isFun(scope[call])) {
                            scope[call](newVal, newPos, newText);
                        }
                    }
                })

                /* 同步更新数据 */
                scope.$watch(data, function(newVal) {
                    handle.render(newVal);
                })

                /* 有handle属性则不绑定点击方法 */
                if (scope[ctrl] !== undefined) {
                    scope[ctrl] = handle;
                } else {
                    $el.on("tap", function() { handle.show(); })
                }

                scope.$on("pageDestroy", function() {
                    handle.destroy();   // 删除自身
                })
            }
        }
    })
})();