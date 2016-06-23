module.exports = (function() {
    var style = {}, _HIDE = {}, _UTIL = require("util");

    /* 对象的类操作的一些方法 */
    style.hasClass = function(className) {
        return this[0] ? _UTIL.hasClass(this[0], className) : false;
    };

    style.addClass = function(className) {
        this[0] && _UTIL.addClass(this[0], className);

        return this;
    };

    style.removeClass = function(className) {
        this[0] && _UTIL.removeClass(this[0], className);

        return this;
    };

    style.toggleClass = function(className, set) {
        this[0] && _UTIL.toggleClass(this[0], className, set);

        return this;
    };

    /* 只有两种状态的元素切换样式 */
    style.switchClass = function(cls, active) {
        if (active /* 激活状态 */) {
            this.addClass(cls.on||'');
            this.removeClass(cls.off||'')
        } else {
            this.removeClass(cls.on||'');
            this.addClass(cls.off||'')
        }

        return this;
    };

    style.offset = function(trans) {
        return this[0] && _UTIL.offset(this[0], !trans) || null;
    };

    // 显示元素，会尝试恢复元素 display 属性
    style.show = function(display) {
        if (this.css("display") == "none") {
            var hdid = this[0]._HIDE_ID_,
                show = display || _HIDE[hdid];

            show = !show || show == "none" ? "block" : show;

            this.css("display", show);
        }

        return this;
    };

    // 隐藏元素，会保存元素 display 属性
    style.hide = function() {
        var hdid = this[0]._HIDE_ID_;

        if (!hdid) {
            hdid = _UTIL.getTime();
            this[0]._HIDE_ID_ = hdid;
        }

        _HIDE[hdid] = this.css("display");
        this.css("display", "none");

        return this;
    };

    style.css = function(attr, val) {
        if (!this[0]) return;

        if (val == undefined) {
            return getComputedStyle(this[0])[attr];
        } else {
            return this[0].style[attr] = val;
        }
    };

    /* 简单的获取元素的高度和宽度 */
    style.height = function(val) {
        if (!this[0]) return;

        if (val && parseFloat(val) >= 0) {
            this.css("height", parseFloat(val)+"px");
        } else {
            return this[0].getBoundingClientRect().height;
        }
    };

    style.width = function(val) {
        if (!this[0]) return;

        if (val && parseFloat(val) >= 0) {
            this.css("width", parseFloat(val)+"px");
        } else {
            return this[0].getBoundingClientRect().width;
        }
    };

    Magic.fn.extend(style);
})();
