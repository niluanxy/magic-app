module.exports = (function() {
    var SelectMain = {
        data: {},

        key: function(str) {
            if (typeof str == "string") {
                return "_select_"+str.hashCode();
            }

            return null;
        },

        add : function(str, handle) {
            var key;
            if ((key = this.key(str)) && handle) {
                this.data[key] = handle;
            }

            return handle;
        },

        get : function(str) {
            var key;
            if (key = this.key(str)) {
                return this.data[key];
            }
            return null;
        },

        del : function(str) {
            var key, handle;
            if (key = this.key(str)) {
                handle = this.data[key];
                if (handle) handle.destroy();
                delete this.data[key];
            }
        }
    };

    $$.component("mg-select", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el), opt = {}, $bind,
                $val, $pos, val, bind, handle, mult, $call;

            mult  = !!$el.attr("multiple");
            bind  = $el.attr("bind");
            val   = $el.attr("value");
            $call = $$.objParse(this, $el.attr("call"));
            $pos  = $$.objParse(this, $el.attr("index"));
            $val  = $$.objParse(this, val);
            $bind = $$.objParse(this, bind);
            if($bind) $val = $bind; // 重置句柄

            if ($bind || $val) {
                opt.modal = $bind?true:false;
                opt.mult  = mult;
                opt.init  = $val && $val.val != undefined 
                                ? $val.val : 
                           ($pos && $pos.val != undefined 
                                ? $pos.val : null);

                opt.call = function(val, pos) {
                    if ($val) $val.val = val;
                    if ($pos) $pos.val = pos;
                    if ($call && typeof $call.val == "function") {
                        val = val || null;      // 默认重置为null
                        $call.val(val, pos);    // 运行对象回调方法
                    }
                }

                handle = $el.select(opt);   // 创建对象
                this.$watch(val||bind, function(newVal) {
                    if (handle.val() != newVal) {
                        // 同步更新组件
                        handle.set(newVal, true);
                    }
                })
                if ($val) $val.val = handle.val();
                if ($pos) $pos.val = handle.pos();
                if ((val || bind)) SelectMain.add(val||bind, handle);
            }

            this.$on("pageDestroy", function() {
                SelectMain.del(val || bind);
            })
        }
    });

    Vue.directive("select", {
        bind: function() {
            var $el = $(this.el), once = false, key = this.raw;

            $el.on("tap", function() {
                var select = SelectMain.get(key), srcoll;

                if (select /* 不为空说明有数据 */) {
                    // 切换select显示状态
                    select.toggle();
                    scroll = select.scroll;

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