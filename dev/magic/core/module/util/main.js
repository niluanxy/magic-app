module.exports = (function() {
    var util = {}; _UTIL = require("util"), _TPL = require("templayed");

    /**
     * 判断某个元素是否在某个class之下
     *
     * @param  {String}  className [检测的父Class]
     * @param  {Element} stop      [停止检测的dom对象]
     * @return {boolean}           [包含检测类名的对象 或 false]
     */
    util.belowClass = function(className, stop, wrap) {
        var $stop = $(stop)[0] || document, ret = false;

        if (this[0] && $stop) {
            ret = _UTIL.belowClass(this[0], className, $stop, wrap);

            ret = ret ? $(ret) : false;
        }

        return ret;
    };

    util.below = function(parent) {
        if (this[0] && $(parent)[0]) {
            return _UTIL.below(this[0], $(parent)[0]);
        }

        return false;
    };

    /* 获取表单元素的值 */
    util.val = function(val) {
        var tagName = this[0] ? this[0].tagName : "", type;

        if (tagName == "INPUT") {
            type = this.attr("type").toUpperCase();

            if (val !== undefined) {
                if (["RADIO", "CHECKBOX"].findIn(type)) {
                    this[0].checked = !!val;
                    this[0].value   = !!val ? "on" : "off";
                } else {
                    this[0].value = val;
                }
            }

            return this[0].value;
        }
    };

    /* 对象的属性操作的一些方法 */
    util.attr = function(attr, val) {
        if (this[0]) return _UTIL.attr(this[0], attr, val);
    };

    util.removeAttr = function(attr) {
        if (this[0]) _UTIL.removeAttr(this[0], attr);

        return this;
    };

    util.tag = function() {
        var tagname = this[0] && this[0].tagName;

        return tagname ? tagname.toLocaleLowerCase() : "";
    };

    /* 精简的模板引擎 */
    util.tpl = function(template, datas) {
        if (template != undefined) {
            var html = _TPL(template)(datas);

            this.html(html);    // 更新当前元素内容
        }

        return this;
    };

    /* 对象的 DATA 操作 */
    util.data = function(key, val) {
        if (!this[0]) return;
        return _UTIL.data(this[0], key, val);
    };

    util.removeData = function(key) {
        if (this[0]) _UTIL.removeData(this[0], key);

        return this;
    };

    /* 简单判断元素渲染完成后执行某操作 */
    util.render = function(call) {
        var handle, that = this, argv = [];

        for(var i = 1; i<arguments.length; i++)
            argv.push(arguments[i]);
        handle = setInterval(function() {
            if (that.width() > 0 && that.height() > 0) {
                if (typeof call == "function")
                    call.apply(null, argv);
                clearInterval(handle);
            }
        }, 20);

        return handle;
    };

    Magic.fn.extend(util);
})();
