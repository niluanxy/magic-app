require("./style.css");

module.exports = (function() {
    var Numpad = function(element, option) {
        this.el      = $(element);
        this.bind    = null;
        this.value   = "";
        this.modal   = null;
        this.content = null;
        this.option  = $.extend({}, Numpad.DEFAULT, option, true);
    };

    Numpad.DEFAULT = {
        board  : "common",          // 键盘类型 (common,number,float)
        filter : null,              // 过滤器，可以有多个(数组)
        cancel : null,              // 取消时的回掉方法
        call   : null,              // 确认输入时的回掉方法
        input  : null,              // 成功输入后的回掉（被过滤器过滤掉则视为失败输入）
        click  : null,              // 点击后的回掉方法
        content: null,              // 内容容器，用于点击出发输入法弹出效果
    }

    /* 反悔计算结果 */
    Numpad.prototype.calculate = function(key) {
        var retval = this.value + "";

        if (key == "empty") {
            retval = "";
        } else if (key == "del") {
            retval = retval.split('', retval.length-1).join('');
        } else if (key != "ok") {
            retval += key;
        }

        return retval;  // 返回运算后的数字
    }

    Numpad.prototype.init = function() {
        var html = require("./template.html"), that = this, opt = that.option;

        that.modal   = $(html).modal({
                            hasInsert : false,
                            background: false,
                            autoHide  : false
                        });

        that.value   = that.el.val(); // 更新初始值
        that.content = opt.content;

        if (that.el.tagName() == "input") {
            var $body = that.modal.el.find(".modal_body");

            $body.on("tap", ".item", function(e) {
                e.stopPropagation()     // 阻止传播到父类

                var $target = $(e.target), key = $target.attr("val"), ret;

                if (key == "ok") {
                    if ($.isFun(opt.call)) opt.call(key, that.value);
                    that.hide();  // 隐藏窗口
                } else {
                    if (opt.board == "number" && key == ".") {
                        ret = false;    // 数字模式过滤 . 
                    } else if ($.isFun(opt.input)) {
                        ret = opt.input(key, that.calculate(key));
                    }

                    if (ret !== false) {
                        /* 设置最终的结果 */
                        that.value = that.calculate(key);
                    }

                    if ($.isFun(opt.click)) {
                        opt.click(key, that.value);
                    }
                }
            })

            that.modal.el.on("tap", function(e) {
                that.hide();        // 调用自身的隐藏方法
            })
        }

        return this;
    }

    /* 设置或获取input的数值 */
    Numpad.prototype.val = function(newVal) {
        if (newVal !== undefined) {
            this.value = newVal;
            this.el.val(newVal);
        } else {
            return this.el.val();
        }
    }

    /* 滚动内容区域 */
    Numpad.prototype.scroll = function(show) {
        var content = this.content, modal = this.modal,
            $main, height, hborder, bottom, fix, tel;

        if (content && content.scrollTo) {
            $main  = $(content.wrapper);
            bottom = parseInt($main.css("bottom"));
            height = content.wrapperHeight;

            if (this._height === undefined) {
                this._height = modal.el.find(".modal_body").height();
                this._maxy   = content.maxScrollY;
                this._lasty  = content.y
            }

            /* 获取实际的键盘占用高度 */
            hborder = this._height - bottom;
            height += (show?-1:1)*hborder;

            $main.css("height", height+"px");
            content.refresh();
            
            if (show === true) {
                tel = this.el.parent();
                content.maxScrollY = -9999;
                fix = tel.height() - height;
                content.scrollToElement(tel[0], null, 0, fix);
            } else {
                content.maxScrollY = this._maxy;
                content.scrollTo(0, this._lasty, 300);
            }
        }   
    }

    Numpad.prototype.show = function() {
        this.modal.show();
        this.scroll(true);
        
        return this;
    }

    Numpad.prototype.hide = function() {
        this.scroll();
        this.modal.hide();

        return this;
    }

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.numpad) {
        $.extend({numpad: function(element, option) {
            return new Numpad(element, option).init();
        }});
    };

    if ($ && $.fn && !$.fn.numpad) {
        $.fn.extend({numpad: function(option) {
            var opt = $.extend({}, option);
            if (opt.hasInsert === undefined) {
                opt.hasInsert = true;
            }
            return new Numpad(this[0], opt).init();
        }});
    };
})();