module.exports = (function() {
    $$.component("mg-lefter", {
        template: "<slot></slot>",
        ready: function() {
            var $el = $(this.$el), scope = $$.getVm(this),
                txt, end, val, option, onFinish, onBefore;

            // 记录倒计时是否运行，运行中为 true
            val = $el.attr("runing");
            txt = $el.html().replace(/\{/g, "{{")
                            .replace(/\}/g, "}}");
            end = $el.attr("time");

            onFinish = $el.attr("onFinish");
            onBefore = $el.attr("onBefore");

            option = {
                space  : $el.attr("space"),
                show   : txt,
                endshow: $el.attr("end"),
                finish : function() {
                            var call = scope[onFinish];
                            if (scope[val] !== undefined) scope[val] = false;
                            typeof call == "function" && call();
                         },
                before : scope[onBefore]
            }

            if (!parseInt(end)) {
                scope.$watch(end, function(val) {
                    option.endtime = val
                    $el.lefter(option);
                });
            } else {
                option.endtime = end;
                $el.lefter(option);
            }

            /* 初始化设置正在运行值 */
            if (scope[val] !== undefined) {
                if ($.getTime() > end*1000) {
                    scope[val] = false;
                } else {
                    scope[val] = true;
                }
            }

            $el.removeAttr(["time", "space", "runing", "end"]);
        }
    });
})();