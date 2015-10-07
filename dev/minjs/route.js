/**
 * spa应用程序路由库
 */
module.exports = (function() {
    var Route = function(table, options) {
    	this.table   = table;			// 路由表信息
    	this.state   = [];				// 状态信息
    	this.match	 = [];				// 当前匹配到的路由
        this.last    = {};              // 上一次的路由地址
        this.statpos = 0;               // 记录路由的状态位置
  		this.options = {};				// 路由设置信息

  		this.config(options, true);		// 初始化路由设置信息
    };

    /**
     * table 参数说明
     *
     * TODO: 匹配加上正则功能，比如 /([^\/])/ 表示正则匹配
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

    /* 手动触发 PopStateEvent 事件 */
    function triggerPopEve() {
        var eve = document.createEvent('PopStateEvent');
        eve.initEvent("popstate", true, true);
        window.dispatchEvent(eve);
    }


    Route.DEFAULT = {
    	home     : "/home",				// 默认首页
        html5mode: false,               // 是否启用H5模式，启用则省略 # 符号（后台需rewrite）
    	repath   : "",					// 页面未找到时候重置到的页面，为空则跳到首页
    	notcall  : null,				// 页面未找到时候的回调方法
        notpage  : "",                  // 页面未找到的时候，显示的页面
    	before   : null,				// 页面跳转前的回调方法
    	after    : null,				// 页面跳转后的回调方法
    	recurse  : false,				// 路由递归触发方式，forward 正序，backward 反序，默认最后项
    }

    /* 执行给定对象的执行方法，forward 为 true 反向执行 */
    Route.exec = function(tables, key, type) {
        var len  = tables.length - 1, last = tables[len], ret,
            back = type == "backward";   // 方法是否反向调用

        if (type === false /* 只执行最后一个对象 */) {
            if (isFun(last.item[key])) {
                ret = last.item[key](last.para);
            }
        } else {
            for (var i = back?len:0; back?i>=0:i<=len; back?i--:i++) {
                var now = tables[i], item = tables[i].item;

                if (isFun(item[key])) {
                    ret = item[key](now.para);
                }

                if (ret === false) break; // 返回 false 则终止程序执行
            }
        }

        return ret;     // 返回最后执行的结果
    }

    /* 设置当前路由的参数信息，init 为 true 时，初始化模式 */
    Route.prototype.config = function(options, init) {
        options = options ? options : {};   // 修正参数

  		var def = Route.DEFAULT, that = this, opt = that.options;

  		for(var key in def) {
  			if (init && def[key] !== undefined) {
  				var item = options[key];	// 当前项的值

  				opt[key] = (item !== undefined ? item : def[key]);
  			} else if (options[key] !== undefined) {
  				opt[key] = options[key];
  			}
  		}
    }

    /* 路由初始化方法，repath 为 true，则跳到首页 */
    Route.prototype.init = function(repath) {
        var that = this, opt = that.options, tmp, url;

        /* 初始化项目的路由匹配规则 */
        that.table = Route.prefix(that.table);
        that.bind();            // 绑定全局事件

        if (repath)  {
            tmp = that.fire(opt.home);
            that.go(opt.home, true, tmp);
        }

        that.update();          // 初始化上次访问的页面信息

        return that;
    }

    /* 初始化路由表，设置每个项正确的 正则表达式 */
    Route.prefix = function(table) {
        for (var key in table) {
            if (key.search("/") == 0) {
                
                /* 修正格式(只传了on方法) */
                if (isFun(find[key])) {
                    find[key] = { on: find[key]}
                }

                /* 添加对应项具体的正则语句 */
                table[key].__match = key.replace(/:[^_\/-]*/g, "([^/]*)");
                Route.prefix(table[key]);   // 递归循环处理子项目，直到全部处理完
            }
        }

        return table;
    }

    /* 尝试匹配给定URL的路由信息 */
    Route.prototype.fire = function(url) {
    	url = url == undefined ? this.geturl() : url;              // 修正参数
    	url = "/" + url.replace(/^#/, "").replace(/\/$/, "");	   // 替换开头 # 和结尾 /

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

    	return url.length == 0 && result ? result : null;
    }

    /* 全局绑定时间，监控页面前进后退等操作 */
    Route.prototype.bind = function() {
        var that = this, opt = that.options, last = that.last, change;

        change = window.ontouchstart !== undefined ? "touchend" : "mouseup";

        window.addEventListener("popstate", function(e) {
            var href = that.geturl(), match = that.fire(), not, to, rcall;

            /* 进入新页面动作，否则说明是后退或者前进动作 */
            if (history.state === null && href != last.url) {
                not = that.fire(opt.notpage) ? opt.notpage : opt.home;
                not = that.geturl(not);     // 修复URL格式
                to  = match ? href : not;   // 设置跳转后的URL

                /* 运行全局 before 方法 */
                if (isFun(opt.before)) rcall = opt.before(href);

                /* 如果 before 方法返回false 或 页面未找到，阻止默认跳转 */
                if (rcall === false || match == null) {
                    if (to == not && not != last) {
                        if (isFun(opt.notcall)) {
                            rcall = opt.notcall(href);
                        }

                        /* 如果 notcall 返回 false，则不执行跳转到错误页面的动作 */
                        rcall != false && that.go(not, true, that.fire(not), true);
                    }
                } else {
                    /* 尝试运行上个页面的 leave 方法 */
                    if (that.last) {
                        rcall = Route.exec(that.last.match, "leave", opt.recurse);
                    }

                    /* 如果上个页面 leave 方法返回 false，则修改URL为原来页面 */
                    rcall != false && that.go(href, true, that.fire(href), true);

                    /* 运行当前页面的指定方法回调 */
                    Route.exec(match, "before", opt.recurse);
                    Route.exec(match, "on", opt.recurse);
                }
            } else if (href != last.url) {
                /* 运行全局 before 方法 */
                if (isFun(opt.before)) rcall = opt.before(href);

                /* 尝试运行上个页面的 leave 方法 */
                if (rcall != false) {
                    rcall = Route.exec(that.last.match, "leave", opt.recurse);
                }

                /* 如果上个页面 leave 方法返回 false，则不执行新页面跳转动作 */
                if (rcall != false) {
                    /* 运行当前页面的指定方法回调 */
                    Route.exec(match, "before", opt.recurse);
                    Route.exec(match, "on", opt.recurse);
                }
            }

            that.update();      // 更新路由相关的记录信息
        });

        /* 页面跳转前检测，尝试阻止多余的URL跳转方法 */
        document.addEventListener(change, function(e) {
            var target = e.target, tag = target.tagName,
                href = target.getAttribute("href"), now = that.geturl();

            if (tag === "A" && href != now) {
                var match = that.fire(href), not, to;

                not = that.fire(opt.notpage) ? opt.notpage : opt.home;
                not = that.geturl(not);     // 修复URL格式
                to  = match ? href : not;   // 设置最终要跳转的URL

                /* 要跳转的页面和当前页面一样时，阻止跳转 */
                to == now && e.preventDefault();
            }
        });
    }

    /* 更新当前记录信息 */
    Route.prototype.update = function(url, match, state) {
        /* 更新当前路由的 last 记录信息 */
        this.last.url   = url   || this.geturl();
        this.last.match = match || this.fire();
        this.last.state = state || history.state;
    }

    /* 跳到指定的页面 */
    Route.prototype.go = function(url, replace, route, slience) {
        var that = this, opt = that.options, call, state = {}, last;

        if (opt.html5mode) {
            url = url.replace(/^[#,\/]*/g, "/");
        } else {
            url = url.replace(/^[#,\/]*/g, "#");
        }

        /* 要跳转的页面和当前页面不一样时才跳转 */
        if (url != that.last.url && url != that.geturl()) {
            last = route && route.length ? route[route.length-1] : null;
            call = replace ? "replaceState" : "pushState";

            state.id    = that.statpos++;      // 记录当前路由的序列ID
            state.title = last && last.title ? last.title : ""; // 标题
            history[call](state, state.title, url);

            /* 默认手动触发 popstate 事件 */
            !slience && triggerPopEve();
        }
            
        return that;
    };

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

    /* 添加一个路由信息 */
    Route.prototype.on = function(url, option) {

    }

    /* 移除一个路由信息 */
    Route.prototype.off = function(url, call) {

    }

    return window.Route = Route;
})(location, history);