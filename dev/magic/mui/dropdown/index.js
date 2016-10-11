module.exports = (function() {
    var Dropdown = function(el, options) {
        this.$el = $(el);
        this.$wrap = null;

        this.visible = false;
        this.value   = null;
        this.evename = "";
        this.options = $.extend({}, Dropdown.DEFAULT, options);
    }

    Dropdown.DEFAULT = {
        onSelect: null,
        onClose : null,
        template: "",
    }

    Dropdown.prototype.init = function() {
        var that = this, opt = that.options, $el = that.$el, tmp;

        that.evename = "tap.dropmenu_"+$.getRandom();
        that.refresh();                  // 初始化子元素

        $el.addClass("dropmenu");
        that.select(opt.init, true);     // 初始化默认值
        this.$wrap.css("top", $el.outerRect().height + "px");

        return this;
    }

    Dropdown.prototype.bindEvent = function() {
        var that = this, $wrap = that.$wrap, eve,
            $el = that.$el, opt = that.options;

        eve = "tap.dropmenu";

        $el.off(eve).on(eve, ".value", function() {
            that.toggle();

            if (that.visible) {
                $(document).off(that.evename).on(that.evename, function(e) {
                    var $tar = $(e.target);

                    if (!$tar.belowClass(".item", $el, true) &&
                        !$tar.belowClass(".value", $el, true)) {

                        that.hide();
                    }
                })
            }
        })

        $wrap.off(eve).on(eve, ".item", function(e) {
            var val = $(e.target).attr("val");

            that.select(val).hide();
        })
    }

    /**
     * 刷新 item Dom信息，并重新绑定方法
     */
    Dropdown.prototype.refresh = function(wrap) {
        var childs, $wrap, $old;

        $old = this.$el.find(".wrap");

        if ($old && $old[0]) {
            $wrap = $old;
        } else {
            if (wrap instanceof Element) {
                $wrap = $(wrap).addClass("wrap");
            } else {
                $wrap  = $('<div class="wrap"></div>');
            }
        }

        childs = this.$el.query(".item");
        for(var i=0; i<childs.length; i++) {
            $wrap.append(childs[i]);
        }
        $wrap.appendTo(this.$el).addClass("hide");

        this.$wrap = $wrap;
        this.bindEvent();

        return this;
    }

    /**
     * 手动选择某项值，并修改DOM信息
     *
     * @param  {String}  value   [要选定的值]
     * @param  {Boolean} disCall [是否不触发 select 方法]
     */
    Dropdown.prototype.select = function(value, disCall) {
        var items = this.$wrap.query(".item"),
            $find, $val, opt = this.options;

        $val = this.$el.find(".value");

        for(var i=0; i<items.length; i++) {
            var $now = $(items[i]);

            if ($now.attr("val") == value) {
                $find = $now;
            }
        }

        if (!$find) $find = $(items[0]);
        this.value = $find.attr("val");

        if ($val.tag() == "INPUT") {
            $val[0].value = this.value;
        } else {
            $val.remove();  // 旧元素删除
            $find = $find.clone();

            if ($find /* 解决空内容时报错 */) {
                $find.addClass("value")
                     .removeClass("item active actived");

                this.$el.insertBefore($find);
            }
        }

        // 尝试运行绑定的 select 方法
        if (!disCall && $.isFun(opt.onSelect)) {
            opt.onSelect(this.value);
        }

        return this;
    };

    Dropdown.prototype.toggle = function(show) {
        show = show === undefined ? !this.visible : !!show;
        this.$el.place(this.$wrap, "bottom", "left", {float: true});
        this.$wrap.toggleClass("hide", !show);
        this.visible = show;

        return this;
    }

    Dropdown.prototype.show = function() {
        return this.toggle(true);
    }

    Dropdown.prototype.hide = function() {
        var opt = this.options;

        // 尝试运行绑定的 close 方法
        if ($.isFun(opt.onClose)) {
            opt.onClose(this.value);
        }

        return this.toggle(false);
    }

    Dropdown.prototype.destroy = function() {
        this.$el.remove();
    }

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.dropdown) {
        $.extend({dropdown: function(el, options) {
            return new Dropdown(el, options).init();
        }});
    };

    if ($ && $.fn && !$.fn.dropdown) {
        $.fn.extend({dropdown: function(options) {
            if (!this[0]) return null;

            return new Dropdown(this[0], options).init();
        }});
    };
})();
