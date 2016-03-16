module.exports = (function() {
    var Modal = function(element, option) {
        this.$el      = $(element);
        this.$wrapper = null;
        this.isHide   = false;
        this.option   = $.extend({}, Modal.DEFAULT, option, true);
    };

    Modal.CONFIG = {
        zindex: 100,
        wrapClass : require("./style.css").modal_wrapper,
        itemClass : "modal-item",
    }

    Modal.DEFAULT = {
        wrap      : true,
        align     : 'bottom',
        insert    : document.body,
        autoHide  : true,
        background: false,
    }

    Modal.checkWrapper = function(el) {
        var wrapper = $(el).find('.'+Modal.CONFIG.wrapClass);

        return wrapper[0] ? wrapper : null;
    }

    Modal.createWrapper = function(el, zindex) {
        var $el = $(el), CONFIG = Modal.CONFIG,
            zindex = zindex || CONFIG.zindex;

        if (!Modal.checkWrapper(el)) {
            if ($el[0] !== document.body && $el.css("position") == "static") {
                $el.css("position", "relative");
            }

            $el.append('<div class="'+CONFIG.wrapClass
                +'" style="z-index:'+zindex+';"></div>');
        }

        return Modal.checkWrapper(el);
    }

    Modal.createItem = function(wrap, el, hasBack) {
        var cls = Modal.CONFIG.itemClass, $el = $(el);

        $el.wrap('<div class="'+cls+'"></div>').addClass("modal");

        if (!!hasBack) {
            $el.parent().append('<div class="back"></div>');
        }

        return $el.parent();
    }

    Modal.prototype.init = function() {
        var that = this, opt = that.option, $dom;

        that.$wrapper = Modal.createWrapper(opt.insert);
        that.$el = Modal.createItem(opt.wrap, that.$el, opt.background);

        $dom = that.$el.children(".modal");

        if (opt.align != 'null' && opt.align != null) {
            $dom.addClass(opt.align);
        }

        that.$wrapper.append(that.$el);

        return that;
    };

    Modal.prototype.show = function(anim) {
        this.$wrapper.addClass("show");
        this.$el.addClass("show");
        this.isHide = false;

        return this;
    };

    Modal.prototype.hide = function(anim) {
        var cls = Modal.CONFIG.itemClass,
            $wrapper = this.$wrapper;

        this.$el.removeClass("show");

        if ($wrapper.find('.'+cls+'.show').length < 0) {
            $wrapper.removeClass("show");
        }

        this.isHide = true;

        return this;
    };

    Modal.prototype.toggle = function() {
        return this.isHide ? this.show(): this.hide();
    };

    Modal.prototype.destroy = function() {
        this.$el.remove();   // 删除自身
    };

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.modal) {
        $.extend({modal: Modal});
    };

    if ($ && $.fn && !$.fn.modal) {
        $.fn.extend({modal: function(el, option) {
            var opt = $.extend({}, option);

            opt.insert = this;

            return new Modal(el, opt).init();
        }});
    };
})();