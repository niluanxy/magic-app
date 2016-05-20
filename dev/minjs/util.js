module.exports = (function() {
    var util     = {}, // 定义返回的对象
        isArray  = Array.isArray;

    /* 判断是否为一个纯净的对象 */
    var isObject = util.isPlainObject= function(obj) {
        if (typeof obj !== "object" ||
             obj.nodeType || obj === window) {
            return false;
        }

        if ( obj.constructor &&
                !({}).hasOwnProperty.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
            return false;
        }

        return true;
    }

    var isFunction = util.isFun = function(call) {
        return typeof call == "function";
    }

    util.isArray  = isArray;
    util.isObject = isObject;

    /**
     * 按照输入参数返回一个节流函数
     *
     * @param       {Function}  func - 需要节流执行的函数
     * @param       {Integer}   wait - 节流频率
     * @return      {Function}  新的给定频率节流执行的函数
     * @author      mufeng  <smufeng@gmail.com>
     * @version     0.1     <2015-04-10>
     */
    util.delayCall = function(func, wait) {
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

    /* 创建只会执行一次的方法 */
    util.onceCall = function(func) {
        var hasrun = false;

        return function() {
            if (!hasrun) {
                var args = arguments;

                func.apply(this, args);
            }

            hasrun = true;
        }
    }

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
     * 返回一个随机的数字字符串
     */
    util.getRandom = function(min, max) {
        if (min && max && min != max) {
            return parseInt(Math.random()*(max-min+1)+min,10);
        } else {
            return (''+Math.random()).replace(/\D/g, '').replace(/^0*/, '');
        }
    };

    /**
     * 合并一个或多个对象到目标对象
     *
     * @param       {Object}    deep     - 是否深度复制
     * @param       {Object}    target   - 目标对象
     * @param       {Object}    obj...   - 要合并一个或多个对象
     * @param       {Boolean}   ...last  - 是否忽略无效值(null,undefined)，默认不忽略
     * @author      mufeng  <smufeng@gmail.com>
     * @version     0.1     <2015-04-10>
     */
    util.extend = function(/* deep, target, obj..., last */) {
        var i = 1, argv = arguments, len = argv.length,
            target = argv[0], name, copy, clone,
            pass = false, deep = false;

        // 如果最后一个变量是 true ，表示忽略无效字段
        if (typeof argv[len-1] === "boolean") {
            pass = argv[len-1];
            len--;
        }

        // 如果第一个变量是 布尔值，设置是否深度复制
        if (typeof argv[0] === "boolean") {
            deep = argv[0];
            target = argv[1];
            i++;
        }

        // 如果只有一个参数时，合并到自身
        if (i === len) {
            target = this;      // 重置复制对象句柄
            i = 0;              // 重置开始复制的对象下标
        }

        for(; i < len; i++) {
            if (argv[i] != null) {
                for(name in argv[i]) {
                    src  = target[name];
                    copy = argv[i][name];

                    // 跳过指向自身，防止死循环
                    if (target === copy) {
                        continue;
                    }

                    // 若设置忽略无效值，则忽略
                    if (pass && copy == undefined) {
                        continue;
                    }

                    if (deep && copy && ( isArray(copy) || isObject(copy) ) ) {

                        // 深度复制时，判断是否需要创建新空间
                        if (isArray(copy)) {
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isObject(src) ? src : {};
                        }

                        target[name] = util.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;     // 返回合并后的对象
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
                return e.getAttribute ? e.getAttribute(lattr) : null;
            } else {
                // 否则则为设置具体的属性值
                e.setAttribute(lattr, val);
            }
        }
    }

    /**
     * 删除 对象的 HTML 属性
     *
     * @param       {Element}           e - 操作对象
     * @param       {String||Array}     attr - 要删除的属性名
     * @version     0.1                 <2016-03-16>
     */
    util.removeAttr = function(e, attr) {
        var nType = e.nodeType;

        if (nType === 3 || nType === 8 || nType === 2) {
            return; // 忽略掉 文本节点、注释和属性节点
        }

        if (typeof attr == "string") {
            e.removeAttribute(attr);
        } else if (attr instanceof Array) {
            for(var i=0; i<attr.length; i++) {
                e.removeAttribute(attr[i].toLowerCase())
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
                return dataCache[dkey][key] = val;
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
     * 检测对象是否位于某个类下(会检测父元素)
     *
     * @param       {Element}   e - 操作对象
     * @param       {Object}    c - 要检测的类名
     * @param       {Element}   stop - 停止向上查找的元素
     * @return      {Boolean}   是否含有某个类
     * @author      mufeng  <smufeng@gmail.com>
     * @version     0.1     <2016-03-22>
     */
    util.belowClass = function(e, c, stop) {
        var now = e, has;

        do {
            has = util.hasClass(now, c);

            if (has) break;
            now = now.parentNode;
        } while(now && (!stop || stop != now))

        return has ? now : false;
    }

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
            var newclass = e.className.split(' '),
                addclass = c.split(' ');

            for(var i=0; i<addclass.length; i++) {
                var now = addclass[i];
                if (!util.hasClass(e, now)) {
                   newclass.push(now)
                }
            }

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
        if (set !== undefined) {
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
     * 采用原型实现继承给定父类的所有属性
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


    /**
     * 实现一个继承方法，可以重写，调用，覆盖父类方法
     * @param       {Object}  cls - 要继承的父类对象
     * @param       {Object}  sub - 实现继承的构造器方法
     * @return      {Object}    继承后的新的对象
     * @author      mufeng  <smufeng@gmail.com>
     * @version     0.1     <2015-10-21>
     */
    util.class = function(cls, sub) {
        if (!isFunction(cls) || !isFunction(sub)) return sub;

        var prot = util.inheart(cls.prototype), $su, scope, mclass;

        /* 创建一个新的方法 */
        mclass = function() {
            var argv = arguments;

            scope = this;
            sub.apply(this, argv);
            cls.apply(this, argv);
        }

        /* 最终返回的类方法初始化 */
        prot.constructor = sub;
        mclass.prototype = prot;

        /* $super 对象初始化操作 */
        $su = function () {
            scope = this;
            cls.apply(this, arguments);
        }
        $su.constructor = cls;

        /* 复制 父类的方法到 $super，并修正运行上下文 */
        for(var key in cls.prototype) {
            var item = cls.prototype[key];

            if (isFunction(item)) {
                $su[key] = function() {
                    item.apply(scope, arguments);
                }
            } else {
                $su[key] = item;
            }
        }

        mclass.prototype.$super = $su;

        return mclass;
    };

    return util; // 最终返回闭包的对象
})();
