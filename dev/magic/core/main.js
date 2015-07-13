require("extend");      // 原生对象扩展

(function(window, undefined) {
    var Magic = (function() {
        /* 一个简单的实例对象初始化方法 */
        var magic = function(select) {
                return new magic.fn._init(select);
            },
            _UTIL = require("util");

        magic.fn = magic.prototype = {
            constructor: Magic,
            /* magic对象构造器 */
            _init: function(select, content) {
                // 如果传入的是一个函数，则添加一个自执行函数
                if (typeof select === "function") {
                    return magic.ready(select);
                } else if (typeof select === "string") {
                    this.length = 0;    // 默认无元素

                    // 判断是否为创建DOM的字符串
                    if (select[0] === "<" &&
                        select[ select.length - 1 ] === ">" &&
                        select.length >= 3) {
                        
                        var make = _UTIL.makeDom(select);
                        if (make.childNodes.length == 1) {
                            this[0] = make.childNodes[0];
                        } else {
                            this[0] = make;
                        }

                        this.length = 1;
                    } else {
                        // 否则直接尝试查找对象
                        var qur = magic.query(select, content);
                        if (qur instanceof Array) {
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
                } else if (select === document) {
                    this[0] = document;
                    this.length = 1;
                } else if (select instanceof Magic) {
                    return select;
                }
                
                return this;
            },

            /* 简单的查询方法，返回标准的dom对象 */
            query: function(select) {
                return require("query")(select, this[0]);
            },

            /* 在子类中查找对象 */
            find: function(select) {
                return new magic.fn._init(select, this[0]);
            },

            /* 对象的类操作的一些方法 */
            hasClass: function(className) {
                return _UTIL.hasClass(this[0], className);
            },
            addClass: function(className) {
                _UTIL.addClass(this[0], className);

                return this;
            },
            removeClass: function(className) {
                _UTIL.removeClass(this[0], className);

                return this;
            },
            toggleClass: function(className, set) {
                _UTIL.toggleClass(this[0], className, set);
                
                return this;
            },

            /* 对象的属性操作的一些方法 */
            attr: function(attr, val) {
                return _UTIL.attr(this[0], attr, val);
            },

            removeAttr: function(attr) {
                _UTIL.removeAttr(this[0], attr);

                return this;
            },

            /* 对象的 DATA 操作 */
            data: function(key, val) {
                if (!this[0]) return;
                return _UTIL.data(this[0], key, val);
            },

            removeData: function(key) {
                if (this[0]) _UTIL.removeData(this[0], key);

                return this;
            },

            /* 对象事件操作的简单方法 */
            on: function(type, fn, capture) {
                _UTIL.addEvent(this[0], type, fn, capture);

                return this;
            },

            off: function(type, fn, capture) {
                _UTIL.removeEvent(this[0], type, fn, capture);

                return this;
            },

            css: function(attr, val) {
                if (!this[0]) return;

                if (val == undefined) {
                    return getComputedStyle(this[0])[attr];
                } else {
                    return this[0].style[attr] = val;
                }
            },

            /* 简单的获取元素的高度和宽度 */
            height: function(val) {
                if (!this[0]) return;

                if (val && parseFloat(val) >= 0) {
                    this.css("height", parseFloat(val)+"px");
                } else {
                    return this.css("height").replace("px", '');
                }
            },

            width: function(val) {
                if (!this[0]) return;

                if (val && parseFloat(val) >= 0) {
                    this.css("width", parseFloat(val)+"px");
                } else {
                    return this.css("width").replace("px", '');
                }
            },

            /* 为对象添加HTML对象或者字符串 */
            append: function(text) {
                this[0] = _UTIL.append(text, this[0]);
                return this;
            },


            /* 将自身从父元素中删除，如果可以的话 */
            remove : function() {
                var parent = this.parent()[0];
                if (parent) {
                    parent.removeChild(this[0]);
                }
            },

            /* 获取当前元素在父类中的位置 */
            index : function() {
                var parent = this.parent()[0], items;

                if (parent) {
                    items = parent.children;

                    for(var i=0; i<items.length; i++) {
                        if (items[i] == this[0]) {
                            return i;
                        }
                    }
                }

                return -1;  // 默认返回 -1
            },

            /* 设置或读取元素的内联HTML内容 */
            html : function(html) {
                if (!this[0]) return this;

                if (html /* 有值时设置值并返回自身 */) {
                    this[0].innerHTML = html;
                    return this;
                } else {
                    return this[0].innerHTML;
                }
            },

            /* 简单判断元素渲染完成后执行某操作 */
            render: function(call) {
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
            },

            /* 对象的父元素和子元素操作方法 */
            parent: function() {
                var parent = null;  // 存放父类元素
                if (this[0] /* 有对象时执行 */) {
                    parent = this[0].parentNode;
                }

                if (parent) return magic(parent);
            },

            children: function() {
                var children = null;  // 存放子类元素
                if (this[0] /* 有对象时执行 */) {
                    children = this[0].children;
                }

                if (children) return magic(children[0]);
            }
        }

        /* 重设init的原型对象链接，使之可以调用magic.fn的方法和属性 */
        magic.fn._init.prototype = magic.fn;
        magic.extend = magic.fn.extend = _UTIL.extend;

        /* 绑定一些常用的静态方法 */
        magic.extend({
            /* 简单的查询方法，返回标准的dom对象 */
            query: require("query"),

            /* 返回一个节流执行的函数 */
            delayCall: _UTIL.delayCall,

            /* 返回一个随机数字字符串 */
            getRandom: function() {
                return (''+Math.random()).replace(/\D/g, '');
            },

            /* 返回当前时间的时间戳 */
            getTime: _UTIL.getTime,

            /* 返回一个继承了给定父类的所有方法和属性的新对象 */
            inheart: _UTIL.inheart,

            /* 尽可能快的在dom加载完成后执行给定函数 */
            ready: require("domready"),

            /* promise 的支持 */
            defer: function() {
                var defer = require("promise");

                return new defer.Promise();
            },

            jsonp: function(url, data) {
                var jsonp = require("jsonp"), callname, defer;

                defer = this.defer();       // 创建一个defer
                data  = data || {};         // data空是创建空对象

                // 如果传入了后台回调方法，则设置，否则默认
                callname = data.jsonp || "callback";    
                data.jsonp && delete data.jsonp;    // 删除属性

                jsonp({ url: url, data: data,
                    callbackName: callname,
                    success: function(data) {
                        defer.done(data)
                    }
                })

                return defer;   // 返回参数
            }
        })

        return magic;   // 返回最后的对象
    })();

    window.$ = Magic;
})(window);

require("../mui/muicore.js");      // 加载核心UI组件