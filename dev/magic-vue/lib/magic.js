/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);      // 原生对象扩展

	(function(window, undefined) {
	    var Magic = (function() {
	        /* 一个简单的实例对象初始化方法 */
	        var magic = function(select) {
	                return new magic.fn._init(select);
	            },
	            _UTIL = __webpack_require__(3);

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
	                return __webpack_require__(4)(select, this[0]);
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
	            query: __webpack_require__(4),

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
	            ready: __webpack_require__(1),

	            /* promise 的支持 */
	            defer: function() {
	                var defer = __webpack_require__(5);

	                return new defer.Promise();
	            },

	            jsonp: function(url, data) {
	                var jsonp = __webpack_require__(6), callname, defer;

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

	__webpack_require__(10);      // 加载核心UI组件

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! 
	 * onDomReady.js 1.4.0 (c) 2013 Tubal Martin - MIT license
	 * github: https://github.com/tubalmartin/ondomready
	 */
	;(function (definition) {
	    if (true) {
	        // Register as an AMD module.
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        // Browser globals
	        window['onDomReady'] = definition();
	    }
	}(function() {
	    
	    'use strict';

	    var win = window,
	        doc = win.document,
	        docElem = doc.documentElement,

	        LOAD = "load",
	        FALSE = false,
	        ONLOAD = "on"+LOAD,
	        COMPLETE = "complete",
	        READYSTATE = "readyState",
	        ATTACHEVENT = "attachEvent",
	        DETACHEVENT = "detachEvent",
	        ADDEVENTLISTENER = "addEventListener",
	        DOMCONTENTLOADED = "DOMContentLoaded",
	        ONREADYSTATECHANGE = "onreadystatechange",
	        REMOVEEVENTLISTENER = "removeEventListener",

	        // W3C Event model
	        w3c = ADDEVENTLISTENER in doc,
	        top = FALSE,

	        // isReady: Is the DOM ready to be used? Set to true once it occurs.
	        isReady = FALSE,

	        // Callbacks pending execution until DOM is ready
	        callbacks = [];
	    
	    // Handle when the DOM is ready
	    function ready( fn ) {
	        if ( !isReady ) {
	            
	            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
	            if ( !doc.body ) {
	                return defer( ready );
	            }
	            
	            // Remember that the DOM is ready
	            isReady = true;

	            // Execute all callbacks
	            while ( fn = callbacks.shift() ) {
	                defer( fn );
	            }
	        }    
	    }

	    // The ready event handler
	    function completed( event ) {
	        // readyState === "complete" is good enough for us to call the dom ready in oldIE
	        if ( w3c || event.type === LOAD || doc[READYSTATE] === COMPLETE ) {
	            detach();
	            ready();
	        }
	    }

	    // Clean-up method for dom ready events
	    function detach() {
	        if ( w3c ) {
	            doc[REMOVEEVENTLISTENER]( DOMCONTENTLOADED, completed, FALSE );
	            win[REMOVEEVENTLISTENER]( LOAD, completed, FALSE );
	        } else {
	            doc[DETACHEVENT]( ONREADYSTATECHANGE, completed );
	            win[DETACHEVENT]( ONLOAD, completed );
	        }
	    }
	    
	    // Defers a function, scheduling it to run after the current call stack has cleared.
	    function defer( fn, wait ) {
	        // Allow 0 to be passed
	        setTimeout( fn, +wait >= 0 ? wait : 1 );
	    }
	    
	    // Attach the listeners:

	    // Catch cases where onDomReady is called after the browser event has already occurred.
	    // we once tried to use readyState "interactive" here, but it caused issues like the one
	    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
	    if ( doc[READYSTATE] === COMPLETE ) {
	        // Handle it asynchronously to allow scripts the opportunity to delay ready
	        defer( ready );

	    // Standards-based browsers support DOMContentLoaded    
	    } else if ( w3c ) {
	        // Use the handy event callback
	        doc[ADDEVENTLISTENER]( DOMCONTENTLOADED, completed, FALSE );

	        // A fallback to window.onload, that will always work
	        win[ADDEVENTLISTENER]( LOAD, completed, FALSE );

	    // If IE event model is used
	    } else {            
	        // Ensure firing before onload, maybe late but safe also for iframes
	        doc[ATTACHEVENT]( ONREADYSTATECHANGE, completed );

	        // A fallback to window.onload, that will always work
	        win[ATTACHEVENT]( ONLOAD, completed );

	        // If IE and not a frame
	        // continually check to see if the document is ready
	        try {
	            top = win.frameElement == null && docElem;
	        } catch(e) {}

	        if ( top && top.doScroll ) {
	            (function doScrollCheck() {
	                if ( !isReady ) {
	                    try {
	                        // Use the trick by Diego Perini
	                        // http://javascript.nwbox.com/IEContentLoaded/
	                        top.doScroll("left");
	                    } catch(e) {
	                        return defer( doScrollCheck, 50 );
	                    }

	                    // detach all dom ready events
	                    detach();

	                    // and execute any waiting functions
	                    ready();
	                }
	            })();
	        } 
	    } 
	    
	    function onDomReady( fn ) { 
	        // If DOM is ready, execute the function (async), otherwise wait
	        isReady ? defer( fn ) : callbacks.push( fn );
	    }
	    
	    // Add version
	    onDomReady.version = "1.4.0";
	    // Add method to check if DOM is ready
	    onDomReady.isReady = function(){
	        return isReady;
	    };
	    
	    return onDomReady;
	}));

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * String 对象添加 hashCode 功能
	 * 
	 * @author      mufeng  <smufeng@gmail.com>
	 * @version     0.1     <2015-04-26>
	 * @link        http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
	 */
	String.prototype.hashCode = function() {
	    var hash = 0;
	    if (this.length == 0) return hash;
	    for (i = 0; i < this.length; i++) {
	        char = this.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash;
	    }
	    return hash;
	}

	/**
	 * String 将首字符大写，其他小写
	 */
	String.prototype.toUpFirst = function() {
	    var str = this.toLowerCase();

	    str = str[0].toUpperCase() + str.slice(1);

	    return str;     // 返回新的字符串
	}

	/**
	 * Array findBy 工具函数，通过给定的key和值反向查找数据
	 */

	Array.prototype.findBy = function(key, val, index) {
	    for(var i in this) {
	        if (this[i][key] == val) {
	            return index?i:this[i];
	        }
	    }

	    return undefined;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = (function() {
	    var util = {}; // 定义返回的对象

	    /**
	     * 按照输入参数返回一个节流函数
	     *
	     * @param       {Function}  func - 需要节流执行的函数
	     * @param       {Integer}   wait - 节流频率
	     * @return      {Function}  新的给定频率节流执行的函数
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.dealyCall = function(func, wait) {
	        var context, args, timeout, result;
	        var previous = 0;
	        var later = function() {
	            previous = new Date();
	            timeout  = null;
	            result   = func.apply(context, args);
	        };

	        return function() {
	            var now       = new Date();
	            var remaining = wait - (now - previous);

	            context = this;
	            args    = arguments;

	            if (remaining <= 0) {
	                clearTimeout(timeout);
	                timeout  = null;
	                previous = now;
	                result   = func.apply(context, args);
	            } else if (!timeout) {
	                timeout = setTimeout(later, remaining);
	            }

	            return result;
	        };
	    };

	    /**
	     * 返回当前时间的时间戳
	     *
	     * @return      {Integer}   当前时间的时间戳
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.getTime = Date.now || function getTime() {
	        return new Date().getTime();
	    };

	    /**
	     * 对给定对象绑定事件
	     *
	     * @param       {Element}   el       - 操作对象
	     * @param       {String}    type     - 事件名
	     * @param       {Function}  fn       - 执行函数
	     * @param       {Boolean}   *capture - 是否进行函数捕获
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.addEvent = function(el, type, fn, capture) {
	        el.addEventListener(type, fn, !!capture);
	    };

	    /**
	     * 移除给定对象的指定事件
	     *
	     * @param       {Element}   el       - 操作对象
	     * @param       {String}    type     - 事件名
	     * @param       {Function}  fn       - 执行函数
	     * @param       {Boolean}   *capture - 是否进行函数捕获
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.removeEvent = function(el, type, fn, capture) {
	        el.removeEventListener(type, fn, !!capture);
	    };


	    /**
	     * 合并一个或多个对象到目标对象
	     *
	     * @param       {Object}    target   - 目标对象
	     * @param       {Object}    obj...   - 要合并一个或多个对象
	     * @param       {Boolean}   ...last  - 是否忽略空值(null,undefined)
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.extend = function(target, obj) {
	        var i = 1, src = target, name, argv, len, pass;
	        argv = arguments;       // 参数数组

	        // 如果最后一个变量是 true ，表示忽略无效字段
	        if (argv[argv.length-1] === true) {
	            len = argv.length-1;
	            pass = true;
	        } else {
	            len = argv.length;
	            pass = false;
	        }

	        // 如果只有一个参数时，合并到自身
	        if (argv.length == 1) {
	            src = this;     // 重置复制对象句柄
	            i = 0;          // 重置开始复制的对象下标
	        }

	        for(; i < len; i++) {
	            for(name in argv[i]) {
	                if (pass && argv[i][name] == undefined) {
	                    continue;   // 跳过 null 与 undefined    
	                }

	                src[name] = argv[i][name];
	            }
	        }

	        return src;     // 返回合并后的对象
	    };

	    /**
	     * 对象的 HTML 属性操作(读或者取)
	     *
	     * @param       {Element}   e - 操作对象
	     * @param       {String}    attr - 要操作的属性名
	     * @param       {String}    val - 要赋的值
	     * @version     0.1         <2015-04-28>
	     */
	    util.attr = function(e, attr, val) {
	        var nType = e.nodeType, lattr;

	        if (nType === 3 || nType === 8 || nType === 2) {
	            return; // 忽略掉 文本节点、注释和属性节点
	        }

	        if (!!attr /* 有属性值时才执行 */) {
	            lattr = attr.toLowerCase(); // 转为小写

	            if (val === undefined) {
	                // val 不存在则为读取属性值
	                return e.getAttribute(lattr);
	            } else {
	                // 否则则为设置具体的属性值
	                e.setAttribute(lattr, val);
	            }
	        }
	    }

	    /**
	     * 操作对象的 data 值
	     * @param  {Element}    el  操作对象
	     * @param  {String}     key 键名
	     * @param  {Object}     val 要设置的值
	     * @return {Object}     返回结果（如果存在）
	     */
	    ;(function() {
	        var dataCache = {}, map = "magicData";

	        util.data = function(el, key, val) {
	            var attrs = el.attributes, dkey;

	            if (!attrs[map]) {
	                var id = ("magic"+Math.random()).replace(/\D/g, '');
	                attrs[map] = id;
	                dataCache[id] = {};
	            }

	            dkey = attrs[map];      // 获得对象上的数据索引ID

	            if (val != undefined) {
	                dataCache[dkey][key] = val;
	            } else {
	                return dataCache[dkey][key];
	            }
	        };

	        util.removeData = function(el, key) {
	            var attrs = el.attributes,
	                elid  = attrs[map];

	            if (elid && dataCache[elid]) {
	                delete dataCache[elid][key];
	            }
	        };

	        util.clearData = function(el) {
	            var attrs = el.attributes,
	                elid  = attrs[map];

	            if (elid && dataCache[elid]) {
	                dataCache[elid] = null;
	            }
	        };
	    })();


	    /**
	     * 移除对象的某个属性
	     * @param       {Element}   e - 操作对象
	     * @param       {String}    attr - 要删除的属性名
	     * @version     0.1         <2015-04-28>
	     */
	    util.removeAttr = function(e, attr) {
	        var nType = e.nodeType, lattr;

	        if (nType === 3 || nType === 8 || nType ===2) {
	            return; // 忽略掉 文本节点、注释和属性节点
	        }

	        if (!!attr /* 过滤掉 undefined */) {
	            lattr = attr.toLowerCase();
	            e.removeAttribute(lattr);
	        }
	    }

	    /**
	     * 检测对象是否有某个类
	     *
	     * @param       {Element}   e - 操作对象
	     * @param       {Object}    c - 要检测的类名
	     * @return      {Boolean}   是否含有某个类
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.hasClass = function(e, c) {
	        var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
	        return re.test(e.className);
	    };

	    /**
	     * 为对象添加某个类
	     *
	     * @param       {Element}   e - 操作对象
	     * @param       {Object}    c - 要添加的类名
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.addClass = function(e, c) {
	        if (util.hasClass(e, c)) {
	            return;
	        }

	        if (!!!e.className) {
	            e.className = c;    // 无Class直接添加
	        } else {
	            var newclass = e.className.split(' ');
	            newclass.push(c);
	            e.className = newclass.join(' ');
	        }
	    };

	    /**
	     * 移除对象的某个类
	     *
	     * @param       {Element}   e - 操作对象
	     * @param       {Object}    c - 要移除的类名
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.removeClass = function(e, c) {
	        if (!util.hasClass(e, c)) {
	            return;
	        }

	        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
	        e.className = e.className.replace(re, ' ');
	        e.className = e.className.replace(/^\s/, '').replace(/\s$/, '');
	    };

	    /**
	     * 切换对象的某个类，已包含时移除，未包含时添加
	     *
	     * @param       {Element}   e - 操作对象
	     * @param       {Object}    c - 要切换的类名
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.toggleClass = function(e, c, set) {
	        if (set != undefined) {
	            // 有 SET 时，为真添加，否则删除
	            if (set == true) {
	                util.addClass(e, c);
	            } else {
	                util.removeClass(e, c);
	            }
	        } else if (util.hasClass(e, c)) {
	            util.removeClass(e, c);
	        } else {
	            util.addClass(e, c);
	        }
	    }

	    /**
	     * 获取对象的DOM坐标信息
	     *
	     * @param       {Element}   el - 操作对象
	     * @return      {Object}    坐标信息兑现
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.offset = function(el) {
	        var left = -el.offsetLeft,
	             top = -el.offsetTop;

	        while (el = el.offsetParent) {
	            left -= el.offsetLeft;
	            top  -= el.offsetTop;
	        }

	        return {
	            left: left,
	            top : top
	        };
	    };

	    /**
	     * 尝试将 text 转为 dom 对象
	     *
	     * @param       {String}    text - 要转换的DOM字符串
	     * @return      {Element}   包含转换好的DOM的一个Body对象
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-05-30>
	     */
	    util.makeDom = function(text) {
	        var content = document.implementation.createHTMLDocument("");
	        content.body.innerHTML = text;    // 将输入字符串转为DOM对象
	        return content.body;    // 返回包含DOM的Body对象
	    };

	    /**
	     * 将字符串或者DOM添加到给定的对象中
	     * @param       {String||Element}   text - 要添加的字符串或者DOM
	     * @param       {Element}           el - 要操作的DOM对象
	     * @return      {Element}           操作后的DOM对象
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-05-30>
	     */
	    util.append = function(text, el) {
	        if (typeof text === "string" &&
	             text[0] === "<" && 
	             text[ text.length - 1 ] === ">" &&
	             text.length >= 3) {
	            var doms = util.makeDom(text).childNodes;

	            for (var i=0; i<doms.length; i++) {
	                el.appendChild(doms.item(i));
	            }
	        } else if (text instanceof Element) {
	            el.appendChild(text);
	        }

	        return el;  // 反正处理后的对象
	    }

	    /**
	     * 继承给定父类的所有属性
	     *
	     * @param       {Object}   p - 要继承的父类对象
	     * @return      {Object}   继承后的新的对象
	     * @author      mufeng  <smufeng@gmail.com>
	     * @version     0.1     <2015-04-10>
	     */
	    util.inheart = function(p) {
	        if (p == null) throw TypeError();
	        if (Object.create)
	            return Object.create(p);
	        var t = typeof p;
	        if (t !== 'object' && t !== 'function') throw TypeError();

	        function f() {};
	        f.prototype = p;
	        return new f();
	    };

	    return util; // 最终返回闭包的对象
	})();

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * 一个简单的JS选择器
	 *
	 * @param       {String}  select - 查找元素的CSS字符串
	 * @returns     {Object}  返回查找结果，结果不唯一时返回数组
	 * @author      mufeng  <smufeng@gmail.com>
	 * @version     0.3     <2015-06-05>
	 */
	module.exports = function(select, el) {
	    var content, result;    // 定义执行环境及结果变量

	    if (typeof select == "string") {
	        var elname = select.toLowerCase(); // 转为字符串
	        content = el instanceof Element ? el : document;

	        if (elname == "body") {
	            result = document.body;
	        } else if (elname == "document") {
	            result = document;
	        } else if (select.indexOf("#") == 0 && !select.indexOf(" ")) {
	            result = content.getElementById(select.slice(1));
	        } else {
	            result = content.querySelectorAll(select);
	            result = result.length==1?result[0]:result;
	        }
	    } else if (select instanceof Element) {
	        result = select;    // dom元素直接返回
	    } else if (select === document) {
	        result = document;  // 如果是document直接返回
	    }

	    return result;      // 返回最终的选择结果
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 *  Copyright 2012-2013 (c) Pierre Duquesne <stackp@online.fr>
	 *  Licensed under the New BSD License.
	 *  https://github.com/stackp/promisejs
	 */

	(function(exports) {

	    function Promise() {
	        this._callbacks = [];
	    }

	    Promise.prototype.then = function(func, context) {
	        var p;
	        if (this._isdone) {
	            p = func.apply(context, this.result);
	        } else {
	            p = new Promise();
	            this._callbacks.push(function () {
	                var res = func.apply(context, arguments);
	                if (res && typeof res.then === 'function')
	                    res.then(p.done, p);
	            });
	        }
	        return p;
	    };

	    Promise.prototype.done = function() {
	        this.result = arguments;
	        this._isdone = true;
	        for (var i = 0; i < this._callbacks.length; i++) {
	            this._callbacks[i].apply(null, arguments);
	        }
	        this._callbacks = [];
	    };

	    function join(promises) {
	        var p = new Promise();
	        var results = [];

	        if (!promises || !promises.length) {
	            p.done(results);
	            return p;
	        }

	        var numdone = 0;
	        var total = promises.length;

	        function notifier(i) {
	            return function() {
	                numdone += 1;
	                results[i] = Array.prototype.slice.call(arguments);
	                if (numdone === total) {
	                    p.done(results);
	                }
	            };
	        }

	        for (var i = 0; i < total; i++) {
	            promises[i].then(notifier(i));
	        }

	        return p;
	    }

	    function chain(funcs, args) {
	        var p = new Promise();
	        if (funcs.length === 0) {
	            p.done.apply(p, args);
	        } else {
	            funcs[0].apply(null, args).then(function() {
	                funcs.splice(0, 1);
	                chain(funcs, arguments).then(function() {
	                    p.done.apply(p, arguments);
	                });
	            });
	        }
	        return p;
	    }

	    /*
	     * AJAX requests
	     */

	    function _encode(data) {
	        var result = "";
	        if (typeof data === "string") {
	            result = data;
	        } else {
	            var e = encodeURIComponent;
	            for (var k in data) {
	                if (data.hasOwnProperty(k)) {
	                    result += '&' + e(k) + '=' + e(data[k]);
	                }
	            }
	        }
	        return result;
	    }

	    function new_xhr() {
	        var xhr;
	        if (window.XMLHttpRequest) {
	            xhr = new XMLHttpRequest();
	        } else if (window.ActiveXObject) {
	            try {
	                xhr = new ActiveXObject("Msxml2.XMLHTTP");
	            } catch (e) {
	                xhr = new ActiveXObject("Microsoft.XMLHTTP");
	            }
	        }
	        return xhr;
	    }


	    function ajax(method, url, data, headers) {
	        var p = new Promise();
	        var xhr, payload;
	        data = data || {};
	        headers = headers || {};

	        try {
	            xhr = new_xhr();
	        } catch (e) {
	            p.done(promise.ENOXHR, "");
	            return p;
	        }

	        payload = _encode(data);
	        if (method === 'GET' && payload) {
	            url += '?' + payload;
	            payload = null;
	        }

	        xhr.open(method, url);
	        xhr.setRequestHeader('Content-type',
	                             'application/x-www-form-urlencoded');
	        for (var h in headers) {
	            if (headers.hasOwnProperty(h)) {
	                xhr.setRequestHeader(h, headers[h]);
	            }
	        }

	        function onTimeout() {
	            xhr.abort();
	            p.done(promise.ETIMEOUT, "", xhr);
	        }

	        var timeout = promise.ajaxTimeout;
	        if (timeout) {
	            var tid = setTimeout(onTimeout, timeout);
	        }

	        xhr.onreadystatechange = function() {
	            if (timeout) {
	                clearTimeout(tid);
	            }
	            if (xhr.readyState === 4) {
	                var err = (!xhr.status ||
	                           (xhr.status < 200 || xhr.status >= 300) &&
	                           xhr.status !== 304);
	                p.done(err, xhr.responseText, xhr);
	            }
	        };

	        xhr.send(payload);
	        return p;
	    }

	    function _ajaxer(method) {
	        return function(url, data, headers) {
	            return ajax(method, url, data, headers);
	        };
	    }

	    var promise = {
	        Promise: Promise,
	        join: join,
	        chain: chain,
	        ajax: ajax,
	        get: _ajaxer('GET'),
	        post: _ajaxer('POST'),
	        put: _ajaxer('PUT'),
	        del: _ajaxer('DELETE'),

	        /* Error codes */
	        ENOXHR: 1,
	        ETIMEOUT: 2,

	        /**
	         * Configuration parameter: time in milliseconds after which a
	         * pending AJAX request is considered unresponsive and is
	         * aborted. Useful to deal with bad connectivity (e.g. on a
	         * mobile network). A 0 value disables AJAX timeouts.
	         *
	         * Aborted requests resolve the promise with a ETIMEOUT error
	         * code.
	         */
	        ajaxTimeout: 0
	    };

	    if (true) {
	        /* AMD support */
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return promise;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        exports.promise = promise;
	    }

	})(this);


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/**
	 * A slim JSONP request library for Javascript
	 * github: https://github.com/larryosborn/JSONP
	 */

	(function() {
	    var JSONP, computedUrl, createElement, encode, noop, objectToURI, random, randomString;
	    createElement = function(tag) {
	        return window.document.createElement(tag);
	    };
	    encode = window.encodeURIComponent;
	    random = Math.random;
	    JSONP = function(options) {
	        var callback, done, head, params, script;
	        options = options ? options : {};
	        params = {
	            data: options.data || {},
	            error: options.error || noop,
	            success: options.success || noop,
	            beforeSend: options.beforeSend || noop,
	            complete: options.complete || noop,
	            url: options.url || ''
	        };
	        params.computedUrl = computedUrl(params);
	        if (params.url.length === 0) {
	            throw new Error('MissingUrl');
	        }
	        done = false;
	        if (params.beforeSend({}, params) !== false) {
	            callback = params.data[options.callbackName || 'callback'] = 'jsonp_' + randomString(15);
	            window[callback] = function(data) {
	                params.success(data, params);
	                params.complete(data, params);
	                try {
	                    return delete window[callback];
	                } catch (_error) {
	                    window[callback] = void 0;
	                    return void 0;
	                }
	            };
	            script = createElement('script');
	            script.src = computedUrl(params);
	            script.async = true;
	            script.onerror = function(evt) {
	                params.error({
	                    url: script.src,
	                    event: evt
	                });
	                return params.complete({
	                    url: script.src,
	                    event: evt
	                }, params);
	            };
	            script.onload = script.onreadystatechange = function() {
	                if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
	                    done = true;
	                    script.onload = script.onreadystatechange = null;
	                    if (script && script.parentNode) {
	                        script.parentNode.removeChild(script);
	                    }
	                    return script = null;
	                }
	            };
	            head = head || window.document.getElementsByTagName('head')[0] || window.document.documentElement;
	            return head.insertBefore(script, head.firstChild);
	        }
	    };
	    noop = function() {
	        return void 0;
	    };
	    computedUrl = function(params) {
	        var url;
	        url = params.url;
	        url += params.url.indexOf('?') < 0 ? '?' : '&';
	        url += objectToURI(params.data);
	        return url;
	    };
	    randomString = function(length) {
	        var str;
	        str = '';
	        while (str.length < length) {
	            str += random().toString(36)[2];
	        }
	        return str;
	    };
	    objectToURI = function(obj) {
	        var data, key, value;
	        data = [];
	        for (key in obj) {
	            value = obj[key];
	            data.push(encode(key) + '=' + encode(value));
	        }
	        return data.join('&');
	    };
	    if (("function" !== "undefined" && __webpack_require__(8) !== null) && __webpack_require__(9)) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return JSONP;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if ((typeof module !== "undefined" && module !== null) && module.exports) {
	        module.exports = JSONP;
	    } else {
	        this.JSONP = JSONP;
	    }
	}).call(this);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)(module)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 9 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(11);              // 加载常用组件的点击事件
	__webpack_require__(12);           // 加载滚动UI组件scroll
	__webpack_require__(13);              // 加载轮播UI组件slider
	__webpack_require__(18);               // 加载Modal模态弹框组件
	__webpack_require__(21);                 // 加载Tip提示组件
	__webpack_require__(24);             // 加载confirm组件
	__webpack_require__(27);          // 加载Loading组件

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * 为常用的 button 组件添加点击效果，同时全局增加 tap 事件
	 * 
	 * @author      mufeng  <smufeng@gmail.com>
	 * @version     0.1     <2015-06-02>
	 */

	$.ready(function() {
	    var $body = $("body"), $document = $(document), tap = {};

	    $document.on("touchstart", function(e) {
	        var touch = e.changedTouches[0];
	        tap.startX = touch.pageX;
	        tap.startY = touch.pageY;
	        tap.startT = $.getTime();
	    });

	    $document.on("touchend", function(e) {
	        var touch = e.changedTouches[0], cx, cy, ct;

	        cx = Math.abs(touch.pageX - tap.startX);
	        cy = Math.abs(touch.pageY - tap.startY);
	        ct = $.getTime() - tap.startT;

	        if (cx<5 && cy < 5 && ct < 200) {
	            e.stopPropagation();    // 终止冒泡

	            var ev = new Event('tap'),
	                $target = $(e.target);

	            ev.pageX  = touch.pageX;
	            ev.pageY  = touch.pageY;

	            do {
	                tagname = $target[0].tagName;
	                $target[0].dispatchEvent(ev);   // 触发 Tap 事件

	                if (tagname === "A") {
	                    e.preventDefault();
	                    var tohref = $target.attr("href");
	                    // 手动跳转到指定页面
	                    if (tohref) location.href = tohref; 
	                    return false;           // 终止后续检测
	                }

	                $target = $target.parent();     // 向上递归检测
	            } while($target[0] && $target[0] != this);
	        }
	    });


	    $body.on("touchstart", function(event) {
	        var $target = $(event.target),
	            $parent = $target.parent();

	        if ($parent.hasClass("tab-item")) {
	            $target = $parent;
	        }

	        if ($target.hasClass("button") ||
	            $target.hasClass("tab-item")) {

	            $target.addClass("active");
	        }
	    })

	    $body.on("touchend", function(event) {
	        var $target = $(event.target),
	            $parent = $target.parent();

	        if ($parent.hasClass("tab-item")) {
	            $target = $parent;
	        }

	        if ($target.hasClass("button") ||
	            $target.hasClass("tab-item")) {

	            $target.removeClass("active");
	        }
	    })
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var scroll = module.exports = (function (window, document, Math) {
	    var rAF = window.requestAnimationFrame  ||
	        window.webkitRequestAnimationFrame  ||
	        window.mozRequestAnimationFrame     ||
	        window.oRequestAnimationFrame       ||
	        window.msRequestAnimationFrame      ||
	        function (callback) { window.setTimeout(callback, 1000 / 60); };

	    var utils = (function () {
	        /* !!! 原文件修改处 */
	        var eutil = __webpack_require__(3);
	        var me    = eutil.inheart(eutil);

	        var _elementStyle = document.createElement('div').style;
	        var _vendor = (function () {
	            var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
	                transform,
	                i = 0,
	                l = vendors.length;

	            for ( ; i < l; i++ ) {
	                transform = vendors[i] + 'ransform';
	                if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
	            }

	            return false;
	        })();

	        function _prefixStyle (style) {
	            if ( _vendor === false ) return false;
	            if ( _vendor === '' ) return style;
	            return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	        }

	        me.prefixPointerEvent = function (pointerEvent) {
	            return window.MSPointerEvent ? 
	                'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10):
	                pointerEvent;
	        };

	        me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
	            var distance = current - start,
	                speed = Math.abs(distance) / time,
	                destination,
	                duration;

	            deceleration = deceleration === undefined ? 0.0006 : deceleration;

	            destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
	            duration = speed / deceleration;

	            if ( destination < lowerMargin ) {
	                destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
	                distance = Math.abs(destination - current);
	                duration = distance / speed;
	            } else if ( destination > 0 ) {
	                destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
	                distance = Math.abs(current) + destination;
	                duration = distance / speed;
	            }

	            return {
	                destination: Math.round(destination),
	                duration: duration
	            };
	        };

	        var _transform = _prefixStyle('transform');

	        me.extend(me, {
	            hasTransform: _transform !== false,
	            hasPerspective: _prefixStyle('perspective') in _elementStyle,
	            hasTouch: 'ontouchstart' in window,
	            hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
	            hasTransition: _prefixStyle('transition') in _elementStyle
	        });

	        // This should find all Android browsers lower than build 535.19 (both stock browser and webview)
	        me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

	        me.extend(me.style = {}, {
	            transform: _transform,
	            transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
	            transitionDuration: _prefixStyle('transitionDuration'),
	            transitionDelay: _prefixStyle('transitionDelay'),
	            transformOrigin: _prefixStyle('transformOrigin')
	        });


	        me.preventDefaultException = function (el, exceptions) {
	            for ( var i in exceptions ) {
	                if ( exceptions[i].test(el[i]) ) {
	                    return true;
	                }
	            }

	            return false;
	        };

	        me.extend(me.eventType = {}, {
	            touchstart: 1,
	            touchmove: 1,
	            touchend: 1,

	            mousedown: 2,
	            mousemove: 2,
	            mouseup: 2,

	            pointerdown: 3,
	            pointermove: 3,
	            pointerup: 3,

	            MSPointerDown: 3,
	            MSPointerMove: 3,
	            MSPointerUp: 3
	        });

	        me.extend(me.ease = {}, {
	            quadratic: {
	                style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
	                fn: function (k) {
	                    return k * ( 2 - k );
	                }
	            },
	            circular: {
	                style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',   // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
	                fn: function (k) {
	                    return Math.sqrt( 1 - ( --k * k ) );
	                }
	            },
	            back: {
	                style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
	                fn: function (k) {
	                    var b = 4;
	                    return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
	                }
	            },
	            bounce: {
	                style: '',
	                fn: function (k) {
	                    if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
	                        return 7.5625 * k * k;
	                    } else if ( k < ( 2 / 2.75 ) ) {
	                        return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
	                    } else if ( k < ( 2.5 / 2.75 ) ) {
	                        return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
	                    } else {
	                        return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
	                    }
	                }
	            },
	            elastic: {
	                style: '',
	                fn: function (k) {
	                    var f = 0.22,
	                        e = 0.4;

	                    if ( k === 0 ) { return 0; }
	                    if ( k == 1 ) { return 1; }

	                    return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
	                }
	            }
	        });

	        me.tap = function (e, eventName) {
	            var ev = document.createEvent('Event');
	            ev.initEvent(eventName, true, true);
	            ev.pageX = e.pageX;
	            ev.pageY = e.pageY;
	            e.target.dispatchEvent(ev);
	        };

	        me.click = function (e) {
	            var target = e.target,
	                ev;

	            if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
	                ev = document.createEvent('MouseEvents');
	                ev.initMouseEvent('click', true, true, e.view, 1,
	                    target.screenX, target.screenY, target.clientX, target.clientY,
	                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
	                    0, null);

	                ev._constructed = true;
	                target.dispatchEvent(ev);
	            }
	        };

	        return me;
	    })();

	    function IScroll (el, options) {
	        this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
	        this.scroller = this.wrapper.children[0];
	        this.scrollerStyle = this.scroller.style;       // cache style for better performance

	        this.options = {

	            resizeScrollbars: true,

	            mouseWheelSpeed: 20,

	            snapThreshold: 0.334,

	    // INSERT POINT: OPTIONS 

	            startX: 0,
	            startY: 0,
	            scrollY: true,
	            directionLockThreshold: 5,
	            momentum: true,

	            bounce: true,
	            bounceTime: 600,
	            bounceEasing: '',

	            preventDefault: true,
	            preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

	            HWCompositing: true,
	            useTransition: true,
	            useTransform: true
	        };

	        for ( var i in options ) {
	            this.options[i] = options[i];
	        }

	        // Normalize options
	        this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

	        this.options.useTransition = utils.hasTransition && this.options.useTransition;
	        this.options.useTransform = utils.hasTransform && this.options.useTransform;

	        this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
	        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

	        // If you want eventPassthrough I have to lock one of the axes
	        this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
	        this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

	        // With eventPassthrough we also need lockDirection mechanism
	        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
	        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

	        this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

	        this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

	        if ( this.options.tap === true ) {
	            this.options.tap = 'tap';
	        }

	        if ( this.options.shrinkScrollbars == 'scale' ) {
	            this.options.useTransition = false;
	        }

	        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

	    // INSERT POINT: NORMALIZATION

	        // Some defaults    
	        this.x = 0;
	        this.y = 0;
	        this.directionX = 0;
	        this.directionY = 0;
	        this._events = {};

	    // INSERT POINT: DEFAULTS

	        this._init();
	        this.refresh();

	        this.scrollTo(this.options.startX, this.options.startY);
	        this.enable();
	    }

	    IScroll.prototype = {
	        version: '5.1.3',

	        _init: function () {
	            this._initEvents();

	            if ( this.options.scrollbars || this.options.indicators ) {
	                this._initIndicators();
	            }

	            if ( this.options.mouseWheel ) {
	                this._initWheel();
	            }

	            if ( this.options.snap ) {
	                this._initSnap();
	            }

	            if ( this.options.keyBindings ) {
	                this._initKeys();
	            }

	    // INSERT POINT: _init

	        },

	        destroy: function () {
	            this._initEvents(true);

	            this._execEvent('destroy');
	        },

	        _transitionEnd: function (e) {
	            if ( e.target != this.scroller || !this.isInTransition ) {
	                return;
	            }

	            this._transitionTime();
	            if ( !this.resetPosition(this.options.bounceTime) ) {
	                this.isInTransition = false;
	                this._execEvent('scrollEnd');
	            }
	        },

	        _start: function (e) {
	            // React to left mouse button only
	            if ( utils.eventType[e.type] != 1 ) {
	                if ( e.button !== 0 ) {
	                    return;
	                }
	            }

	            if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
	                return;
	            }

	            if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
	                e.preventDefault();
	            }

	            var point = e.touches ? e.touches[0] : e,
	                pos;

	            this.initiated  = utils.eventType[e.type];
	            this.moved      = false;
	            this.distX      = 0;
	            this.distY      = 0;
	            this.directionX = 0;
	            this.directionY = 0;
	            this.directionLocked = 0;

	            this._transitionTime();

	            this.startTime = utils.getTime();

	            if ( this.options.useTransition && this.isInTransition ) {
	                this.isInTransition = false;
	                pos = this.getComputedPosition();
	                this._translate(Math.round(pos.x), Math.round(pos.y));
	                this._execEvent('scrollEnd');
	            } else if ( !this.options.useTransition && this.isAnimating ) {
	                this.isAnimating = false;
	                this._execEvent('scrollEnd');
	            }

	            this.startX    = this.x;
	            this.startY    = this.y;
	            this.absStartX = this.x;
	            this.absStartY = this.y;
	            this.pointX    = point.pageX;
	            this.pointY    = point.pageY;

	            this._execEvent('beforeScrollStart');
	        },

	        _move: function (e) {
	            if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
	                return;
	            }

	            if ( this.options.preventDefault ) {    // increases performance on Android? TODO: check!
	                e.preventDefault();
	            }

	            var point       = e.touches ? e.touches[0] : e,
	                deltaX      = point.pageX - this.pointX,
	                deltaY      = point.pageY - this.pointY,
	                timestamp   = utils.getTime(),
	                newX, newY,
	                absDistX, absDistY;

	            this.pointX     = point.pageX;
	            this.pointY     = point.pageY;

	            this.distX      += deltaX;
	            this.distY      += deltaY;
	            absDistX        = Math.abs(this.distX);
	            absDistY        = Math.abs(this.distY);

	            // We need to move at least 10 pixels for the scrolling to initiate
	            if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
	                return;
	            }

	            // If you are scrolling in one direction lock the other
	            if ( !this.directionLocked && !this.options.freeScroll ) {
	                if ( absDistX > absDistY + this.options.directionLockThreshold ) {
	                    this.directionLocked = 'h';     // lock horizontally
	                } else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
	                    this.directionLocked = 'v';     // lock vertically
	                } else {
	                    this.directionLocked = 'n';     // no lock
	                }
	            }

	            if ( this.directionLocked == 'h' ) {
	                if ( this.options.eventPassthrough == 'vertical' ) {
	                    e.preventDefault();
	                } else if ( this.options.eventPassthrough == 'horizontal' ) {
	                    this.initiated = false;
	                    return;
	                }

	                deltaY = 0;
	            } else if ( this.directionLocked == 'v' ) {
	                if ( this.options.eventPassthrough == 'horizontal' ) {
	                    e.preventDefault();
	                } else if ( this.options.eventPassthrough == 'vertical' ) {
	                    this.initiated = false;
	                    return;
	                }

	                deltaX = 0;
	            }

	            deltaX = this.hasHorizontalScroll ? deltaX : 0;
	            deltaY = this.hasVerticalScroll ? deltaY : 0;

	            newX = this.x + deltaX;
	            newY = this.y + deltaY;

	            // Slow down if outside of the boundaries
	            if ( newX > 0 || newX < this.maxScrollX ) {
	                newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
	            }
	            if ( newY > 0 || newY < this.maxScrollY ) {
	                newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
	            }

	            this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
	            this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

	            if ( !this.moved ) {
	                this._execEvent('scrollStart');
	            }

	            this.moved = true;

	            this._translate(newX, newY);

	    /* REPLACE START: _move */

	            if ( timestamp - this.startTime > 300 ) {
	                this.startTime = timestamp;
	                this.startX = this.x;
	                this.startY = this.y;
	            }

	    /* REPLACE END: _move */

	        },

	        _end: function (e) {
	            if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
	                return;
	            }

	            if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
	                e.preventDefault();
	            }

	            var point = e.changedTouches ? e.changedTouches[0] : e,
	                momentumX,
	                momentumY,
	                duration = utils.getTime() - this.startTime,
	                newX = Math.round(this.x),
	                newY = Math.round(this.y),
	                distanceX = Math.abs(newX - this.startX),
	                distanceY = Math.abs(newY - this.startY),
	                time = 0,
	                easing = '';

	            this.isInTransition = 0;
	            this.initiated = 0;
	            this.endTime = utils.getTime();

	            // reset if we are outside of the boundaries
	            if ( this.resetPosition(this.options.bounceTime) ) {
	                return;
	            }

	            this.scrollTo(newX, newY);  // ensures that the last position is rounded

	            // we scrolled less than 10 pixels
	            if ( !this.moved ) {
	                if ( this.options.tap ) {
	                    utils.tap(e, this.options.tap);
	                }

	                if ( this.options.click ) {
	                    utils.click(e);
	                }

	                this._execEvent('scrollCancel');
	                return;
	            }

	            if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
	                this._execEvent('flick');
	                return;
	            }

	            // start momentum animation if needed
	            if ( this.options.momentum && duration < 300 ) {
	                momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
	                momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
	                newX = momentumX.destination;
	                newY = momentumY.destination;
	                time = Math.max(momentumX.duration, momentumY.duration);
	                this.isInTransition = 1;
	            }


	            if ( this.options.snap ) {
	                var snap = this._nearestSnap(newX, newY);
	                this.currentPage = snap;
	                time = this.options.snapSpeed || Math.max(
	                        Math.max(
	                            Math.min(Math.abs(newX - snap.x), 1000),
	                            Math.min(Math.abs(newY - snap.y), 1000)
	                        ), 300);
	                newX = snap.x;
	                newY = snap.y;

	                this.directionX = 0;
	                this.directionY = 0;
	                easing = this.options.bounceEasing;
	            }

	    // INSERT POINT: _end

	            if ( newX != this.x || newY != this.y ) {
	                // change easing function when scroller goes out of the boundaries
	                if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
	                    easing = utils.ease.quadratic;
	                }

	                this.scrollTo(newX, newY, time, easing);
	                return;
	            }

	            this._execEvent('scrollEnd');
	        },

	        _resize: function () {
	            var that = this;

	            clearTimeout(this.resizeTimeout);

	            this.resizeTimeout = setTimeout(function () {
	                that.refresh();
	            }, this.options.resizePolling);
	        },

	        resetPosition: function (time) {
	            var x = this.x,
	                y = this.y;

	            time = time || 0;

	            if ( !this.hasHorizontalScroll || this.x > 0 ) {
	                x = 0;
	            } else if ( this.x < this.maxScrollX ) {
	                x = this.maxScrollX;
	            }

	            if ( !this.hasVerticalScroll || this.y > 0 ) {
	                y = 0;
	            } else if ( this.y < this.maxScrollY ) {
	                y = this.maxScrollY;
	            }

	            if ( x == this.x && y == this.y ) {
	                return false;
	            }

	            this.scrollTo(x, y, time, this.options.bounceEasing);

	            return true;
	        },

	        disable: function () {
	            this.enabled = false;
	        },

	        enable: function () {
	            this.enabled = true;
	        },

	        refresh: function () {
	            var rf = this.wrapper.offsetHeight;     // Force reflow

	            this.wrapperWidth   = this.wrapper.clientWidth;
	            this.wrapperHeight  = this.wrapper.clientHeight;

	    /* REPLACE START: refresh */

	            this.scrollerWidth  = this.scroller.offsetWidth;
	            this.scrollerHeight = this.scroller.offsetHeight;

	            this.maxScrollX     = this.wrapperWidth - this.scrollerWidth;
	            this.maxScrollY     = this.wrapperHeight - this.scrollerHeight;

	    /* REPLACE END: refresh */

	            this.hasHorizontalScroll    = this.options.scrollX && this.maxScrollX < 0;
	            this.hasVerticalScroll      = this.options.scrollY && this.maxScrollY < 0;

	            if ( !this.hasHorizontalScroll ) {
	                this.maxScrollX = 0;
	                this.scrollerWidth = this.wrapperWidth;
	            }

	            if ( !this.hasVerticalScroll ) {
	                this.maxScrollY = 0;
	                this.scrollerHeight = this.wrapperHeight;
	            }

	            this.endTime = 0;
	            this.directionX = 0;
	            this.directionY = 0;

	            this.wrapperOffset = utils.offset(this.wrapper);

	            this._execEvent('refresh');

	            this.resetPosition();

	    // INSERT POINT: _refresh

	        },

	        on: function (type, fn) {
	            if ( !this._events[type] ) {
	                this._events[type] = [];
	            }

	            this._events[type].push(fn);
	        },

	        off: function (type, fn) {
	            if ( !this._events[type] ) {
	                return;
	            }

	            var index = this._events[type].indexOf(fn);

	            if ( index > -1 ) {
	                this._events[type].splice(index, 1);
	            }
	        },

	        _execEvent: function (type) {
	            if ( !this._events[type] ) {
	                return;
	            }

	            var i = 0,
	                l = this._events[type].length;

	            if ( !l ) {
	                return;
	            }

	            for ( ; i < l; i++ ) {
	                this._events[type][i].apply(this, [].slice.call(arguments, 1));
	            }
	        },

	        scrollBy: function (x, y, time, easing) {
	            x = this.x + x;
	            y = this.y + y;
	            time = time || 0;

	            this.scrollTo(x, y, time, easing);
	        },

	        scrollTo: function (x, y, time, easing) {
	            easing = easing || utils.ease.circular;

	            this.isInTransition = this.options.useTransition && time > 0;

	            if ( !time || (this.options.useTransition && easing.style) ) {
	                this._transitionTimingFunction(easing.style);
	                this._transitionTime(time);
	                this._translate(x, y);
	            } else {
	                this._animate(x, y, time, easing.fn);
	            }
	        },

	        scrollToElement: function (el, time, offsetX, offsetY, easing) {
	            el = el.nodeType ? el : this.scroller.querySelector(el);

	            if ( !el ) {
	                return;
	            }

	            var pos = utils.offset(el);

	            pos.left -= this.wrapperOffset.left;
	            pos.top  -= this.wrapperOffset.top;

	            // if offsetX/Y are true we center the element to the screen
	            if ( offsetX === true ) {
	                offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
	            }
	            if ( offsetY === true ) {
	                offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
	            }

	            pos.left -= offsetX || 0;
	            pos.top  -= offsetY || 0;

	            pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
	            pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

	            time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

	            this.scrollTo(pos.left, pos.top, time, easing);
	        },

	        _transitionTime: function (time) {
	            time = time || 0;

	            this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

	            if ( !time && utils.isBadAndroid ) {
	                this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
	            }


	            if ( this.indicators ) {
	                for ( var i = this.indicators.length; i--; ) {
	                    this.indicators[i].transitionTime(time);
	                }
	            }


	    // INSERT POINT: _transitionTime

	        },

	        _transitionTimingFunction: function (easing) {
	            this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


	            if ( this.indicators ) {
	                for ( var i = this.indicators.length; i--; ) {
	                    this.indicators[i].transitionTimingFunction(easing);
	                }
	            }


	    // INSERT POINT: _transitionTimingFunction

	        },

	        _translate: function (x, y) {
	            if ( this.options.useTransform ) {

	    /* REPLACE START: _translate */

	                this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

	    /* REPLACE END: _translate */

	            } else {
	                x = Math.round(x);
	                y = Math.round(y);
	                this.scrollerStyle.left = x + 'px';
	                this.scrollerStyle.top = y + 'px';
	            }

	            this.x = x;
	            this.y = y;


	        if ( this.indicators ) {
	            for ( var i = this.indicators.length; i--; ) {
	                this.indicators[i].updatePosition();
	            }
	        }


	    // INSERT POINT: _translate

	        },

	        _initEvents: function (remove) {
	            var eventType = remove ? utils.removeEvent : utils.addEvent,
	                target = this.options.bindToWrapper ? this.wrapper : window;

	            eventType(window, 'orientationchange', this);
	            eventType(window, 'resize', this);

	            if ( this.options.click ) {
	                eventType(this.wrapper, 'click', this, true);
	            }

	            if ( !this.options.disableMouse ) {
	                eventType(this.wrapper, 'mousedown', this);
	                eventType(target, 'mousemove', this);
	                eventType(target, 'mousecancel', this);
	                eventType(target, 'mouseup', this);
	            }

	            if ( utils.hasPointer && !this.options.disablePointer ) {
	                eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
	                eventType(target, utils.prefixPointerEvent('pointermove'), this);
	                eventType(target, utils.prefixPointerEvent('pointercancel'), this);
	                eventType(target, utils.prefixPointerEvent('pointerup'), this);
	            }

	            if ( utils.hasTouch && !this.options.disableTouch ) {
	                eventType(this.wrapper, 'touchstart', this);
	                eventType(target, 'touchmove', this);
	                eventType(target, 'touchcancel', this);
	                eventType(target, 'touchend', this);
	            }

	            eventType(this.scroller, 'transitionend', this);
	            eventType(this.scroller, 'webkitTransitionEnd', this);
	            eventType(this.scroller, 'oTransitionEnd', this);
	            eventType(this.scroller, 'MSTransitionEnd', this);
	        },

	        getComputedPosition: function () {
	            var matrix = window.getComputedStyle(this.scroller, null),
	                x, y;

	            if ( this.options.useTransform ) {
	                matrix = matrix[utils.style.transform].split(')')[0].split(', ');
	                x = +(matrix[12] || matrix[4]);
	                y = +(matrix[13] || matrix[5]);
	            } else {
	                x = +matrix.left.replace(/[^-\d.]/g, '');
	                y = +matrix.top.replace(/[^-\d.]/g, '');
	            }

	            return { x: x, y: y };
	        },

	        _initIndicators: function () {
	            var interactive = this.options.interactiveScrollbars,
	                customStyle = typeof this.options.scrollbars != 'string',
	                indicators = [],
	                indicator;

	            var that = this;

	            this.indicators = [];

	            if ( this.options.scrollbars ) {
	                // Vertical scrollbar
	                if ( this.options.scrollY ) {
	                    indicator = {
	                        el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
	                        interactive: interactive,
	                        defaultScrollbars: true,
	                        customStyle: customStyle,
	                        resize: this.options.resizeScrollbars,
	                        shrink: this.options.shrinkScrollbars,
	                        fade: this.options.fadeScrollbars,
	                        listenX: false
	                    };

	                    this.wrapper.appendChild(indicator.el);
	                    indicators.push(indicator);
	                }

	                // Horizontal scrollbar
	                if ( this.options.scrollX ) {
	                    indicator = {
	                        el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
	                        interactive: interactive,
	                        defaultScrollbars: true,
	                        customStyle: customStyle,
	                        resize: this.options.resizeScrollbars,
	                        shrink: this.options.shrinkScrollbars,
	                        fade: this.options.fadeScrollbars,
	                        listenY: false
	                    };

	                    this.wrapper.appendChild(indicator.el);
	                    indicators.push(indicator);
	                }
	            }

	            if ( this.options.indicators ) {
	                // TODO: check concat compatibility
	                indicators = indicators.concat(this.options.indicators);
	            }

	            for ( var i = indicators.length; i--; ) {
	                this.indicators.push( new Indicator(this, indicators[i]) );
	            }

	            // TODO: check if we can use array.map (wide compatibility and performance issues)
	            function _indicatorsMap (fn) {
	                for ( var i = that.indicators.length; i--; ) {
	                    fn.call(that.indicators[i]);
	                }
	            }

	            if ( this.options.fadeScrollbars ) {
	                this.on('scrollEnd', function () {
	                    _indicatorsMap(function () {
	                        this.fade();
	                    });
	                });

	                this.on('scrollCancel', function () {
	                    _indicatorsMap(function () {
	                        this.fade();
	                    });
	                });

	                this.on('scrollStart', function () {
	                    _indicatorsMap(function () {
	                        this.fade(1);
	                    });
	                });

	                this.on('beforeScrollStart', function () {
	                    _indicatorsMap(function () {
	                        this.fade(1, true);
	                    });
	                });
	            }


	            this.on('refresh', function () {
	                _indicatorsMap(function () {
	                    this.refresh();
	                });
	            });

	            this.on('destroy', function () {
	                _indicatorsMap(function () {
	                    this.destroy();
	                });

	                delete this.indicators;
	            });
	        },

	        _initWheel: function () {
	            utils.addEvent(this.wrapper, 'wheel', this);
	            utils.addEvent(this.wrapper, 'mousewheel', this);
	            utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

	            this.on('destroy', function () {
	                utils.removeEvent(this.wrapper, 'wheel', this);
	                utils.removeEvent(this.wrapper, 'mousewheel', this);
	                utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
	            });
	        },

	        _wheel: function (e) {
	            if ( !this.enabled ) {
	                return;
	            }

	            e.preventDefault();
	            e.stopPropagation();

	            var wheelDeltaX, wheelDeltaY,
	                newX, newY,
	                that = this;

	            if ( this.wheelTimeout === undefined ) {
	                that._execEvent('scrollStart');
	            }

	            // Execute the scrollEnd event after 400ms the wheel stopped scrolling
	            clearTimeout(this.wheelTimeout);
	            this.wheelTimeout = setTimeout(function () {
	                that._execEvent('scrollEnd');
	                that.wheelTimeout = undefined;
	            }, 400);

	            if ( 'deltaX' in e ) {
	                if (e.deltaMode === 1) {
	                    wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
	                    wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
	                } else {
	                    wheelDeltaX = -e.deltaX;
	                    wheelDeltaY = -e.deltaY;
	                }
	            } else if ( 'wheelDeltaX' in e ) {
	                wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
	                wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
	            } else if ( 'wheelDelta' in e ) {
	                wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
	            } else if ( 'detail' in e ) {
	                wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
	            } else {
	                return;
	            }

	            wheelDeltaX *= this.options.invertWheelDirection;
	            wheelDeltaY *= this.options.invertWheelDirection;

	            if ( !this.hasVerticalScroll ) {
	                wheelDeltaX = wheelDeltaY;
	                wheelDeltaY = 0;
	            }

	            if ( this.options.snap ) {
	                newX = this.currentPage.pageX;
	                newY = this.currentPage.pageY;

	                if ( wheelDeltaX > 0 ) {
	                    newX--;
	                } else if ( wheelDeltaX < 0 ) {
	                    newX++;
	                }

	                if ( wheelDeltaY > 0 ) {
	                    newY--;
	                } else if ( wheelDeltaY < 0 ) {
	                    newY++;
	                }

	                this.goToPage(newX, newY);

	                return;
	            }

	            newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
	            newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

	            if ( newX > 0 ) {
	                newX = 0;
	            } else if ( newX < this.maxScrollX ) {
	                newX = this.maxScrollX;
	            }

	            if ( newY > 0 ) {
	                newY = 0;
	            } else if ( newY < this.maxScrollY ) {
	                newY = this.maxScrollY;
	            }

	            this.scrollTo(newX, newY, 0);

	    // INSERT POINT: _wheel
	        },

	        _initSnap: function () {
	            this.currentPage = {};

	            if ( typeof this.options.snap == 'string' ) {
	                this.options.snap = this.scroller.querySelectorAll(this.options.snap);
	            }

	            this.on('refresh', function () {
	                var i = 0, l,
	                    m = 0, n,
	                    cx, cy,
	                    x = 0, y,
	                    stepX = this.options.snapStepX || this.wrapperWidth,
	                    stepY = this.options.snapStepY || this.wrapperHeight,
	                    el;

	                this.pages = [];

	                if ( !this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight ) {
	                    return;
	                }

	                if ( this.options.snap === true ) {
	                    cx = Math.round( stepX / 2 );
	                    cy = Math.round( stepY / 2 );

	                    while ( x > -this.scrollerWidth ) {
	                        this.pages[i] = [];
	                        l = 0;
	                        y = 0;

	                        while ( y > -this.scrollerHeight ) {
	                            this.pages[i][l] = {
	                                x: Math.max(x, this.maxScrollX),
	                                y: Math.max(y, this.maxScrollY),
	                                width: stepX,
	                                height: stepY,
	                                cx: x - cx,
	                                cy: y - cy
	                            };

	                            y -= stepY;
	                            l++;
	                        }

	                        x -= stepX;
	                        i++;
	                    }
	                } else {
	                    el = this.options.snap;
	                    l = el.length;
	                    n = -1;

	                    for ( ; i < l; i++ ) {
	                        if ( i === 0 || el[i].offsetLeft <= el[i-1].offsetLeft ) {
	                            m = 0;
	                            n++;
	                        }

	                        if ( !this.pages[m] ) {
	                            this.pages[m] = [];
	                        }

	                        x = Math.max(-el[i].offsetLeft, this.maxScrollX);
	                        y = Math.max(-el[i].offsetTop, this.maxScrollY);
	                        cx = x - Math.round(el[i].offsetWidth / 2);
	                        cy = y - Math.round(el[i].offsetHeight / 2);

	                        this.pages[m][n] = {
	                            x: x,
	                            y: y,
	                            width: el[i].offsetWidth,
	                            height: el[i].offsetHeight,
	                            cx: cx,
	                            cy: cy
	                        };

	                        if ( x > this.maxScrollX ) {
	                            m++;
	                        }
	                    }
	                }

	                this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

	                // Update snap threshold if needed
	                if ( this.options.snapThreshold % 1 === 0 ) {
	                    this.snapThresholdX = this.options.snapThreshold;
	                    this.snapThresholdY = this.options.snapThreshold;
	                } else {
	                    this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
	                    this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
	                }
	            });

	            this.on('flick', function () {
	                var time = this.options.snapSpeed || Math.max(
	                        Math.max(
	                            Math.min(Math.abs(this.x - this.startX), 1000),
	                            Math.min(Math.abs(this.y - this.startY), 1000)
	                        ), 300);

	                this.goToPage(
	                    this.currentPage.pageX + this.directionX,
	                    this.currentPage.pageY + this.directionY,
	                    time
	                );
	            });
	        },

	        _nearestSnap: function (x, y) {
	            if ( !this.pages.length ) {
	                return { x: 0, y: 0, pageX: 0, pageY: 0 };
	            }

	            var i = 0,
	                l = this.pages.length,
	                m = 0;

	            // Check if we exceeded the snap threshold
	            if ( Math.abs(x - this.absStartX) < this.snapThresholdX &&
	                Math.abs(y - this.absStartY) < this.snapThresholdY ) {
	                return this.currentPage;
	            }

	            if ( x > 0 ) {
	                x = 0;
	            } else if ( x < this.maxScrollX ) {
	                x = this.maxScrollX;
	            }

	            if ( y > 0 ) {
	                y = 0;
	            } else if ( y < this.maxScrollY ) {
	                y = this.maxScrollY;
	            }

	            for ( ; i < l; i++ ) {
	                if ( x >= this.pages[i][0].cx ) {
	                    x = this.pages[i][0].x;
	                    break;
	                }
	            }

	            l = this.pages[i].length;

	            for ( ; m < l; m++ ) {
	                if ( y >= this.pages[0][m].cy ) {
	                    y = this.pages[0][m].y;
	                    break;
	                }
	            }

	            if ( i == this.currentPage.pageX ) {
	                i += this.directionX;

	                if ( i < 0 ) {
	                    i = 0;
	                } else if ( i >= this.pages.length ) {
	                    i = this.pages.length - 1;
	                }

	                x = this.pages[i][0].x;
	            }

	            if ( m == this.currentPage.pageY ) {
	                m += this.directionY;

	                if ( m < 0 ) {
	                    m = 0;
	                } else if ( m >= this.pages[0].length ) {
	                    m = this.pages[0].length - 1;
	                }

	                y = this.pages[0][m].y;
	            }

	            return {
	                x: x,
	                y: y,
	                pageX: i,
	                pageY: m
	            };
	        },

	        goToPage: function (x, y, time, easing) {
	            easing = easing || this.options.bounceEasing;

	            if ( x >= this.pages.length ) {
	                x = this.pages.length - 1;
	            } else if ( x < 0 ) {
	                x = 0;
	            }

	            if ( y >= this.pages[x].length ) {
	                y = this.pages[x].length - 1;
	            } else if ( y < 0 ) {
	                y = 0;
	            }

	            var posX = this.pages[x][y].x,
	                posY = this.pages[x][y].y;

	            time = time === undefined ? this.options.snapSpeed || Math.max(
	                Math.max(
	                    Math.min(Math.abs(posX - this.x), 1000),
	                    Math.min(Math.abs(posY - this.y), 1000)
	                ), 300) : time;

	            this.currentPage = {
	                x: posX,
	                y: posY,
	                pageX: x,
	                pageY: y
	            };

	            this.scrollTo(posX, posY, time, easing);
	        },

	        next: function (time, easing) {
	            var x = this.currentPage.pageX,
	                y = this.currentPage.pageY;

	            x++;

	            if ( x >= this.pages.length && this.hasVerticalScroll ) {
	                x = 0;
	                y++;
	            }

	            this.goToPage(x, y, time, easing);
	        },

	        prev: function (time, easing) {
	            var x = this.currentPage.pageX,
	                y = this.currentPage.pageY;

	            x--;

	            if ( x < 0 && this.hasVerticalScroll ) {
	                x = 0;
	                y--;
	            }

	            this.goToPage(x, y, time, easing);
	        },

	        _initKeys: function (e) {
	            // default key bindings
	            var keys = {
	                pageUp: 33,
	                pageDown: 34,
	                end: 35,
	                home: 36,
	                left: 37,
	                up: 38,
	                right: 39,
	                down: 40
	            };
	            var i;

	            // if you give me characters I give you keycode
	            if ( typeof this.options.keyBindings == 'object' ) {
	                for ( i in this.options.keyBindings ) {
	                    if ( typeof this.options.keyBindings[i] == 'string' ) {
	                        this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
	                    }
	                }
	            } else {
	                this.options.keyBindings = {};
	            }

	            for ( i in keys ) {
	                this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
	            }

	            utils.addEvent(window, 'keydown', this);

	            this.on('destroy', function () {
	                utils.removeEvent(window, 'keydown', this);
	            });
	        },

	        _key: function (e) {
	            if ( !this.enabled ) {
	                return;
	            }

	            var snap = this.options.snap,   // we are using this alot, better to cache it
	                newX = snap ? this.currentPage.pageX : this.x,
	                newY = snap ? this.currentPage.pageY : this.y,
	                now = utils.getTime(),
	                prevTime = this.keyTime || 0,
	                acceleration = 0.250,
	                pos;

	            if ( this.options.useTransition && this.isInTransition ) {
	                pos = this.getComputedPosition();

	                this._translate(Math.round(pos.x), Math.round(pos.y));
	                this.isInTransition = false;
	            }

	            this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

	            switch ( e.keyCode ) {
	                case this.options.keyBindings.pageUp:
	                    if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
	                        newX += snap ? 1 : this.wrapperWidth;
	                    } else {
	                        newY += snap ? 1 : this.wrapperHeight;
	                    }
	                    break;
	                case this.options.keyBindings.pageDown:
	                    if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
	                        newX -= snap ? 1 : this.wrapperWidth;
	                    } else {
	                        newY -= snap ? 1 : this.wrapperHeight;
	                    }
	                    break;
	                case this.options.keyBindings.end:
	                    newX = snap ? this.pages.length-1 : this.maxScrollX;
	                    newY = snap ? this.pages[0].length-1 : this.maxScrollY;
	                    break;
	                case this.options.keyBindings.home:
	                    newX = 0;
	                    newY = 0;
	                    break;
	                case this.options.keyBindings.left:
	                    newX += snap ? -1 : 5 + this.keyAcceleration>>0;
	                    break;
	                case this.options.keyBindings.up:
	                    newY += snap ? 1 : 5 + this.keyAcceleration>>0;
	                    break;
	                case this.options.keyBindings.right:
	                    newX -= snap ? -1 : 5 + this.keyAcceleration>>0;
	                    break;
	                case this.options.keyBindings.down:
	                    newY -= snap ? 1 : 5 + this.keyAcceleration>>0;
	                    break;
	                default:
	                    return;
	            }

	            if ( snap ) {
	                this.goToPage(newX, newY);
	                return;
	            }

	            if ( newX > 0 ) {
	                newX = 0;
	                this.keyAcceleration = 0;
	            } else if ( newX < this.maxScrollX ) {
	                newX = this.maxScrollX;
	                this.keyAcceleration = 0;
	            }

	            if ( newY > 0 ) {
	                newY = 0;
	                this.keyAcceleration = 0;
	            } else if ( newY < this.maxScrollY ) {
	                newY = this.maxScrollY;
	                this.keyAcceleration = 0;
	            }

	            this.scrollTo(newX, newY, 0);

	            this.keyTime = now;
	        },

	        _animate: function (destX, destY, duration, easingFn) {
	            var that = this,
	                startX = this.x,
	                startY = this.y,
	                startTime = utils.getTime(),
	                destTime = startTime + duration;

	            function step () {
	                var now = utils.getTime(),
	                    newX, newY,
	                    easing;

	                if ( now >= destTime ) {
	                    that.isAnimating = false;
	                    that._translate(destX, destY);

	                    if ( !that.resetPosition(that.options.bounceTime) ) {
	                        that._execEvent('scrollEnd');
	                    }

	                    return;
	                }

	                now = ( now - startTime ) / duration;
	                easing = easingFn(now);
	                newX = ( destX - startX ) * easing + startX;
	                newY = ( destY - startY ) * easing + startY;
	                that._translate(newX, newY);

	                if ( that.isAnimating ) {
	                    rAF(step);
	                }
	            }

	            this.isAnimating = true;
	            step();
	        },
	        handleEvent: function (e) {
	            switch ( e.type ) {
	                case 'touchstart':
	                case 'pointerdown':
	                case 'MSPointerDown':
	                case 'mousedown':
	                    this._start(e);
	                    break;
	                case 'touchmove':
	                case 'pointermove':
	                case 'MSPointerMove':
	                case 'mousemove':
	                    this._move(e);
	                    break;
	                case 'touchend':
	                case 'pointerup':
	                case 'MSPointerUp':
	                case 'mouseup':
	                case 'touchcancel':
	                case 'pointercancel':
	                case 'MSPointerCancel':
	                case 'mousecancel':
	                    this._end(e);
	                    break;
	                case 'orientationchange':
	                case 'resize':
	                    this._resize();
	                    break;
	                case 'transitionend':
	                case 'webkitTransitionEnd':
	                case 'oTransitionEnd':
	                case 'MSTransitionEnd':
	                    this._transitionEnd(e);
	                    break;
	                case 'wheel':
	                case 'DOMMouseScroll':
	                case 'mousewheel':
	                    this._wheel(e);
	                    break;
	                case 'keydown':
	                    this._key(e);
	                    break;
	                case 'click':
	                    if ( !e._constructed ) {
	                        e.preventDefault();
	                        e.stopPropagation();
	                    }
	                    break;
	            }
	        }
	    };
	    function createDefaultScrollbar (direction, interactive, type) {
	        var scrollbar = document.createElement('div'),
	            indicator = document.createElement('div');

	        if ( type === true ) {
	            scrollbar.style.cssText = 'position:absolute;z-index:9999';
	            indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border-radius:3px';
	        }

	        indicator.className = 'iScrollIndicator';

	        if ( direction == 'h' ) {
	            if ( type === true ) {
	                scrollbar.style.cssText += ';height:4px;left:2px;right:2px;bottom:0';
	                indicator.style.height = '100%';
	            }
	            scrollbar.className = 'iScrollHorizontalScrollbar';
	        } else {
	            if ( type === true ) {
	                scrollbar.style.cssText += ';width:4px;bottom:2px;top:2px;right:1px';
	                indicator.style.width = '100%';
	            }
	            scrollbar.className = 'iScrollVerticalScrollbar';
	        }

	        scrollbar.style.cssText += ';overflow:hidden';

	        if ( !interactive ) {
	            scrollbar.style.pointerEvents = 'none';
	        }

	        scrollbar.appendChild(indicator);

	        return scrollbar;
	    }

	    function Indicator (scroller, options) {
	        this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
	        this.wrapperStyle = this.wrapper.style;
	        this.indicator = this.wrapper.children[0];
	        this.indicatorStyle = this.indicator.style;
	        this.scroller = scroller;

	        this.options = {
	            listenX: true,
	            listenY: true,
	            interactive: false,
	            resize: true,
	            defaultScrollbars: false,
	            shrink: false,
	            fade: false,
	            speedRatioX: 0,
	            speedRatioY: 0
	        };

	        for ( var i in options ) {
	            this.options[i] = options[i];
	        }

	        this.sizeRatioX = 1;
	        this.sizeRatioY = 1;
	        this.maxPosX = 0;
	        this.maxPosY = 0;

	        if ( this.options.interactive ) {
	            if ( !this.options.disableTouch ) {
	                utils.addEvent(this.indicator, 'touchstart', this);
	                utils.addEvent(window, 'touchend', this);
	            }
	            if ( !this.options.disablePointer ) {
	                utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
	                utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
	            }
	            if ( !this.options.disableMouse ) {
	                utils.addEvent(this.indicator, 'mousedown', this);
	                utils.addEvent(window, 'mouseup', this);
	            }
	        }

	        if ( this.options.fade ) {
	            this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
	            this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
	            this.wrapperStyle.opacity = '0';
	        }
	    }

	    Indicator.prototype = {
	        handleEvent: function (e) {
	            switch ( e.type ) {
	                case 'touchstart':
	                case 'pointerdown':
	                case 'MSPointerDown':
	                case 'mousedown':
	                    this._start(e);
	                    break;
	                case 'touchmove':
	                case 'pointermove':
	                case 'MSPointerMove':
	                case 'mousemove':
	                    this._move(e);
	                    break;
	                case 'touchend':
	                case 'pointerup':
	                case 'MSPointerUp':
	                case 'mouseup':
	                case 'touchcancel':
	                case 'pointercancel':
	                case 'MSPointerCancel':
	                case 'mousecancel':
	                    this._end(e);
	                    break;
	            }
	        },

	        destroy: function () {
	            if ( this.options.interactive ) {
	                utils.removeEvent(this.indicator, 'touchstart', this);
	                utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
	                utils.removeEvent(this.indicator, 'mousedown', this);

	                utils.removeEvent(window, 'touchmove', this);
	                utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
	                utils.removeEvent(window, 'mousemove', this);

	                utils.removeEvent(window, 'touchend', this);
	                utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
	                utils.removeEvent(window, 'mouseup', this);
	            }

	            if ( this.options.defaultScrollbars ) {
	                this.wrapper.parentNode.removeChild(this.wrapper);
	            }
	        },

	        _start: function (e) {
	            var point = e.touches ? e.touches[0] : e;

	            e.preventDefault();
	            e.stopPropagation();

	            this.transitionTime();

	            this.initiated = true;
	            this.moved = false;
	            this.lastPointX = point.pageX;
	            this.lastPointY = point.pageY;

	            this.startTime  = utils.getTime();

	            if ( !this.options.disableTouch ) {
	                utils.addEvent(window, 'touchmove', this);
	            }
	            if ( !this.options.disablePointer ) {
	                utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
	            }
	            if ( !this.options.disableMouse ) {
	                utils.addEvent(window, 'mousemove', this);
	            }

	            this.scroller._execEvent('beforeScrollStart');
	        },

	        _move: function (e) {
	            var point = e.touches ? e.touches[0] : e,
	                deltaX, deltaY,
	                newX, newY,
	                timestamp = utils.getTime();

	            if ( !this.moved ) {
	                this.scroller._execEvent('scrollStart');
	            }

	            this.moved = true;

	            deltaX = point.pageX - this.lastPointX;
	            this.lastPointX = point.pageX;

	            deltaY = point.pageY - this.lastPointY;
	            this.lastPointY = point.pageY;

	            newX = this.x + deltaX;
	            newY = this.y + deltaY;

	            this._pos(newX, newY);

	    // INSERT POINT: indicator._move

	            e.preventDefault();
	            e.stopPropagation();
	        },

	        _end: function (e) {
	            if ( !this.initiated ) {
	                return;
	            }

	            this.initiated = false;

	            e.preventDefault();
	            e.stopPropagation();

	            utils.removeEvent(window, 'touchmove', this);
	            utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
	            utils.removeEvent(window, 'mousemove', this);

	            if ( this.scroller.options.snap ) {
	                var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

	                var time = this.options.snapSpeed || Math.max(
	                        Math.max(
	                            Math.min(Math.abs(this.scroller.x - snap.x), 1000),
	                            Math.min(Math.abs(this.scroller.y - snap.y), 1000)
	                        ), 300);

	                if ( this.scroller.x != snap.x || this.scroller.y != snap.y ) {
	                    this.scroller.directionX = 0;
	                    this.scroller.directionY = 0;
	                    this.scroller.currentPage = snap;
	                    this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
	                }
	            }

	            if ( this.moved ) {
	                this.scroller._execEvent('scrollEnd');
	            }
	        },

	        transitionTime: function (time) {
	            time = time || 0;
	            this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

	            if ( !time && utils.isBadAndroid ) {
	                this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
	            }
	        },

	        transitionTimingFunction: function (easing) {
	            this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
	        },

	        refresh: function () {
	            this.transitionTime();

	            if ( this.options.listenX && !this.options.listenY ) {
	                this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
	            } else if ( this.options.listenY && !this.options.listenX ) {
	                this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
	            } else {
	                this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
	            }

	            if ( this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ) {
	                utils.addClass(this.wrapper, 'iScrollBothScrollbars');
	                utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

	                if ( this.options.defaultScrollbars && this.options.customStyle ) {
	                    if ( this.options.listenX ) {
	                        this.wrapper.style.right = '8px';
	                    } else {
	                        this.wrapper.style.bottom = '8px';
	                    }
	                }
	            } else {
	                utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
	                utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

	                if ( this.options.defaultScrollbars && this.options.customStyle ) {
	                    if ( this.options.listenX ) {
	                        this.wrapper.style.right = '2px';
	                    } else {
	                        this.wrapper.style.bottom = '2px';
	                    }
	                }
	            }

	            var r = this.wrapper.offsetHeight;  // force refresh

	            if ( this.options.listenX ) {
	                this.wrapperWidth = this.wrapper.clientWidth;
	                if ( this.options.resize ) {
	                    this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
	                    this.indicatorStyle.width = this.indicatorWidth + 'px';
	                } else {
	                    this.indicatorWidth = this.indicator.clientWidth;
	                }

	                this.maxPosX = this.wrapperWidth - this.indicatorWidth;

	                if ( this.options.shrink == 'clip' ) {
	                    this.minBoundaryX = -this.indicatorWidth + 8;
	                    this.maxBoundaryX = this.wrapperWidth - 8;
	                } else {
	                    this.minBoundaryX = 0;
	                    this.maxBoundaryX = this.maxPosX;
	                }

	                this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));  
	            }

	            if ( this.options.listenY ) {
	                this.wrapperHeight = this.wrapper.clientHeight;
	                if ( this.options.resize ) {
	                    this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
	                    this.indicatorStyle.height = this.indicatorHeight + 'px';
	                } else {
	                    this.indicatorHeight = this.indicator.clientHeight;
	                }

	                this.maxPosY = this.wrapperHeight - this.indicatorHeight;

	                if ( this.options.shrink == 'clip' ) {
	                    this.minBoundaryY = -this.indicatorHeight + 8;
	                    this.maxBoundaryY = this.wrapperHeight - 8;
	                } else {
	                    this.minBoundaryY = 0;
	                    this.maxBoundaryY = this.maxPosY;
	                }

	                this.maxPosY = this.wrapperHeight - this.indicatorHeight;
	                this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
	            }

	            this.updatePosition();
	        },

	        updatePosition: function () {
	            var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
	                y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

	            if ( !this.options.ignoreBoundaries ) {
	                if ( x < this.minBoundaryX ) {
	                    if ( this.options.shrink == 'scale' ) {
	                        this.width = Math.max(this.indicatorWidth + x, 8);
	                        this.indicatorStyle.width = this.width + 'px';
	                    }
	                    x = this.minBoundaryX;
	                } else if ( x > this.maxBoundaryX ) {
	                    if ( this.options.shrink == 'scale' ) {
	                        this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
	                        this.indicatorStyle.width = this.width + 'px';
	                        x = this.maxPosX + this.indicatorWidth - this.width;
	                    } else {
	                        x = this.maxBoundaryX;
	                    }
	                } else if ( this.options.shrink == 'scale' && this.width != this.indicatorWidth ) {
	                    this.width = this.indicatorWidth;
	                    this.indicatorStyle.width = this.width + 'px';
	                }

	                if ( y < this.minBoundaryY ) {
	                    if ( this.options.shrink == 'scale' ) {
	                        this.height = Math.max(this.indicatorHeight + y * 3, 8);
	                        this.indicatorStyle.height = this.height + 'px';
	                    }
	                    y = this.minBoundaryY;
	                } else if ( y > this.maxBoundaryY ) {
	                    if ( this.options.shrink == 'scale' ) {
	                        this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
	                        this.indicatorStyle.height = this.height + 'px';
	                        y = this.maxPosY + this.indicatorHeight - this.height;
	                    } else {
	                        y = this.maxBoundaryY;
	                    }
	                } else if ( this.options.shrink == 'scale' && this.height != this.indicatorHeight ) {
	                    this.height = this.indicatorHeight;
	                    this.indicatorStyle.height = this.height + 'px';
	                }
	            }

	            this.x = x;
	            this.y = y;

	            if ( this.scroller.options.useTransform ) {
	                this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
	            } else {
	                this.indicatorStyle.left = x + 'px';
	                this.indicatorStyle.top = y + 'px';
	            }
	        },

	        _pos: function (x, y) {
	            if ( x < 0 ) {
	                x = 0;
	            } else if ( x > this.maxPosX ) {
	                x = this.maxPosX;
	            }

	            if ( y < 0 ) {
	                y = 0;
	            } else if ( y > this.maxPosY ) {
	                y = this.maxPosY;
	            }

	            x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
	            y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

	            this.scroller.scrollTo(x, y);
	        },

	        fade: function (val, hold) {
	            if ( hold && !this.visible ) {
	                return;
	            }

	            clearTimeout(this.fadeTimeout);
	            this.fadeTimeout = null;

	            var time = val ? 250 : 500,
	                delay = val ? 0 : 300;

	            val = val ? '1' : '0';

	            this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

	            this.fadeTimeout = setTimeout((function (val) {
	                this.wrapperStyle.opacity = val;
	                this.visible = +val;
	            }).bind(this, val), delay);
	        }
	    };

	    IScroll.utils = utils;

	    /* !!! 原文件修改处 */
	    return function(el, option) {
	        return new IScroll(el, option);
	    }    
	})(window, document, Math);

	/* 尝试绑定方法到 magic 框架的全局对象上 */
	if ($ && $.fn && !$.fn.scroll) {
	    $.fn.extend({scroll: function(option) {
	        option = $.extend({
	            bindToWrapper: true,
	            scrollbars: true,
	            fadeScrollbars: true
	        }, option);

	        this.data("ui_scroll", new scroll(this[0], option));
	        return this.data("ui_scroll");
	    }})
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(14);

	module.exports = (function() {
	    var Slider = function(el, options) {
	        this.el         = $(el);
	        this.handle     = null;
	        this.pageWidth  = 0;
	        this.pageHeight = 0;
	        this.pageIndex  = 0;
	        this.pageLength = 0;
	        this.options    = $.extend({}, Slider.DEFAULT, options, true);
	        this.timeHandle = null;
	        this.__render   = null;
	    }

	    Slider.DEFAULT = {
	        autoPlay: true,
	        time: 4000,
	        indicator: true,
	        describe: false,
	        scale: false
	    }

	    Slider.prototype.init = function() {
	        var that = this, opt = that.options,
	                   html, childs, scroll;

	        html = "<div class='slider_scroll'>"
	               + that.el.html() + "</div>";
	        that.el.html(html); // 重新设置内容

	        scroll = that.el.find(".slider_scroll");
	        childs = scroll.query(".slider-item");

	        this.__render = $(childs[0]).render(function() {
	            that.pageWidth  = $(childs[0]).width();
	            if (opt.scale) {
	                scroll.height(that.pageWidth*opt.scale);
	            }
	            that.pageLength = childs.length;
	            scroll.width(that.pageWidth*childs.length);
	            for(var i=0; i<childs.length; i++) {
	                var style = childs[i].style;
	                style.width = that.pageWidth+"px";
	            }
	            scroll.addClass("hasInit");

	            // 初始化组件滚动效果
	            that.handle = that.el.scroll({
	                scrollX: true,
	                scrollY: false,
	                momentum: false,
	                snap: true,
	                snapSpeed: 600,
	                scrollbars: false
	            });
	            that._initPlay();
	        })

	        that.el.on("touchstart", function() {
	            clearInterval(that.timeHandle);
	        })

	        that.el.on("touchend", function() {
	            that._initPlay();   // 初始化播放

	            // 更新当前 slide 停止的页面索引
	            var pageX = that.handle.x * -1;
	            that.pageIndex = pageX/that.pageWidth;
	        })

	        return this;
	    };

	    Slider.prototype._initPlay = function() {
	        if (this.pageWidth > 0) {
	            var that = this, opt = that.options;

	            clearInterval(that.timeHandle);
	            if (opt.autoPlay && opt.time) {
	                that.timeHandle = setInterval(function() {
	                    that.next();    // 自动播放下一个
	                }, opt.time)
	            }
	        }
	        
	        return this;
	    }

	    Slider.prototype.next = function() {
	        return this.go(this.pageIndex+1);
	    };

	    Slider.prototype.prev = function() {
	        return this.go(this.pageIndex-1);
	    };

	    Slider.prototype.go = function(index) {
	        // 只有内容真正载入的时候，才自动播放，以避免报错
	        if (this.pageWidth > 0) {
	            var len = this.pageLength-1, now;

	            if (index == undefined) {
	                index = this.pageIndex + 1;
	            };

	            index = index < 0 ? len : (index > len ? 0 : index);
	            this.handle.goToPage(index, 0);     // 滚动到对应页面
	            this.pageIndex = index;             // 更新当前索引
	        }
	            
	        return this;
	    };

	    Slider.prototype.destroy = function() {
	        clearInterval(this.__render);
	        clearInterval(this.timeHandle);
	        this.options = null;
	    }


	    if ($ && $.fn && !$.fn.slider) {
	        $.fn.extend({slider: function(option) {
	            return new Slider(this[0], option).init();
	        }})
	    };
	})();

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(15);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(17)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/sass-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/sass-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(16)();
	exports.push([module.id, "mg-slider, .slider {\n  width: 100%;\n  font-size: 0;\n  overflow: hidden; }\n  mg-slider .slider_scroll, .slider .slider_scroll {\n    font-size: 0em;\n    display: inline;\n    height: 100%;\n    white-space: nowrap; }\n    mg-slider .slider_scroll.hasInit, .slider .slider_scroll.hasInit {\n      display: block; }\n    mg-slider .slider_scroll .slider-item, .slider .slider_scroll .slider-item {\n      display: inline-block; }\n  mg-slider .slider-item, .slider .slider-item {\n    display: none;\n    width: 100%; }\n    mg-slider .slider-item:first-child, .slider .slider-item:first-child {\n      display: inline-block; }\n    mg-slider .slider-item img, .slider .slider-item img {\n      width: 100%; }\n", ""]);

/***/ },
/* 16 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(19);

	module.exports = (function() {
	    var Modal = function(element, option) {
	        this.el      = $(element);
	        this.isHide  = false;
	        this.option  = $.extend({}, Modal.DEFAULT, option, true);
	    };

	    Modal.DEFAULT = {
	        align: "bottom",
	        autoHide: true,
	        hasInsert: false
	    }

	    Modal.prototype.init = function() {
	        var mid = "modal_"+$.getRandom(), html, opt = this.option;

	        if (opt.hasInsert /* 已插入页面直接处理 */) {
	            this.el.attr("id", mid);
	            this.el.addClass("hideOut");
	        } else {
	            html  = "<div class='modal hideOut' id='"+mid+"'>";
	            this.el.addClass("modal_body");
	            html += this.el[0].outerHTML+"</div>";
	            $("body").append(html);     // 添加到页面中
	            this.el.remove();           // 旧元素从页面删除 
	        }
	        
	        this.el = $("#"+mid);      //  获得对象的句柄
	        this.el.addClass("align"+opt.align.toUpFirst());

	        if (opt.autoHide /* 绑定默认关闭方法 */) {
	            var that = this, ele = this.el[0];
	            that.el.on("touchend", function(event) {
	                if (event.target == ele) {
	                    that.hide();    // 隐藏自己
	                    event.stopPropagation();
	                }
	            })
	        }

	        if (this.el.hasClass("hideOut")) {
	            this.isHide = true; // 设置隐藏状态
	        }

	        return this;
	    };

	    Modal.prototype.show = function(anim) {
	        var scroll = this.el.data("ui_scroll");
	        if (scroll) scroll.scrollTo(0, 0);

	        this.isHide = false;
	        this.el.removeClass("hideOut").addClass("showIn");
	        
	        return this;
	    };

	    Modal.prototype.hide = function(anim) {
	        this.isHide = true;
	        this.el.removeClass("showIn").addClass("hideOut");
	        return this;
	    };

	    Modal.prototype.toggle = function() {
	        return this.isHide ? this.show(): this.hide();
	    };

	    Modal.prototype.destroy = function() {
	        this.el.remove();   // 删除自身
	    };

	    /* 尝试绑定方法到 magic 框架的全局对象上 */
	    if ($ && !$.modal) {
	        $.extend({modal: function(element, option) {
	            return new Modal(element, option).init();
	        }});
	    };

	    if ($ && $.fn && !$.fn.modal) {
	        $.fn.extend({modal: function(option) {
	            var opt = $.extend({}, option);
	            opt.hasInsert = true;
	            return new Modal(this[0], opt).init();
	        }});
	    };
	})();

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(20);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(17)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/sass-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/sass-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(16)();
	exports.push([module.id, ".modal {\n  position: fixed;\n  display: none;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.6);\n  z-index: 99; }\n  .modal .modal_body {\n    width: 100%;\n    display: block;\n    position: absolute;\n    background: #FFF; }\n  .modal.alignTop .modal_body {\n    top: 0; }\n  .modal.alignBottom .modal_body {\n    bottom: 0; }\n  .modal.alignCenter .modal_body {\n    width: auto;\n    max-width: 80%;\n    min-width: 60%;\n    max-height: 70%;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate(-50%, -50%);\n    -ms-transform: translate(-50%, -50%);\n    transform: translate(-50%, -50%); }\n  .modal.showIn {\n    display: block;\n    -webkit-animation-name: slideInUp;\n    animation-name: slideInUp;\n    -webkit-animation-duration: 0.3s;\n    animation-duration: 0.3s; }\n  .modal.hideOut {\n    display: none;\n    -webkit-animation-name: slideOutDown;\n    animation-name: slideOutDown;\n    -webkit-animation-duration: 0.3s;\n    animation-duration: 0.3s; }\n\n@-webkit-keyframes slideInUp {\n  0% {\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n    visibility: visible; }\n  100% {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n@keyframes slideInUp {\n  0% {\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n    visibility: visible; }\n  100% {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); } }\n\n@-webkit-keyframes slideOutDown {\n  0% {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  100% {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0); } }\n\n@keyframes slideOutDown {\n  0% {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0); }\n  100% {\n    visibility: hidden;\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0); } }\n", ""]);

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(22);

	module.exports = (function() {
	    var Tip = function(text, options) {
	        this.text        = text || '';
	        this.handle      = null;
	        this.textHandle  = null;
	        this.backHandle  = null;
	        this.spinHandle  = null;
	        this.backStyle   = "";

	        this.delayHandle = null;
	        this.hideHandle  = null;
	        this.options = $.extend({}, Tip.DEFAULT, options, true);
	    }

	    Tip.DEFAULT = {
	        type     : 'toast',
	        back     : false,
	        shortTime: 300,            // 默认设置的两个时间
	        longTime : 800,
	        show     : 1400,           // 默认显示时间
	        live     : false,          // 是否永久显示
	        delay    : 0               // 默认延迟显示时间
	    }

	    // 转换字符串为具体的时间值
	    Tip.fixTime = function (opt, key) {
	        if (typeof opt[key] == "string") {
	            var key = opt.delay + "Time",
	                def = Tip.DEFAULT[key];

	            opt[key] = def ? def : opt[key];
	        }
	        opt[key] = parseInt(opt[key]) || 0;
	    }

	    // 清楚对象上的延时操作
	    Tip.clearHandle = function(obj) {
	        clearTimeout(obj.delayHandle);
	        clearTimeout(obj.hideHandle);
	    }

	    Tip.prototype.init = function() {
	        var opt = this.options, html, cls;
	        cls  = "tip_"+$.getRandom();
	        html = "<div class='tip hide has-back' id='"+cls+"'>"
	                + "<div class='tip-show'>"+this.text+"</div>"
	                + "<div class='tip-back'></div></div>";

	        $("body").append(html);     // 添加到页面中
	        this.handle = $("#"+cls);
	        this.textHandle = this.handle.find(".tip-show");
	        this.backHandle = this.handle.find(".tip-back");

	        if (opt.type == "loading") {
	            opt.live = true; // loading 类型一直显示
	        }

	        // 将默认背景色存储下来，用于后续显示默认背景色
	        this.backStyle = this.backHandle.css("background-color");

	        return this;
	    };

	    
	    Tip.prototype.show = function(text, option) {
	        var opt, that = this;   // 定义局部变量

	        // 尝试当只有一个参数且为对象时修正参数
	        if (option === undefined && typeof text == 'object') {
	            option = text;  text = undefined;       // 修正变量
	        }

	        opt = $.extend({}, that.options, option, true);   // 合并选项

	        Tip.fixTime(opt, "delay");      // 转换延时时间值
	        Tip.fixTime(opt, "show");       // 转换显示时间值
	        Tip.clearHandle(this);          // 清除可能的延时动作

	        this.delayHandle = setTimeout(function() {
	            if (opt.back !== false /* 是否显示背景 */) {
	                if (typeof opt.back == "string") {
	                    that.backHandle.css("background-color", opt.back)
	                } else {
	                    this.backHandle.css("background-color", that.backStyle);
	                }
	                
	                that.handle.addClass("has-back");
	            } else {
	                that.handle.removeClass("has-back");
	            }

	            that.handle.toggleClass("has-loading", opt.type == 'loading');
	            if (typeof text == "string") that.textHandle.html(text);
	            if (that.options.type == "loading") {
	                that.spinHandle = that.textHandle.spinner({
	                    color: "#FFF"
	                });
	            }
	            that.handle.removeClass("hide").addClass("show");
	        }, opt.delay);

	        if (!opt.live && opt.show > 0) {
	            that.hideHandle = setTimeout(function() {
	                that.hide();
	            }, opt.delay + opt.show);
	        }

	        return this;
	    };

	    Tip.prototype.hide = function() {
	        Tip.clearHandle(this);          // 清除可能的延时动作
	        this.handle.removeClass("show").addClass("hide");
	        if (this.options.type == "loading") {
	            var span = this.spinHandle;
	            span && span.stop();
	        }

	        return this;
	    };

	    Tip.prototype.destroy = function() {
	        this.handle.remove();
	        if (this.options.type == "loading") {
	            var span = this.spinHandle;
	            span && span.stop();
	        }
	    };

	    /* 尝试绑定方法到 magic 框架的全局对象上 */
	    if ($ && !$.tip) {
	        $.extend({tip: function(text, option) {
	            return new Tip(text, option).init();
	        }})
	    };
	})();

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(23);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(17)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/sass-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/sass-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(16)();
	exports.push([module.id, ".tip {\n  position: fixed;\n  z-index: 99;\n  display: none; }\n  .tip .tip-show {\n    z-index: 1;\n    color: #FFF;\n    position: fixed;\n    white-space: nowrap;\n    text-align: center;\n    background-color: rgba(0, 0, 0, 0.65);\n    padding: 14px 16px;\n    top: 50%;\n    left: 50%;\n    border-radius: 6px;\n    -webkit-transform: translate(-50%, -50%);\n    -ms-transform: translate(-50%, -50%);\n    transform: translate(-50%, -50%); }\n  .tip .tip-back {\n    display: none;\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background-color: rgba(0, 0, 0, 0.65); }\n  .tip.has-back .tip-back {\n    display: block; }\n  .tip.has-loading .tip-back {\n    display: block;\n    background-color: transparent; }\n  .tip.has-loading .tip-show {\n    width: 74px;\n    height: 74px;\n    background-color: rgba(0, 0, 0, 0.78); }\n  .tip.show {\n    display: block;\n    -webkit-animation-name: fadeIn;\n    animation-name: fadeIn;\n    -webkit-animation-duration: 0.3s;\n    animation-duration: 0.3s; }\n  .tip.hide {\n    display: none;\n    -webkit-animation-name: fadeOut;\n    animation-name: fadeOut;\n    -webkit-animation-duration: 0.3s;\n    animation-duration: 0.3s; }\n\n@-webkit-keyframes fadeIn {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes fadeIn {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@-webkit-keyframes fadeOut {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@keyframes fadeOut {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@-webkit-keyframes rotate {\n  from {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  to {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n@keyframes rotate {\n  from {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg); }\n  to {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n", ""]);

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(25);

	module.exports = (function() {
	    var Confirm = function(el, options) {
	        this.el      = $(el);
	        this.isHide  = '';
	        this.__modal = null;
	        this.options = $.extend({}, Confirm.DEFAULT, options, true);
	    };

	    Confirm.DEFAULT = {
	        cancel : null,
	        cancelHide: true,
	        confirm: null,
	        confirmHide: true,
	        autoHide: false,
	        align: "center"
	    };

	    Confirm.prototype.init = function() {
	        var that = this, opt = that.options, act;

	        // 调用底层Modal组件来创建底层
	        that.__modal = $.modal(that.el, opt);   

	        that.el = that.__modal.el;

	        that.el.children().addClass("confirm");
	        // 尝试绑定确认动作到按钮上
	        act = that.el.find("[role='confirm']");
	        if (act.length > 0) {
	            act.on("tap", function() {
	                var ret = true;     // 初始默认返回为真
	                if (typeof opt.confirm == "function") {
	                    ret = opt.confirm();   // 调用确认回调
	                }
	                if (opt.confirmHide && ret !== false) {
	                    that.hide();    // 确认动作后自动隐藏窗口
	                }
	            })
	        }
	        // 尝试绑定取消动作到按钮上
	        act = that.el.find("[role='cancel']");
	        if (act.length > 0) {
	            act.on("tap", function(event) {
	                var ret = true;     // 初始默认返回为真
	                if (typeof opt.cancel == "function") {
	                    ret = opt.cancel();   // 调用取消回调
	                }
	                if (opt.cancelHide && ret !== false) {
	                    that.hide();    // 取消动作后自动隐藏窗口
	                }
	            })
	        }

	        return this;
	    };

	    Confirm.prototype.show = function() {
	        this.__modal.show();
	        return this;
	    };

	    Confirm.prototype.hide = function() {
	        this.__modal.hide();
	        return this;
	    };

	    Confirm.prototype.toggle = function() {
	        this.__modal.toggle();
	        this.isHide = this.__modal.isHide;
	        
	        return this;
	    }

	    Confirm.prototype.destroy = function() {
	        this.__modal.destroy();
	        return this;
	    };


	    /* 尝试绑定方法到 magic 框架的全局对象上 */
	    if ($ && !$.confirm) {
	        $.extend({confirm: function(element, option) {
	            return new Confirm(element, option).init();
	        }});
	    };

	    if ($ && $.fn && !$.fn.confirm) {
	        $.fn.extend({confirm: function(option) {
	            var opt = $.extend({}, option);
	            opt.hasInsert = true;
	            return new Confirm(this[0], opt).init();
	        }});
	    };
	})();

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(26);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(17)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/sass-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/sass-loader/index.js!./../../../../../node_modules/autoprefixer-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(16)();
	exports.push([module.id, ".confirm {\n  display: block;\n  overflow: hidden;\n  padding-top: 44px;\n  border-radius: 5px; }\n  .confirm .content, .confirm .footer {\n    position: static; }\n  .confirm .content, .confirm .footer {\n    background: #FFF; }\n  .confirm .content {\n    font-size: 16px;\n    padding: 16px; }\n  .confirm .footer, .confirm .bar-footer {\n    padding: 10px;\n    padding-top: 0;\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -ms-flexbox;\n    display: flex;\n    margin: -5px;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n    -webkit-flex-direction: row;\n    -ms-flex-direction: row;\n    flex-direction: row; }\n    .confirm .footer .button, .confirm .bar-footer .button {\n      -webkit-box-flex: 1;\n      -webkit-flex: 1;\n      -ms-flex: 1;\n      flex: 1;\n      margin: 5px; }\n  .confirm .button {\n    margin: 0; }\n", ""]);

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2011-2014 Felix Gnass
	 * Licensed under the MIT license
	 * http://spin.js.org/
	 *
	 * Example:
	    var opts = {
	      lines: 12             // The number of lines to draw
	    , length: 7             // The length of each line
	    , width: 5              // The line thickness
	    , radius: 10            // The radius of the inner circle
	    , scale: 1.0            // Scales overall size of the spinner
	    , corners: 1            // Roundness (0..1)
	    , color: '#000'         // #rgb or #rrggbb
	    , opacity: 1/4          // Opacity of the lines
	    , rotate: 0             // Rotation offset
	    , direction: 1          // 1: clockwise, -1: counterclockwise
	    , speed: 1              // Rounds per second
	    , trail: 100            // Afterglow percentage
	    , fps: 20               // Frames per second when using setTimeout()
	    , zIndex: 2e9           // Use a high z-index by default
	    , className: 'spinner'  // CSS class to assign to the element
	    , top: '50%'            // center vertically
	    , left: '50%'           // center horizontally
	    , shadow: false         // Whether to render a shadow
	    , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
	    , position: 'absolute'  // Element positioning
	    }
	    var target = document.getElementById('foo')
	    var spinner = new Spinner(opts).spin(target)
	 */
	var Spinner = (function (root, factory) {

	    /* CommonJS */
	    if (true) module.exports = factory()

	    /* AMD module */
	    else if (typeof define == 'function' && define.amd) define(factory)

	    /* Browser global */
	    else root.Spinner = factory()

	    return factory();
	}(this, function () {
	  "use strict"

	  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
	    , animations = {} /* Animation rules keyed by their name */
	    , useCssAnimations /* Whether to use CSS animations or setTimeout */
	    , sheet /* A stylesheet to hold the @keyframe or VML rules. */

	  /**
	   * Utility function to create elements. If no tag name is given,
	   * a DIV is created. Optionally properties can be passed.
	   */
	  function createEl (tag, prop) {
	    var el = document.createElement(tag || 'div')
	      , n

	    for (n in prop) el[n] = prop[n]
	    return el
	  }

	  /**
	   * Appends children and returns the parent.
	   */
	  function ins (parent /* child1, child2, ...*/) {
	    for (var i = 1, n = arguments.length; i < n; i++) {
	      parent.appendChild(arguments[i])
	    }

	    return parent
	  }

	  /**
	   * Creates an opacity keyframe animation rule and returns its name.
	   * Since most mobile Webkits have timing issues with animation-delay,
	   * we create separate rules for each line/segment.
	   */
	  function addAnimation (alpha, trail, i, lines) {
	    var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-')
	      , start = 0.01 + i/lines * 100
	      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
	      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
	      , pre = prefix && '-' + prefix + '-' || ''

	    if (!animations[name]) {
	      sheet.insertRule(
	        '@' + pre + 'keyframes ' + name + '{' +
	        '0%{opacity:' + z + '}' +
	        start + '%{opacity:' + alpha + '}' +
	        (start+0.01) + '%{opacity:1}' +
	        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
	        '100%{opacity:' + z + '}' +
	        '}', sheet.cssRules.length)

	      animations[name] = 1
	    }

	    return name
	  }

	  /**
	   * Tries various vendor prefixes and returns the first supported property.
	   */
	  function vendor (el, prop) {
	    var s = el.style
	      , pp
	      , i

	    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
	    if (s[prop] !== undefined) return prop
	    for (i = 0; i < prefixes.length; i++) {
	      pp = prefixes[i]+prop
	      if (s[pp] !== undefined) return pp
	    }
	  }

	  /**
	   * Sets multiple style properties at once.
	   */
	  function css (el, prop) {
	    for (var n in prop) {
	      el.style[vendor(el, n) || n] = prop[n]
	    }

	    return el
	  }

	  /**
	   * Fills in default values.
	   */
	  function merge (obj) {
	    for (var i = 1; i < arguments.length; i++) {
	      var def = arguments[i]
	      for (var n in def) {
	        if (obj[n] === undefined) obj[n] = def[n]
	      }
	    }
	    return obj
	  }

	  /**
	   * Returns the line color from the given string or array.
	   */
	  function getColor (color, idx) {
	    return typeof color == 'string' ? color : color[idx % color.length]
	  }

	  // Built-in defaults

	  var defaults = {
	    lines: 12             // The number of lines to draw
	  , length: 7             // The length of each line
	  , width: 3              // The line thickness
	  , radius: 8            // The radius of the inner circle
	  , scale: 1.0            // Scales overall size of the spinner
	  , corners: 1            // Roundness (0..1)
	  , color: '#000'         // #rgb or #rrggbb
	  , opacity: 1/4          // Opacity of the lines
	  , rotate: 0             // Rotation offset
	  , direction: 1          // 1: clockwise, -1: counterclockwise
	  , speed: 1.2              // Rounds per second
	  , trail: 100            // Afterglow percentage
	  , fps: 20               // Frames per second when using setTimeout()
	  , zIndex: 2e9           // Use a high z-index by default
	  , className: 'spinner'  // CSS class to assign to the element
	  , top: '50%'            // center vertically
	  , left: '50%'           // center horizontally
	  , shadow: false         // Whether to render a shadow
	  , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
	  , position: 'absolute'  // Element positioning
	  }

	  /** The constructor */
	  function Spinner (o) {
	    this.opts = merge(o || {}, Spinner.defaults, defaults)
	  }

	  // Global defaults that override the built-ins:
	  Spinner.defaults = {}

	  merge(Spinner.prototype, {
	    /**
	     * Adds the spinner to the given target element. If this instance is already
	     * spinning, it is automatically removed from its previous target b calling
	     * stop() internally.
	     */
	    spin: function (target) {
	      this.stop()

	      var self = this
	        , o = self.opts
	        , el = self.el = createEl(null, {className: o.className})

	      css(el, {
	        position: o.position
	      , width: 0
	      , zIndex: o.zIndex
	      , left: o.left
	      , top: o.top
	      })

	      if (target) {
	        target.insertBefore(el, target.firstChild || null)
	      }

	      el.setAttribute('role', 'progressbar')
	      self.lines(el, self.opts)

	      if (!useCssAnimations) {
	        // No CSS animation support, use setTimeout() instead
	        var i = 0
	          , start = (o.lines - 1) * (1 - o.direction) / 2
	          , alpha
	          , fps = o.fps
	          , f = fps / o.speed
	          , ostep = (1 - o.opacity) / (f * o.trail / 100)
	          , astep = f / o.lines

	        ;(function anim () {
	          i++
	          for (var j = 0; j < o.lines; j++) {
	            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

	            self.opacity(el, j * o.direction + start, alpha, o)
	          }
	          self.timeout = self.el && setTimeout(anim, ~~(1000 / fps))
	        })()
	      }
	      return self
	    }

	    /**
	     * Stops and removes the Spinner.
	     */
	  , stop: function () {
	      var el = this.el
	      if (el) {
	        clearTimeout(this.timeout)
	        if (el.parentNode) el.parentNode.removeChild(el)
	        this.el = undefined
	      }
	      return this
	    }

	    /**
	     * Internal method that draws the individual lines. Will be overwritten
	     * in VML fallback mode below.
	     */
	  , lines: function (el, o) {
	      var i = 0
	        , start = (o.lines - 1) * (1 - o.direction) / 2
	        , seg

	      function fill (color, shadow) {
	        return css(createEl(), {
	          position: 'absolute'
	        , width: o.scale * (o.length + o.width) + 'px'
	        , height: o.scale * o.width + 'px'
	        , background: color
	        , boxShadow: shadow
	        , transformOrigin: 'left'
	        , transform: 'rotate(' + ~~(360/o.lines*i + o.rotate) + 'deg) translate(' + o.scale*o.radius + 'px' + ',0)'
	        , borderRadius: (o.corners * o.scale * o.width >> 1) + 'px'
	        })
	      }

	      for (; i < o.lines; i++) {
	        seg = css(createEl(), {
	          position: 'absolute'
	        , top: 1 + ~(o.scale * o.width / 2) + 'px'
	        , transform: o.hwaccel ? 'translate3d(0,0,0)' : ''
	        , opacity: o.opacity
	        , animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
	        })

	        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px #000'), {top: '2px'}))
	        ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
	      }
	      return el
	    }

	    /**
	     * Internal method that adjusts the opacity of a single line.
	     * Will be overwritten in VML fallback mode below.
	     */
	  , opacity: function (el, i, val) {
	      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
	    }

	  })

	  if (typeof document !== 'undefined') {
	    sheet = (function () {
	      var el = createEl('style', {type : 'text/css'})
	      ins(document.getElementsByTagName('head')[0], el)
	      return el.sheet || el.styleSheet
	    }())

	    var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

	    useCssAnimations = vendor(probe, 'animation')
	  }

	  return Spinner

	}));

	/* 尝试绑定方法到 magic 框架的全局对象上 */
	if ($ && $.fn && !$.fn.spinner) {
	    $.fn.extend({spinner: function(option) {
	        this.data("ui_spinner", new Spinner(option).spin(this[0]));
	        return this.data("ui_spinner");
	    }})
	};

	/* 尝试绑定方法到 magic 框架的全局对象上 */
	if ($ && !$.spinner) {
	    $.extend({spinner: function(el, option) {
	        return new Spinner(option).spin($.query(el));
	    }})
	};

/***/ }
/******/ ]);