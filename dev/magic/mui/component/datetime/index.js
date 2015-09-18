require("./style.scss");

module.exports = (function() {
    var Timer = function(time, option) {
        this.value = "";                // 存放当前选择时间结果
        this.options = $.extend({}, Modal.DEFAULT, option, true);
    };

    Timer.DEFAULT = {
        type  : "mobile",               // 现实模式，移动/桌面
        show  : "MD-hm",                // 需要现实的UI模块
        text  : "Y-M-D h:m",            // 选择框中提示文字的模板
        format: "Y-M-D h:m",            // 最终输出的内容的模板
        filter: "",                     // 数据项过滤器，负数反选，正数正选，~区间

        min   : '',                     // 最小选择时间，默认为现在前五年
        max   : '',                     // 最大选择时间，默认为现在后五年
    }

    Timer.prototype.init = function() {
        var mid  = "modal_"+$.getRandom(), html,
            that = this, opt = that.option;

        if (opt.hasInsert /* 已插入页面直接处理 */) {
            that.el.attr("id", mid);
            that.el.addClass("hideOut")
                .removeClass("hide");
        } else {
            html = "<div class='modal hideOut' id='"+mid+"'></div>";
            that.el.addClass("modal_body")
                .removeClass("hide")
                .wrap(html);
            that.el = that.el.parent();
            $("body").append(that.el);     // 添加到页面中
        }

        that.el.addClass("align"+opt.align.toUpFirst());

        if (opt.autoHide /* 绑定默认关闭方法 */) {
            var that = this, ele = this.el[0];
            that.el.on("tap", function(e) {
                e.stopPropagation(); // 阻止冒泡
                if (e.target == ele) that.hide();
            })
        } else {
            that.el.on("tap", function(e) {
                e.stopPropagation(); // 阻止冒泡
            })
        }

        if (that.el.hasClass("hideOut")) {
            that.isHide = true; // 设置隐藏状态
        }

        return this;
    };

    Timer.prototype.show = function(anim) {
        var scroll = this.el.data("ui_scroll");
        if (scroll) scroll.scrollTo(0, 0);

        this.isHide = false;
        this.el.removeClass("hideOut").addClass("showIn");

        return this;
    };

    Timer.prototype.hide = function(anim) {
        this.isHide = true;
        this.el.removeClass("showIn").addClass("hideOut");
        return this;
    };

    Timer.prototype.set = function() {
        return this.isHide ? this.show(): this.hide();
    };

    Timer.prototype.get = function() {
        return this.isHide ? this.show(): this.hide();
    };

    Timer.prototype.destroy = function() {
        this.el.remove();   // 删除自身
    };

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.modal) {
        $.extend({date: function(element, option) {
            return new Modal(element, option).init();
        }});
    };

    if ($ && $.fn && !$.fn.modal) {
        $.fn.extend({modal: function(option) {
            var opt = $.extend({}, option);
            if (opt.hasInsert === undefined) {
                opt.hasInsert = true;
            }
            return new Modal(this[0], opt).init();
        }});
    };
})();