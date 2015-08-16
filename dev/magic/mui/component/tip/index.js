require("./style.scss");

module.exports = (function() {
    var Tip = function(text, options) {
        this.text        = text || '';
        this.handle      = null;
        this.textHandle  = null;
        this.backHandle  = null;
        this.spinHandle  = null;
        this.backStyle   = "";

        this.delayHandle = null;
        this.hideHandle  = null;
        this.options = $.extend({}, Tip.DEFAULT, options, true);
    }

    Tip.DEFAULT = {
        type     : 'toast',
        back     : false,
        shortTime: 300,            // 默认设置的两个时间
        longTime : 800,
        show     : 1400,           // 默认显示时间
        live     : false,          // 是否永久显示
        delay    : 0               // 默认延迟显示时间
    }

    // 转换字符串为具体的时间值
    Tip.fixTime = function (opt, key) {
        if (typeof opt[key] == "string") {
            var key = opt.delay + "Time",
                def = Tip.DEFAULT[key];

            opt[key] = def ? def : opt[key];
        }
        opt[key] = parseInt(opt[key]) || 0;
    }

    // 清楚对象上的延时操作
    Tip.clearHandle = function(obj) {
        clearTimeout(obj.delayHandle);
        clearTimeout(obj.hideHandle);
    }

    Tip.prototype.init = function() {
        var opt = this.options, html, cls;
        cls  = "tip_"+$.getRandom();
        html = "<div class='tip hide has-back' id='"+cls+"'>"
                + "<div class='tip-show'>"+this.text+"</div>"
                + "<div class='tip-back'></div></div>";

        $("body").append(html);     // 添加到页面中
        this.handle = $("#"+cls);
        this.textHandle = this.handle.find(".tip-show");
        this.backHandle = this.handle.find(".tip-back");

        if (opt.type == "loading") {
            opt.live = true; // loading 类型一直显示
        }
        $("#"+cls).on("tap", function(e) {
            e.preventDefault();     // 终止默认动作
        })


        // 将默认背景色存储下来，用于后续显示默认背景色
        this.backStyle = this.backHandle.css("background-color");

        return this;
    };

    
    Tip.prototype.show = function(text, option) {
        var opt, that = this;   // 定义局部变量

        // 尝试当只有一个参数且为对象时修正参数
        if (option === undefined && typeof text == 'object') {
            option = text;  text = undefined;       // 修正变量
        }

        opt = $.extend({}, that.options, option, true);   // 合并选项

        Tip.fixTime(opt, "delay");      // 转换延时时间值
        Tip.fixTime(opt, "show");       // 转换显示时间值
        Tip.clearHandle(this);          // 清除可能的延时动作

        this.delayHandle = setTimeout(function() {
            if (opt.back !== false /* 是否显示背景 */) {
                if (typeof opt.back == "string") {
                    that.backHandle.css("background-color", opt.back)
                } else {
                    this.backHandle.css("background-color", that.backStyle);
                }
                
                that.handle.addClass("has-back");
            } else {
                that.handle.removeClass("has-back");
            }

            that.handle.toggleClass("has-loading", opt.type == 'loading');
            if (typeof text == "string") that.textHandle.html(text);
            if (that.options.type == "loading") {
                that.spinHandle = that.textHandle.spinner({
                    color: "#FFF"
                });
            }
            that.handle.removeClass("hide").addClass("show");
        }, opt.delay);

        if (!opt.live && opt.show > 0) {
            that.hideHandle = setTimeout(function() {
                that.hide();
            }, opt.delay + opt.show);
        }

        return this;
    };

    Tip.prototype.hide = function() {
        Tip.clearHandle(this);          // 清除可能的延时动作
        this.handle.removeClass("show").addClass("hide");
        if (this.options.type == "loading") {
            var span = this.spinHandle;
            span && span.stop();
        }

        return this;
    };

    Tip.prototype.destroy = function() {
        this.handle.remove();
        if (this.options.type == "loading") {
            var span = this.spinHandle;
            span && span.stop();
        }
    };

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.tip) {
        $.extend({tip: function(text, option) {
            return new Tip(text, option).init();
        }})

        /* 绑定快捷UI操作方法 */
        var $tip = new Tip("").init();
        $u.tip = function (text, option) {
            $tip.show(text, option);
        }

        $u.tipHide = function () {
            $tip.hide();
        }
    };
})();