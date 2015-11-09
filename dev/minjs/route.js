/**
 * spa应用程序路由库
 */
module.exports = (function() {
    var Route = function(table, options) {
    	this.table   = table;			// 路由表信息
    	this.state   = [];				// 状态信息
        this.last    = {};              // 上一次的路由地址
        this.statpos = 0;               // 记录路由的状态位置
        this.tapinfo = {};              // 记录点击开始的事件
        this.evetype = "";              // 触发事件的方式
  		this.options = extend({}, Route.DEFAULT, options, true);
    };

    /**
     * table 参数说明
     *
     * TODO: 匹配加上正则功能，比如 /([^\/])/ 表示正则匹配
     * TODO: once 只匹配一次URL的路由功能实现
     *
     * 	'/user': {
	 *		on      : function			// 匹配成功时的回调
	 *		once    : function			// 只匹配一次的URL，和on不共存
	 *		bofore  : function			// 匹配成功，on 回调前执行
	 *		leave   : function			// 页面离开时的回调
	 *
	 *		clear   : false				// 为 true 时清除访问历史，默认 false
	 *		recurse : false				// 覆盖全局设置
	 *
	 *		'/info' : {...}				// 子路由信息
     *	}
     *
     * */


    /* 检测是否为函数 */
    function isFun(call) {
        return typeof call == "function"
    };

    /* 最后一项为真时，表示忽略无效的值 */
    function extend(/* ... */) {
        var argv = arguments, obj = argv[0],
            len = argv.length, undef = false;

        if (argv[len-1] === true) {
            undef = true;
            len -= 1;
        }

        for(var i=1; i<len; i++) {
            var item = argv[i];

            for(var key in item) {
                if (undef && item[key] === undefined) {
                    continue;    
                }

                obj[key] = item[key];
            }
        }

        return obj;
    }

    Route.DEFAULT = {
    	home     : "/home",				// 默认首页
        html5mode: false,               // 是否启用H5模式，启用则省略 # 符号（后台需rewrite）
        replace  : true,                // replace模式，自动把 只参数不同的页面 replace 加载，默认开启
    	notcall  : null,				// 页面未找到时候的回调方法
        notpage  : "",                  // 页面未找到的时候，显示的页面，为空则跳到首页
    	before   : null,				// 页面跳转前的回调方法
    	after    : null,				// 页面 成功跳转后 的回调方法
        always   : null,                // 每次点击，不论是否阻止默认跳转，都会执行的方法
    	recurse  : false,				// 路由递归触发方式，forward 正序，backward 反序，默认最后项
        regexp   : ":[^/-]*",           // 参数匹配正则语句，用于匹配参数信息
    }

    /* 执行给定对象的执行方法，forward 为 true 反向执行 */
    Route.prototype._exec = function(tables, key, ext) {
        var len  = tables.length - 1, last = tables[len], ret,
            type = this.options.recurse, back = type == "backward";   // 方法是否反向调用

        if (type === false /* 只执行最后一个对象 */) {
            if (isFun(last.item[key])) {
                ret = last.item[key](last.para, ext);
            }
        } else {
            for (var i = back?len:0; back?i>=0:i<=len; back?i--:i++) {
                var now = tables[i], item = tables[i].item;

                if (isFun(item[key])) {
                    ret = item[key](now.para, ext);
                }

                if (ret === false) break; // 返回 false 则终止程序执行
            }
        }

        return ret;     // 返回最后执行的结果
    }

    /* 路由初始化方法，repath 为 true，则跳到首页 */
    Route.prototype.init = function(repath) {
        var that = this, opt = that.options;

        /* 初始化项目的路由匹配规则 */
        that.table = Route.prefix(that.table, opt.regexp);
        that._bind();            // 绑定全局事件

        if (opt.authPage) opt.authPage = that.geturl(opt.authPage);

        if (repath || !that.fire())  {
            var to = opt.notpage || opt.home;
            that.go(to, true, false, true);
        } else {
            var url = that.geturl();
            that.go(url, true, false, true);
        }

        return that;
    }

    /* 初始化路由表，设置每个项正确的 正则表达式 */
    Route.prefix = function(table, regexp) {
        var params = new RegExp(regexp, "g");       // 获得参数匹配正则语句

        for (var key in table) {
            if (key.search("/") == 0) {
                
                /* 修正格式(只传了on方法) */
                if (isFun(table[key])) {
                    table[key] = { on: table[key]}
                }

                /* 添加对应项具体的正则语句 */
                table[key].__match = key.replace(params, "([^/]*)");
                Route.prefix(table[key], regexp);   // 递归循环处理子项目，直到全部处理完
            }
        }

        return table;
    }

    /* 尝试匹配给定URL的路由信息 */
    Route.prototype.fire = function(url, last) {
    	url = url === undefined ? this.geturl() : url;              // 修正参数
    	url = "/" + url.replace(/^[#|\/]*/g, "").replace(/\/$/g, "");	   // 替换开头 # 和结尾 /

    	var table = this.table, opt = this.options,
            result = [], tmp, para, key, reg, mat, check;

    	/* 循环匹配路由项目 */
        do {
            for (var key in table) {
                if (key.search("/") === 0) {
                    reg = new RegExp("^"+table[key].__match);
                    mat = url.match(reg);

                    if (mat != null) {
                        para = key.match(reg);
                        var params = {};

                        /* 获取URL上的对应参数变量 */
                        for(var i=1; i<para.length; i++) {
                            tmp = para[i].replace(":", "");
                            params[tmp] = mat[i];
                        }

                        result.push({
                            item : table[key],
                            para : params
                        })

                        url   = url.replace(mat[0], "");        // 已经找到的部分替换掉
                        table = table[key];                     // 重定向table的指向
                        key   = Object.keys(table)[0]; break;   // 重定向key的指向，并结束循环
                    }
                }

                check = key;    //  标记当前已经检测过的项目
            }
        } while (url.length > 0 && check != key);

        /* 如果last参数为真，则只返回最后的一个项目 */
        if (url.length == 0 && last) {
            result = result[result.length-1];
        }

    	return url.length == 0 && result.length ? result : null;
    }

    /* 手动触发指定页面的事件方法，match 参数必须给定 */
    Route.prototype._trigger = function(nowUrl, match, exbefore, exon) {
        if (!match) return false;   // 参数不足直接退出

        var that = this, opt = that.options, last = that.last, rcall, update;

        if (isFun(opt.before)) rcall = opt.before(last.url, nowUrl, match, that);

        // 尝试调用 before后 的回调，如果返回 false，会中止后面页面的回调
        if (isFun(exbefore)) update = exbefore(rcall);     

        /* 如果 before 返回 false，回退到上个页面 */
        if (rcall !== false) {
            if (last && last.match) rcall = that._exec(last.match, "leave", match);

            /* 如果上个页面的 leave 返回 false ，中止本次跳转 */
            if (rcall !== false) rcall = that._exec(match, "before", last.match);

            /* 如果 before 返回 false，中止本次跳转 */
            if (rcall !== false) rcall = that._exec(match, "on", last.match);

            if (isFun(exon)) update = exon(rcall);         // 尝试调用 on后 的回调

            /* 运行全局的 成功跳转的after 方法 */
            update !== false && isFun(opt.after) && opt.after(last.url, nowUrl, match, that);
        }

        /* 不论是否跳转成功，一定会执行 always 方法 */
        isFun(opt.always) && opt.always(last.url, nowUrl, match, that);

        update !== false && that.update(that.geturl(), match);
    }

    /* 全局绑定时间，监控页面前进后退等操作 */
    Route.prototype._bind = function() {
        var that = this, opt = that.options, last = that.last, start, change;

        window.addEventListener("popstate", function(e) {
            var state = history.state, call, nowUrl = that.geturl(),
                lstate = last.state, islast = that.check(state, "last");

            that.evetype = "popstate";

            if (state && state.clear === true && !islast) {
                call = lstate.id > state.id ? "back" : "forward";
                history[call]();    // 略过 无记录 标记的 URL且当前项不是最后状态
            } else if (nowUrl != last.url) {
                that._trigger(nowUrl, that.fire(), function(rcall) {
                    if (rcall === false) {
                        // before 执行失败则回退到上个页面
                        that.replace(lstate, lstate.title, last.url);
                    }
                })
            }

            that.evetype = "";      // 重置状态
        });
    }

    /* 判断给定的URL状态是不是当前状态表的最后一项 */
    Route.prototype.check = function(state, type) {
        var tables = this.state, len = tables.length-1, ret = false;

        if (state && type) {
            switch (type) {
                case "last" :
                    ret = state.id == tables[len].id;
                    break;
                case "first" : 
                    ret = state.id == tables[0].id;
                    break;
            }
        }

        return ret;     // 判断当前是否在指定的位置
    }

    /* 更新当前记录信息 */
    Route.prototype.update = function(url, match, state) {
        /* 更新当前路由的 last 记录信息 */
        url = this.geturl(url);     // 修正格式

        this.last.url   = url   || this.geturl();
        this.last.match = match || this.fire();
        this.last.state = state || history.state;
    }

    /* 强制刷新，重新加载当前页面，但不触发 popstate 事件 */
    Route.prototype.refresh = function() {
        this.go(this.geturl(), true, false, true);

        return this;
    }

    /* 用给定的参数替换当前URL(无选择上次URL)，并不会触发 popstate 事件和方法执行 */
    Route.prototype.replace = function(state, title, url) {
        if (!state || !url) {
            state = this.last.state;
            title = state.title;
            url   = this.last.url;
        }

        history.replaceState(state, title, url);

        return this;
    }

    /* 跳到指定的页面 */
    Route.prototype.go = function(toUrl, replace, clear, refresh) {
        var that = this, opt = that.options, call, last = that.last,
            state = {}, end, rcall, match = that.fire(toUrl), now;

        /* 修正URL的格式，便于比较和计算 */
        toUrl = that.geturl(toUrl);     now = that.geturl();

        /* 要跳转的页面和当前页面不一样时才跳转 */
        if (match && (refresh || toUrl != now )) {
            if (refresh && toUrl === now) replace = true;

            /* 如果当前页面和上个页面一样，只不过参数不同，则转为替换模式 */
            if (opt.replace && last.match && last.match.length == match.length) {
                var ret = true;     // 用于记录每个匹配项是否相等

                for (var i = 0; i < match.length; i++) {
                    if (last.match[i].item != match[i].item) {
                        ret = false; break; // 退出检测
                    }
                }

                replace = ret ? true : replace;
            }

            /* 如果上个页面为 clear 页面，则当前页面直接 replace 加载 */
            if (last && last.state && last.state.clear === true) {
                replace = true;
            }

            end  = match[match.length-1];
            call = replace ? "replaceState" : "pushState";

            state.title = end && end.title ? end.title : ""; // 标题
            state.clear = clear || end.clear;          // 是否无记录模式

            that._trigger(toUrl, match, null, function(rcall) {
                /* 进行具体的页面跳转，记录状态等动作 */
                if (rcall !== false) {
                    if (last && last.state && last.state.id < that.state.length) {
                        that.statpos = last.state.id;
                        that.state = that.state.slice(0, last.state.id);
                    }

                    state.id = ++that.statpos;      // 记录当前路由的序列ID

                    that.state.push(extend({}, state, {
                        match: match, url: toUrl
                    }));
                    history[call](state, state.title, toUrl);
                }

                return rcall;   // 返回 false，会阻止后续调用 update 方法
            })
        }
            
        return that;
    };

    /* 后退URL地址，目前直接调用浏览器的方法 */
    Route.prototype.back = function() {
        history.back();
    }

    /* 前进URL地址，目前直接调用浏览器的方法 */
    Route.prototype.forward = function() {
        history.forward();
    }

    /* 获取当前URL信息 */
    Route.prototype.geturl = function(url) {
        var that = this, opt = that.options, ret = "";

        if (opt.html5mode) {
            ret = url || location.pathname;
            ret = ret.replace(/^[#,\/]*/g, "/");
        } else {
            ret = url || location.hash;
            ret = ret.replace(/^[#,\/]*/g, "#");
        }

        return ret;
    }

    /* 添加一个路由信息
     * TODO: 加入子路由添加功能
     * */
    Route.prototype.on = function(url, option) {
        if (url || options) return false;

        var has = this.fire(url);

        if (has == null) {
            tables[url] = options;
            return true;
        } else {
            return false;   // 已经有此路由，操作失败
        }
    }

    /* 移除一个路由信息 */
    Route.prototype.off = function(url) {
        var tables = this.table;

        for(var key in tables) {
            if (key == url) {
                delete tables[key];

                return true;
            }
        }

        return false;   // 循环完还没删除，则返回失败
    }

    return window.Route = Route;
})(location, history);