module.exports = (function() {
    $$.component("mg-lefter", {
        template: "<slot></slot>",
        ready: function() {
            var $el = $(this.$el), val, scope = $$._getPage(this), txt, end;

            val = $el.attr("runing");  // 记录倒计时是否运行，运行中为true
            txt = $el.html().replace(/\{/g, "{{")
                            .replace(/\}/g, "}}");
            end = $el.attr("time");

            $el.addClass("lefter").lefter({
                endtime: end,
                space  : $el.attr("space"),
                show   : txt,
                endshow: $el.attr("end"),
                finish : function() {
                            var call = scope[$el.attr("finish")];
                            if (scope[val] !== undefined) scope[val] = false;
                            typeof call == "function" && call();
                         },
                before : scope[$el.attr("before")]
            })

            /* 初始化设置正在运行值 */
            if (scope[val] !== undefined) {
                if ($.getTime() > end*1000) {
                    scope[val] = false;
                } else {
                    scope[val] = true;
                }
            }

            $el.removeAttr("time", null);
            $el.removeAttr("space", null);
            $el.removeAttr("runing", null);
            $el.removeAttr("end", null);
        }
    });
})();