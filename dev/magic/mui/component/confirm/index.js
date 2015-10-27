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

        that.el.on("tap", function(e) {
            var role = $(e.target).attr("role"), ret;

            if (role == "confirm") {
                if (typeof opt.confirm == "function") {
                    ret = opt.confirm();   // 调用确认回调
                }
            } else if (role == "cancel") {
                if (typeof opt.cancel == "function") {
                    ret = opt.cancel();   // 调用取消回调
                }
            }

            if (role && ret !== false) that.hide();
        })

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