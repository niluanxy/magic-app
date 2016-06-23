module.exports = (function() {
    require("../popup/");    // 加载依赖文件

    var Modal = function(element, options) {
        this.$el      = $(element);
        this.options  = $.extend({}, Modal.DEFAULT, options, true);
    };

    Modal.DEFAULT = {
        align    : 'bottom',
        autoHide : true,
        backShow : true,
        backClass: "back",
        itemClass: "modal",
    }

    Modal.prototype.init = function() {
        var that = this, opt = that.options, $handle, $dom, $back;

        $dom = that.$el;
        $dom.addClass(opt.itemClass);
        if (opt.align != null) $dom.addClass(opt.align);

        $handle = $.popup($dom, {insertTo: opt.insertTo});

        if (opt.backShow && opt.backClass) {
            $back = $('<div class="'+opt.backClass+'"></div>');
            $handle.$el.append($back);

            if (opt.autoHide == true) {
                $back.on("tap.modal", function(e) {
                    console.log("has run back")
                    $handle.hide();
                })
            }
        }

        $dom.on("tap.modal", function(e) {
            var $tar = $(e.target);

            if ($tar.attr("role") == "close") {
                $handle.hide();
            }

            e.stopPropagation();
        })

        return $handle;
    };

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.modal) {
        $.extend({modal: function(el, options) {
            var opt = $.extend({}, options);

            return new Modal(el, opt).init();
        }});
    };

    if ($ && $.fn && !$.fn.modal) {
        $.fn.extend({modal: function(el, options) {
            var opt = $.extend({}, options);

            opt.insertTo = this;

            return new Modal(el, opt).init();
        }});
    };
})();
