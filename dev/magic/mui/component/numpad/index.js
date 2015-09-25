require("./style.scss");

module.exports = (function() {
    var Numpad = function(element, option) {
        this.el      = $(element);
        this.bind    = null;
        this.value   = "";
        this.modal   = null;
        this.option  = $.extend({}, Numpad.DEFAULT, option, true);
    };

    Numpad.DEFAULT = {
        type  : "common",           // 键盘类型 (common,number,float)
        filter: null,               // 过滤器，可以有多个(数组)
        cancel: null,               // 取消时的回掉方法
        ok    : null,               // 确认输入时的回掉方法
        input : null,               // 成功输入后的回掉（被过滤器过滤掉则视为失败输入）
        click : null                // 点击后的回掉方法
    }

    Numpad.prototype.init = function() {
        var html = require("./template.html"), that = this;

        that.modal = $(html).modal({hasInsert: false});
        that.el    = that.modal.el.find(".numpad");

        return this;
    }

    Numpad.prototype.show = function() {
        this.modal.show();

        return this;
    }

    Numpad.prototype.hide = function() {
        this.modal.hide();

        return this;
    }

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.numpad) {
        $.extend({numpad: function(element, option) {
            return new Numpad(element, option).init();
        }});
    };

    if ($ && $.fn && !$.fn.numpad) {
        $.fn.extend({numpad: function(option) {
            var opt = $.extend({}, option);
            if (opt.hasInsert === undefined) {
                opt.hasInsert = true;
            }
            return new Numpad(this[0], opt).init();
        }});
    };
})();