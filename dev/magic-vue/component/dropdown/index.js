module.exports = (function() {
    $$.component("mg-dropdown", {
        template: "<slot></slot>",
        ready: function() {
            var $el = $(this.$el), scope = $$.getVm(this),
                handle, ctrl, value, onSelect, onClose, data;

            value = $el.attr("value");

            if (scope[value] === undefined) return;

            data     = $el.attr("data");
            ctrl     = $el.attr("ctrl");
            onSelect = scope[$el.attr("onSelect")];
            onClose  = scope[$el.attr("onClose")];

            handle = $el.dropdown({
                init: scope[value],

                onSelect: function(newVal) {
                    if ($.isFun(onSelect)) {
                        onSelect(newVal);
                    }

                    if (scope[value] != newVal) {
                        scope[value] = newVal;
                    }
                },

                onClose: function(newVal) {
                    if ($.isFun(onClose)) {
                        onClose(newVal);
                    }
                }
            });

            // 数据双向绑定功能
            scope.$watch(value, function(newVal) {
                if (newVal != handle.value) {
                    handle.select(newVal);
                }
            })

            // 监控列表数据，刷新后更新内容
            if (scope[data] !== undefined) {
                scope.$watch(data, function() {
                    var old = handle.value;
                    handle.refresh().select(old);
                })
            }

            if (scope[ctrl] !== undefined) scope[ctrl] = handle;
        }
    });
})();
