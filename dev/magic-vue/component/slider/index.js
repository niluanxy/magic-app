module.exports = (function() {
    $$.component("mg-slider", {
        template: "<slot></slot>",

        ready: function() {
            var $el = $(this.$el), handle, $slider, scope, list;

            scope = $$.getVm(this);
            list  = $el.attr("list");

            $slider = $el.addClass("slider").slider({
                time     : $el.attr("time"),
                autoPlay : $el.attr("autoPlay"),
                describe : $el.attr("describe"),
                indicator: $el.attr("indicator"),
                scale    : $el.attr("scale"),
                enter    : scope[$el.attr("enter")],
                leave    : scope[$el.attr("leave")]
            });

            handle = $el.attr("ctrl");
            if (handle && scope[handle] !== undefined) {
                scope[handle] = $slider;
            }

            // 如果有 list 选项，则自动监控变化刷新
            if (scope[list] !== undefined) {
                scope.$watch(list, function(newVal) {
                    $slider.init();
                })
            }

            $el.removeAttr(["ctrl", "list"]);
        }
    })
})();