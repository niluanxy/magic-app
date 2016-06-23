module.exports = (function() {
    var Popup = function(element, options) {
        this.$el      = $(element);
        this.$wrapper = null;
        this.isHide   = false;
        this.options  = $.extend({}, Popup.DEFAULT, options, true);
    };

    Popup.DEFAULT = {
        insertTo  : "body",

        wrapIndex : 100,
        wrapClass : "pop-wrapper",
        itemClass : "pop-item",
    }

    Popup.prototype.init = function() {
        var that = this, opt = that.options, $wrap,
            wrapCls = opt.wrapClass, itemCls = opt.itemClass,
            wrapIdx = opt.wrapIndex;

        // 尝试获得一个 wrapper 容器元素
        $dom  = $(opt.insertTo);
        $wrap = $dom.children('.'+wrapCls);
        if (!$wrap || !$wrap[0]) {
            if ($dom.tag() != "body" && $dom.css("position") == "static") {
                $dom.css("position", "relative");
            }

            $wrap = $('<div class="'+wrapCls+'" style="z-index:'+wrapIdx+';"></div>');
            $dom.append($wrap);
        }
        that.$wrapper = $wrap;

        // 尝试创建一个 item 内容元素
        that.$el.wrap('<div class="'+opt.itemClass+'"></div>');
        that.$el = that.$el.parent();
        that.$el.appendTo($wrap);

        return that;
    };

    Popup.prototype.show = function(anim) {
        var showCls = this.options.showClass;

        this.$wrapper.show();
        this.$el.show().attr("show", "true");
        this.isHide = false;

        return this;
    };

    Popup.prototype.hide = function(anim) {
        var $wrapper = this.$wrapper,
            childs   = $wrapper[0].children, show = false;

        this.$el.hide().removeAttr("show");

        for(var i=0; i<childs.length; i++) {
            if ($(childs).attr("show") == "true") {
                show = true; break;
            }
        }

        show && $wrapper.hide();

        this.isHide = true;

        return this;
    };

    Popup.prototype.toggle = function() {
        return this.isHide ? this.show(): this.hide();
    };

    Popup.prototype.destroy = function() {
        this.$el.remove();   // 删除自身
    };

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.modal) {
        $.extend({popup: function(el, options) {
            return new Popup(el, options).init();
        }});
    };

    if ($ && $.fn && !$.fn.modal) {
        $.fn.extend({popup: function(el, options) {
            var opt = $.extend({}, options);

            opt.insertTo = this;

            return new Popup(el, opt).init();
        }});
    };
})();
