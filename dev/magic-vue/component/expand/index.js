module.exports = (function() {
    $$.component("mg-expand", {
        template: "<slot></slot>",
        ready: function() {
            var scope, $el = $(this.$el), central;

            scope = $$._getPage(this);
            central = $el.attr("central");

            $el.addClass("expand hide").on("tap", function(e) {
                e.stopPropagation();    // 阻止点击自身隐藏
            })

            $el.parent().on("tap", function() {
                var last = scope[central];   // 上个点击对象

                /* 中控模式，则先隐藏上一次最后操作的组件 */
                if (last && last != $el && last.addClass) {
                    last.addClass("hide");

                    $el.removeClass("hide");
                } else {
                    $el.toggleClass("hide");    // 切换自身显示状态
                }

                if (last !== undefined) scope[central] = $el;
            });
        }
    });
})();