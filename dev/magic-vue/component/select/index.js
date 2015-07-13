require("./style.scss");

module.exports = (function() {
    var SelectArray = {};   // 用于管理所有的 select 组件

    // 用于切换 item 的状态，并返回当前选中的项目
    function toggleSelect(items, init) {
        var $that, $icon, cls, ret, val;

        for(var i=0; i<items.length; i++) {
            $that = $(items[i]);
            $icon = $that.find("[toggle]");
            cls   = $icon.length?$$.parseJSON($icon.attr("toggle")):{};

            val = $that.attr("val");
            if (i == init || val == init) {
                // 用下标初始化，则返回值，否则返回下标
                if (parseInt(init) !== NaN) ret = val;
                else ret = i;

                init = null; // 设置为空，防止后续初始化

                $that.addClass("select")
                if ($icon) {
                    $icon.addClass(cls.on||'');
                    $icon.removeClass(cls.off||'');
                }
            } else {
                $that.removeClass("select")
                if ($icon) {
                    $icon.removeClass(cls.on||'');
                    $icon.addClass(cls.off||'');
                }
            }
        }

        return ret;
    }

    // 通过创建一个唯一的字符串来连接组件
    function makeBind(str) {
        return "_select_"+str.hashCode();
    }

    Vue.component("mg-select", {
        template: "<div class='mg-scroll'><div class='list list-embed'><content></content></div></div>",
        replace: false,
        inherit: true,
        ready: function() {
            var $el = $(this.$el), vmod, index,
                bind, $bind, handle, key, ret;

            vmod  = $$.objParse(this, $el.attr("value"));
            index = $$.objParse(this, $el.attr("index"));
            bind  = $el.attr("bind");
            $bind = $$.objParse(this, bind);

            $el.addClass("mg-select");

            if ($bind /* 采用 bind 方式说明是弹框select */) {
                $el.addClass("modal hideOut")
                   .children().addClass("modal_body");

                vmod = $$.objParse(this, $el.attr("bind"));
                key = makeBind(bind);   // 创建唯一的key

                SelectArray[key] = {
                    modal : $el.modal(),
                    scroll: $el.children().scroll()
                };
            }

            $el.on("tap", function(e) {
                var items = $el.query("item"),
                    $sel  = $(e._target),
                    pos   = $sel.index(), show;

                ret = toggleSelect(items, pos);
                if (vmod) vmod.val = ret;
                if (index) index.val = pos;

                show = SelectArray[key];
                if (show && show.modal) {
                    show.modal.hide();
                }
            })

            // 初始化默认选择项，可以用下标或者 val 值
            ret = toggleSelect($el.query("item"), vmod && vmod.val);
            if (vmod && parseInt(vmod.val) !== NaN) {
                vmod.val = ret; // 数字初始化时，修正为具体值
            }
        }
    });

    Vue.directive("select", {
        bind: function() {
            var key = makeBind(this.raw),
                $el = $(this.el), once = false;

            $el.on("tap", function() {
                var handle = SelectArray[key], modal, scroll;

                if (handle /* 不为空说明有数据 */) {
                    modal  = handle.modal;
                    scroll = handle.scroll;

                    modal.toggle(); // 切换select显示状态

                    if (!once /* 没初始化过则初始化 */) {
                        $(scroll.wrapper).render(function() {
                            scroll.refresh();
                            once = false;   // 刷新滚动组件
                        })
                    }

                    // 每次打开的时候，都滚动到选中的项目处
                    $(scroll.wrapper).render(function() {
                        scroll.scrollToElement(".item.select");
                    })
                }
            })
        }
    })
})();