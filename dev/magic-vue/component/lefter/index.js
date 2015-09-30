module.exports = (function() {
    $$.component("mg-lefter", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el), val, that = this, txt;

            val = $el.attr("runing");  // 记录倒计时是否运行，运行中为true
            txt = $el.html().replace(/\{/g, "{{")
                            .replace(/\}/g, "}}");

            $el.addClass("lefter").lefter({
                endtime: $el.attr("time"),
                space  : $el.attr("space"),
                show   : txt,
                endshow: $el.attr("show"),
                finish : function() {
                            var call = that[$el.attr("finish")];
                            if (that[val] !== undefined) that[val] = false;
                            typeof call == "function" && call();
                         },
                before : that[$el.attr("before")]
            })

            /* 初始化设置正在运行值为真 */
            if (that[val] !== undefined) that[val] = true;

            $el.removeAttr("time", null);
            $el.removeAttr("space", null);
            $el.removeAttr("runing", null);
            $el.removeAttr("end", null);
        }
    });
})();