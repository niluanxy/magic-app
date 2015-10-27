module.exports = (function() {
    $$.component("mg-expand", {
        template: "<content></content>",
        ready: function() {
            var that = this, $el = $(this.$el), central;

            central = $el.attr("central");

            $el.addClass("expand hide").on("tap", function(e) {
                e.stopPropagation();    // 阻止点击自身隐藏
            })

            $el.parent().on("tap", function() {
                var last = that[central];   // 上个点击对象

                /* 中控模式，则先隐藏上一次最后操作的组件 */
                if (last && last != $el && last.addClass) {
                    last.addClass("hide");

                    $el.removeClass("hide");
                } else {
                    $el.toggleClass("hide");    // 切换自身显示状态
                }

                if (last !== undefined) that[central] = $el;
            });
        }
    });
})();