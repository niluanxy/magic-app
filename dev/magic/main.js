(function(w, doc, undefined) {
    if (w.$ && w.Magic) return;
    require("extend");      // 原生对象扩展

    if (!w.$J) w.$J = undefined;

    /* 尽可能快的在dom加载完成后执行给定函数 */
    var _READYCALL = require("domready"),
        _QUERY     = require("query"),
        _DOM       = require("dom"),
        _UTIL      = require("util"),
        ua         = navigator.userAgent;

    var Magic = function(select, content) {
        // 如果传入的是一个函数，则添加一个自执行函数
        if (typeof select === "function") {
            return _READYCALL(select);
        } else if (typeof select === "string") {
            this.length = 0;    // 默认无元素

            // 判断是否为创建DOM的字符串
            if (_DOM.check(select)) {
                var make = _DOM.make(select);
                if (make.childNodes.length == 1) {
                    this[0] = make.childNodes[0];
                } else {
                    this[0] = make;
                }

                this.length = 1;
            } else {
                // 否则直接尝试查找对象
                var qur = _QUERY(select, content);
                if (qur && qur.length /* 是否返回数组 */) {
                    if (qur.length > 0) {
                        this[0] = qur[0];
                        this.length = 1;
                    }
                } else if (qur instanceof Element) {
                    this[0] = qur;  // 只有一个对象时直接赋值
                    this.length = 1;
                }
            }
        } else if (select instanceof Element) {
            // 如果是DOM对象，返回包装的对象
            this[0] = select;
            this.length = 1;
        } else if (select === doc || select === w) {
            this[0] = select;
            this.length = 1;
        } else if (select instanceof Magic) {
            return select;
        }

        return this.length > 0 ? this : null;
    }

    // platform 相关检测
    Magic.platform = /iP(hone|od|ad)/g.test(ua) ? "ios" :
                      /Android/g.test(ua) ? "android" : "other";
    Magic.runtime  = w.$J ? "mgnative" :
                     w.cordova ? "cordova" :
                     /MicroMessenger/ig.test(ua) ? "weixin" : "web";

    var rootMagic = function(select, content) {
        return new Magic(select, content);
    };

    rootMagic.fn = rootMagic.prototype = Magic.prototype = {
        /* 简单的查询方法，返回标准的dom对象 */
        query: function(select) {
            return _QUERY(select, this[0]);
        },

        /* 在子类中查找对象 */
        find: function(select) {
            return new Magic(select, this[0]);
        },
    };

    rootMagic.fn.extend = rootMagic.extend = _UTIL.extend;

    w.$ = w.Magic = rootMagic;
})(window, document);
