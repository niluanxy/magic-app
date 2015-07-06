require("./style.scss");

module.exports = (function() {
    var Confirm = function(el, options) {
        this.el      = $(el);
        this.isHide  = '';
        this.__modal = null;
        this.options = $.extend({}, Confirm.DEFAULT, options, true);
    };

    Confirm.DEFAULT = {
        cancel : null,
        cancelHide: true,
        confirm: null,
        confirmHide: true,
        autoHide: false,
        align: "center"
    };

    Confirm.prototype.init = function() {
        var that = this, opt = that.options, act;

        // 调用底层Modal组件来创建底层
        that.__modal = $.modal(that.el, opt);   

        that.el = that.__modal.el;

        that.el.children().addClass("confirm");
        // 尝试绑定确认动作到按钮上
        act = that.el.find("[role='confirm']");
        if (act.length > 0) {
            act.on("tap", function() {
                var ret = true;     // 初始默认返回为真
                if (typeof opt.confirm == "function") {
                    ret = opt.confirm();   // 调用确认回调
                }
                if (opt.confirmHide && ret !== false) {
                    that.hide();    // 确认动作后自动隐藏窗口
                }
            })
        }
        // 尝试绑定取消动作到按钮上
        act = that.el.find("[role='cancel']");
        if (act.length > 0) {
            act.on("tap", function(event) {
                var ret = true;     // 初始默认返回为真
                if (typeof opt.cancel == "function") {
                    ret = opt.cancel();   // 调用取消回调
                }
                if (opt.cancelHide && ret !== false) {
                    that.hide();    // 取消动作后自动隐藏窗口
                }
            })
        }

        return this;
    };

    Confirm.prototype.show = function() {
        this.__modal.show();
        return this;
    };

    Confirm.prototype.hide = function() {
        this.__modal.hide();
        return this;
    };

    Confirm.prototype.toggle = function() {
        this.__modal.toggle();
        this.isHide = this.__modal.isHide;
        
        return this;
    }

    Confirm.prototype.destroy = function() {
        this.__modal.destroy();
        return this;
    };


    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.confirm) {
        $.extend({confirm: function(element, option) {
            return new Confirm(element, option).init();
        }});
    };

    if ($ && $.fn && !$.fn.confirm) {
        $.fn.extend({confirm: function(option) {
            var opt = $.extend({}, option);
            opt.hasInsert = true;
            return new Confirm(this[0], opt).init();
        }});
    };
})();