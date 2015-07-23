require("./style.scss");

module.exports = (function() {
    var Select = function(el, opt) {
        this.el      = $(el);
        this.rets    = {};
        this.handle  = null;
        this.scroll  = null;
        this.options = $.extend({}, Select.DEFAULT, opt, true);
    }

    Select.DEFAULT = {
        init : null,    // 初始化的对象
        call : null,    // 每次选择后回调
        mult : false,   // 多选模式
        modal: false    // 是否弹框模式
    }

    Select.prototype.init = function(init) {
        var that = this, opt = that.options, item, rets;

        rets = that.rets;           // 设置存放结果的对象

        item = that.el[0].childNodes;
        that.el.addClass("list select");   // 设置样式
        for(var i=0; i<item.length; i++) {
            if (item[i].nodeType !== 1) continue;

            $(item[i]).addClass("item");
        }

        if (opt.modal /* 初始化滚动和弹框效果 */) {
            that.el.wrapAll("<div class='item_body list'></div>")
                   .removeClass("hide")
                   .removeClass("list");
            that.handle = that.el.modal({hasInsert: false});
            that.scroll = that.el.scroll();
        }

        if (opt.mult) rets = {val:[], pos:[]};
        that.set(opt.init !== undefined ? opt.init : null); // 初始化

        that.el.on("tap", function(e) {
            var pos = $(e._target).index();

            if (pos != -1) {
                if (opt.mult /* 多选模式 */) {
                    if (rets.pos.findIn(pos)) {
                        rets.pos.delBy(pos);
                    } else {
                        rets.pos.push(pos);
                    }
                } else {
                    rets.pos = pos;
                }
            }
            
            that.set(rets.pos, false);
            if (typeof opt.call == "function") {
                var val = that.rets.val,
                    pos = that.rets.pos;
                opt.call.call(that, val, pos);
            }

            if (!opt.mult) that.hide(); // 隐藏弹框
        })

        return this;
    };

    Select.prototype.set = function(sets, cval) {
        var item, $icon, $item, val, 
            cls, select, mult, opt, rets;

        opt  = this.options; 
        mult = opt.mult;
        item = this.el.query(".item");
        // 如果是多选状态，则各自返回的数据都是一个数组
        rets = mult ? {val:[], pos: []} : {};
        sets = mult && !Array.isArray(sets) ? [] : sets;
        cval = cval !== undefined ? cval :
                    (sets == null ? true :
                        (mult?isNaN(sets[0]):isNaN(sets))
                    );

        for(var i=0; i<item.length; i++) {
            if (item[i].nodeType !== 1) continue;

            $item = $(item[i]);
            $icon = $item.find("[toggle]");
            cls   = $icon.length?$.parseJSON($icon.attr("toggle")):{};

            val = $item.attr("val");
            select = false; // 当前选中假

            if (mult /* 多选模式 */) {
                if ((cval && sets.findIn(val)) ||
                    sets.findIn(i)) {
                    select = true;
                }
            } else {
                if ((cval && val == sets) || i == sets) {
                    select = true;
                    sets = null;    // 后面不在选择
                }
            }

            if (select /* 当前选中状态 */) {
                if (mult /* 多选状态设置返回值 */) {
                    rets.val.push(val);
                    rets.pos.push(i);
                } else {
                    rets.val = val;
                    rets.pos = i;
                }
            }

            if ($icon.length > 0) {
                $icon.switchClass(cls, select);
            }
        }

        this.rets = rets;   // 更新存储的值
        return this;
    }

    Select.prototype.val = function() {
        return this.rets.val;
    };

    Select.prototype.pos = function(index) {
        return this.rets.pos;
    };

    Select.prototype.show = function() {
        if (this.handle) {
            this.handle.show();
        }

        return this;
    }

    Select.prototype.hide = function() {
        if (this.handle) {
            this.handle.hide();
        }
    };

    Select.prototype.toggle = function() {
        if (this.handle) {
            if (this.handle.isHide) {
                this.handle.show();
            } else {
                this.handle.hide();
            }
        }

        return this;
    }

    Select.prototype.destroy = function() {
        this.el.remove();
        if (this.options.modal) {
            this.handle.el.remove();
            this.handle  = null;
            this.scroll  = null;
        }
        this.item    = null;
        this.rets    = null;
        
        this.options = null;
    }

    if ($ && $.fn && !$.fn.select) {
        $.fn.extend({select: function(opt) {
            opt = $.extend({}, opt);
            if (opt.mult === undefined) {
                opt.mult = !!this.attr("multiple");
            }
            if (opt.init === undefined) {
                opt.init = this.attr("init");
            }
            return new Select(this[0], opt).init(opt.init);
        }})
    };
})();