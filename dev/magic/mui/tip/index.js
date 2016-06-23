module.exports = (function() {
    var Tip = function(text, options) {
        this.$el     = null;
        this.$back   = null;

        this.text    = text || '';
        this.delay   = null;
        this.options = $.extend({}, Tip.DEFAULT, options, true);
    }

    Tip.DEFAULT = {
        icon  : "",             // 图标类型
        show  : 1400,           // 默认显示时间
        live  : false,          // 是否永久显示
        modal : false,          // 是否模态方式
        delay : 0,              // 默认延迟显示时间

        insertTo : "body",      // 插入到那个元素
        wrapClass: "tip",       // 最外层的类名
        textClass: "text",      // 显示内容的类名
        iconClass: "icon",      // 图标元素的类名
    }

    // 创建元素内容区域 DOM
    Tip.make = function(text, icon, opt) {
        var $html = $('<div class="'+opt.wrapClass+'"></div>');
        $html.append('<span class="'+opt.textClass+'">'+text+'</span>');
        if (icon) $html.insertBefore('<i class="'+opt.iconClass+' '+icon+'"></i>');

        return $html;
    };

    Tip.prototype.init = function() {
        var that = this, opt = this.options, $dom, handle, $back;

        $dom   = Tip.make(that.text, opt.icon, opt);
        $back  = $('<div class="back"></div>');
        handle = $.popup($dom, {insertTo: opt.insertTo});

        handle.$el.append($dom).append($back);

        this.$el   = $dom;
        this.$back = $back;
        this.$el._POPUP_ = handle;

        return this;
    };

    Tip.prototype.show = function(text, icon, option) {
        var that = this, handle = that.$el._POPUP_, txt, opt;

        if (icon && typeof icon != "string" && !option) {
            option = icon; icon = null;
        }
        opt = $.extend({}, that.options, option || {}, true);

        txt  = text || that.text;
        icon = icon || that.options.icon;

        that.$el.html(Tip.make(txt, icon, opt).html());
        opt.modal ? that.$back.show() : that.$back.hide();

        clearTimeout(that.delay);
        that.delay = setTimeout(function() {
            handle.show();

            if (!opt.live) {
                that.delay = setTimeout(function() {
                    handle.hide();
                }, opt.show);
            }
        }, opt.delay || 0);

        return this;
    };

    Tip.prototype.hide = function(delay) {
        var handle = this.$el._POPUP_;

        clearTimeout(this.delay);
        this.delay = setTimeout(function() {
            handle.hide();
        }, delay || 0);

        return this;
    };

    Tip.prototype.destroy = function() {
        this.$el._POPUP_.destroy();
        clearTimeout(this.delay);
    };

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.tip) {
        $.extend({tip: function(text, option) {
            return new Tip(text, option).init();
        }})
    };
})();
