module.exports = (function() {
	Vue.directive("timer", {
        bind: function() {
            var $el = $(this.el), val = this.expression, scope = this.vm;

            if (scope[val] !== undefined /* 值存在的话 */) {
                var ctrl, date, filter, handle, scroll, confirm, cancel;

                ctrl    = $el.attr("ctrl");
                date    = $el.attr("date");
                filter  = $el.attr("filter");
                scroll  = $el.attr("onScroll");
                confirm = $el.attr("onConfirm");
                cancel  = $el.attr("onCancel");

                // 不是字符串，就是绑定的对象
                if (filter && filter.search(":") == -1) {
                    filter = scope[filter];
                } else if (filter) {
                    filter = "{"+filter+"}";
                }

                handle = $.timer({
                	format: $el.attr("format"),
                	show  : $el.attr("show"),
                	text  : $el.attr("text"),

                	filter: filter,
                	min   : $el.attr("min"),
                	max   : $el.attr("max"),

                	onScroll : function(type, val, handle) {
                        var ret;    // 回调的结果

                        if ($.isFun(scope[scroll])) {
                            ret = scope[scroll](type, val);
                        }

                        return ret;
                	},

                    onConfirm : function(text, date, handle) {
                        var ret;    // 回调的结果

                        if ($.isFun(scope[confirm])) {
                            ret = scope[confirm](text, date);
                        }

                        if (ret !== false) {
                            scope[val] = text;
                            if (scope[date] !== undefined) {
                                scope[date] = date;
                            }
                        }

                        return ret;
                    },

                    onCancel  : function(text, date, handle) {
                        var ret;    // 回调的结果

                        if ($.isFun(scope[cancel])) {
                            ret = scope[cancel](text, date);
                        }

                        return ret;
                    }
                }, scope[val]);

                // 数据双向绑定
                scope.$watch(val, function(newVal) {
                    var set = $.time.date(newVal),
                        old = handle.value.getTime();

                    // 新时间和原时间不一样才更新数据
                    if (set && set.getTime() != old) {
                        handle.value = set;
                    }
                })

                $el.on("tap", function() { handle.show(); })
                if (scope[ctrl] !== undefined) scope[ctrl] = handle;
                // 初始化数据值
                scope[val] = handle.val();

                scope.$on("pageDestroyDirect", function() {
                    handle.destroy();   // 删除自身
                })
            }
        }
    })
})();
