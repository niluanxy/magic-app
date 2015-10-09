/**
 * spa应用程序路由库
 */
module.exports = (function() {
    var Route = function(table, options) {
    	this.table   = table;			// 路由表信息
    	this.state   = [];				// 状态信息
        this.last    = {};              // 上一次的路由地址
        this.statpos = 0;               // 记录路由的状态位置
  		this.options = extend({}, Route.DEFAULT, options, true);
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
    	repath   : "",					// 页面未找到时候重置到的页面，为空则跳到首页
    	notcall  : null,				// 页面未找到时候的回调方法
        notpage  : "",                  // 页面未找到的时候，显示的页面
    	before   : null,				// 页面跳转前的回调方法
    	after    : null,				// 页面跳转后的回调方法
    	recurse  : false,				// 路由递归触发方式，forward 正序，backward 反序，默认最后项
    }

    /* 执行给定对象的执行方法，forward 为 true 反向执行 */
    Route.prototype.exec = function(tables, key, ext) {
        var len  = tables.length - 1, last = tables[len], ret,
            type = this.options.recurse, back = type == "backward";   // 方法是否反向调用

        if (type === false /* 只执行最后一个对象 */) {
            if (isFun(last.item[key])) {
                ret = last.item[key](last.para);
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
        var that = this, opt = that.options, tmp, url;

        /* 初始化项目的路由匹配规则 */
        that.table = Route.prefix(that.table);
        that.bind();            // 绑定全局事件

        if (repath)  {
            tmp = that.fire(opt.home);
            that.go(opt.home, true, false, true);
        }

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

    	return url.length == 0 && result ? result : null;
    }

    /* 全局绑定时间，监控页面前进后退等操作 */
    Route.prototype.bind = function() {
        var that = this, opt = that.options, last = that.last, change;

        change = window.ontouchstart !== undefined ? "touchend" : "mouseup";

        window.addEventListener("popstate", function(e) {
            var state = history.state, call, now = that.geturl(),
                lstate = last.state, rcall;

            call = lstate.id > state.id ? "back" : "forward";

            if (state.clear === true && !that.islast(state)) {
                history[call]();    // 略过 无记录 标记的 URL且当前项不是最后状态
            } else {
                var match = that.fire();    // 要跳到的页面的路由信息

                if (isFun(opt.before)) rcall = opt.before(now, match);

                /* 如果 before 返回 false，回退到上个页面 */
                if (rcall === false) {
                    history.replaceState(lstate, lstate.title, last.url);
                } else {
                    rcall = that.exec(last.match, "leave", match);

                    /* 如果上个页面的 leave 返回 false ，中止本次跳转 */
                    if (rcall !== false) rcall = that.exec(match, "before", last.match);

                    /* 如果 before 返回 false，中止本次跳转 */
                    if (rcall !== false) rcall = that.exec(match, "on", last.match);
                }

                /* 运行全局的 after 方法 */
                isFun(opt.after) && opt.after(now, match); 
            }

            that.update(); // 更新记录信息
        });

        /* 页面跳转前检测，尝试阻止多余的URL跳转方法 */
        document.addEventListener(change, function(e) {
            var target = e.target, tag = target.tagName,
                href = target.getAttribute("href"), now = that.geturl();

            if (tag === "A" && href) {
                e.preventDefault(); /* 阻止浏览器默认跳转 */

                var match = that.fire(href), not, to;

                not = that.fire(opt.notpage) ? opt.notpage : opt.home;
                not = that.geturl(not);     // 修复URL格式
                to  = match ? href : not;   // 设置最终要跳转的URL

                
                to != now && that.go(to, false, to == not);
            }
        });
    }

    /* 判断给定的URL状态是不是当前状态表的最后一项 */
    Route.prototype.islast = function(state) {
        var len = this.state.length-1, last = this.state[len];

        return state.id == last.id;     // 判断当前是否最后的状态
    }

    /* 更新当前记录信息 */
    Route.prototype.update = function(url, match, state) {
        /* 更新当前路由的 last 记录信息 */
        this.last.url   = url   || this.geturl();
        this.last.match = match || this.fire();
        this.last.state = state || history.state;
    }

    /* 跳到指定的页面 */
    Route.prototype.go = function(url, replace, clear, refresh) {
        var that = this, opt = that.options, call, last = that.last,
            state = {}, end, rcall, match = that.fire(url), now;

        /* 修正URL的格式，便于比较和计算 */
        url = that.geturl(url);     now = that.geturl();

        /* 要跳转的页面和当前页面不一样时才跳转 */
        if (match && (refresh || url != that.geturl() )) {
            if (refresh && url === now) replace = true;

            end  = match[match.length-1];
            call = replace ? "replaceState" : "pushState";

            state.title = end && end.title ? end.title : ""; // 标题
            state.clear = clear || end.clear;          // 是否无记录模式

            /* 运行全局的 before 方法 */
            if (isFun(opt.before)) rcall = opt.before(url, match);

            /* 如果全局 before 返回 false ，中止本次跳转 */
            if (rcall !== false) {
                if (last.match) rcall = that.exec(last.match, "leave", match);

                /* 如果上个页面的 leave 返回 false ，中止本次跳转 */
                if (rcall !== false) rcall = that.exec(match, "before", last.match);

                /* 如果 before 返回 false，中止本次跳转 */
                if (rcall !== false) rcall = that.exec(match, "on", last.match);

                /* 进行具体的页面跳转，记录状态等动作 */
                if (rcall !== false) {
                    if (last && last.state && last.state.id < that.state.length) {
                        that.statpos = last.state.id;
                        that.state = that.state.slice(0, last.state.id-1);
                    }

                    state.id = ++that.statpos;      // 记录当前路由的序列ID

                    that.state.push(extend({}, state, {match: match}));
                    history[call](state, state.title, url);
                    that.update(url, match, state); // 更新记录信息
                }
            }

            /* 运行全局的 after 方法 */
            isFun(opt.after) && opt.after(url, match); 
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