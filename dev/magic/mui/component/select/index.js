require("./style.css");

module.exports = (function() {
    var Select = function(item, opt) {
        this.el      = item;
        this.rets    = {val: null, pos: null};
        this.data    = null,
        this.handle  = null;
        this.scroll  = null;
        this.options = $.extend({}, Select.DEFAULT, opt, true);
    }

    Select.DEFAULT = {
        text : "text",          // 默认渲染的文字key
        val  : "val",           // 默认渲染的值key

        icon : "icon-right",    // 图标元素的class
        item : "item",          // 子项目的class

        init : null,            // 初始化的对象
        call : null,            // 子项目每次点击后的回掉
        mult : false,           // 多选模式
        modal: false,           // 是否弹框模式


        actived : "selected",   // 激活时添加的class
        template: require("./template.html"),
        selected: "ion-ios-checkmark",
        unselect: "ion-ios-checkmark-outline",
    }

    Select.prototype.init = function() {
        var that = this, opt = that.options, key;

        key = "_select_"+$.getRandom();

        if (opt.text.match(/\{/)) {
            opt.text = opt.text.replace(/\{/g, "{{");
            opt.text = opt.text.replace(/\}/g, "}}");
        } else {
            opt.text = "{{"+opt.text+"}}";
        }
        
        if (opt.val.match(/\{/)) {
            opt.val = opt.val.replace(/\{/g, "{{");
            opt.val = opt.val.replace(/\}/g, "}}");
        } else {
            opt.val = "{{"+opt.val+"}}";
        }

        /* 如果传入的是DOM元素，则直接添加元素 */
        if (that.el instanceof Element || $(that.el).length > 0) {
            that.el = $(that.el);
            that.el.addClass("select").attr("id", key);
        } else {
            var rdata = that.el;    // 初始化渲染用的列表

            that.el = $('<div class="select list" id="'+key+'"></div>');
            that.render(rdata);     // 渲染数据
            that.el.attr("id", key);

            that.el.appendTo("body");
            that.el = $("#"+key)
        }
      
        /* 尝试初始化modal模式 */
        if (opt.modal) that.handle = that.el.modal({hasInsert: false});

        /* 修正数据存放的对象类型 */
        if (opt.mult) { that.rets.val = []; that.rets.pos = []; }
        
        if (opt.init) {
            if (opt.mult) {
                that.set(typeof opt.init == "array" ? opt.init : []);
            } else {
                that.set(opt.init);
            }
        } else {
            that.set(opt.mult ? [] : -1);
        }


        that.el.on("tap", function(e) {
            var pos, ret = that.rets;

            for(var i=0; i<e.path.length; i++) {
                var $item = $(e.path[i]);

                if ($item.hasClass(opt.item)) {
                    pos = $item.index();
                    break;  // 跳出后续检测
                }
            }

            if (pos != undefined && pos >= -1) {
                if (opt.mult /* 多选模式 */) {
                    if (ret.pos.findIn(pos)) {
                        ret.pos.delBy(pos);
                    } else {
                        ret.pos.push(pos);
                    }
                } else {
                    ret.pos = pos;
                }
                
                that.set(ret.pos, false);
                that.exec();    // 执行回掉

                if (!opt.mult) that.hide(); // 隐藏弹框
            }
                
        })

        return this;
    };

    Select.prototype.exec = function() {
        var that = this, opt = that.options;

        if ($.isFun(opt.call)) {
            var val = that.rets.val,
                pos = that.rets.pos;
            opt.call.call(that, val, pos, that.text());
        }

        return that;
    }

    /* select 对象渲染方法 */
    Select.prototype.render = function(list, template, rhtml) {
        var that = this, opt = that.options, tpl, render, html;

        tpl = template ? template : opt.template;
        tpl = tpl.replace(/\{\{text\}\}/g, opt.text);
        tpl = tpl.replace(/\{\{val\}\}/g, opt.val);

        render = { items: list, unselect: opt.unselect };

        that.data = list;   // 保存下来渲染用的数据

        html = $.tpl(tpl, render);

        if (that.el && that.el.html && !rhtml) {
            that.el.html(html);
            that.rets.val = null;
            that.rets.pos = null;

            /* 更新滚动效果 */
            that.el.removeClass("list")
                   .wrapAll('<div class="list item_body"></div>');
            that.scroll = that.el.scroll();
            that.el.once("touchstart", function() {
                that.scroll.refresh(); // 初始化滚动框
            })
        }

        return html;
    }

    Select.prototype.set = function(sets, byVal) {
        var that = this, opt = that.options, rets = that.rets, save,
            childs, cls = {on: opt.selected, off: opt.unselect};

        childs = that.el.query('.'+opt.item);
        if (childs instanceof Element) {
            childs = new Array(childs);
        }
        save = opt.mult ? {val: [], pos: []} : {}

        for(var i=0; i<childs.length; i++) {
            var $item = $(childs[i]), select = false, $icon,
                val = $item.attr("val"), index = $item.index();

            $icon = $item.find("."+opt.icon);

            if (opt.mult) {
                for(var j=0; j<sets.length; j++) {
                    var check = sets[j];

                    if ((byVal && check == val) || check == index) {
                        select = true;
                        save.val.push(val);
                        save.pos.push(index);
                    }
                }
            } else {
                if ((byVal && sets == val) || sets == index) {
                    select = true;
                    save.val = val;
                    save.pos = index;
                }
            }

            $icon.switchClass(cls, select);
            $item.toggleClass(opt.actived, select);
        }

        return that.rets = save;
    }

    Select.prototype.val = function() {
        return this.rets.val;
    };

    Select.prototype.pos = function(index) {
        return this.rets.pos;
    };

    Select.prototype.text = function(index) {
        var that = this, opt = that.options;

        return that.el.find("."+opt.actived).text();
    }

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

    if ($ && !$.select) {
        $.extend({select: function(el, opt) {
            return new Select(el, opt).init();
        }})
    };
})();