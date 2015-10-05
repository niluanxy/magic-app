/**
 * spa应用程序路由库
 */
module.exports = (function() {
    var Route = function(table, options) {
    	this.table   = table;			// 路由表信息
    	this.state   = [];				// 状态信息
    	this.match	 = [];				// 当前匹配到的路由
        this.last    = "";              // 上一次的路由地址
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
	 *		recusive: false				// URL匹配方式，可覆盖全局设置，默认 false
	 *
	 *
	 *		'/info' : {...}				// 子路由信息
     *	}
     *
     * */



    Route.DEFAULT = {
    	home     : "/home",				// 默认首页
        html5mode: false,               // 是否启用H5模式，启用则省略 # 符号（后台需rewrite）
    	repath   : "",					// 页面未找到时候重置到的页面，为空则跳到首页
    	notcall  : null,				// 页面未找到时候的回调方法
        notpage  : "",                  // 页面未找到的时候，显示的页面
    	before   : null,				// 页面跳转前的回调方法
    	after    : null,				// 页面跳转后的回调方法
    	recursive: false,				// URL匹配时的方式，默认精确匹配，
                                        // "forward"正向，"backward"反向
    }


    /* 设置当前路由的参数信息，init 为 true 时，初始化模式 */
    Route.prototype.config = function(options, init) {
        options = options ? options : {};   // 修正参数

  		var def = Route.DEFAULT, opt = this.options;

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
        var that = this, opt = that.options, tmp;

        /* 初始化项目的路由匹配规则 */
        that.table = Route.prefix(that.table);
        that.bind();            // 绑定全局事件

        if (repath)  {
            tmp = that.fire(opt.home);
            that.go(opt.home, true, tmp);
        }

        /* 初始化上次访问的页面信息 */
        that.last = that.geturl();

        return that;
    }

    /* 初始化路由表，设置每个项正确的 正则表达式 */
    Route.prefix = function(table) {
        for (var key in table) {
            if (key.search("/") == 0) {
                /* 添加对应项具体的正则语句 */
                if (typeof find[key] == "function") {
                    find[key] = { on: find[key]};   // 修正格式(只传了on方法)
                }

                table[key].__match = key.replace(/:[^_\/-]*/g, "([^/]*)");
                Route.prefix(table[key]);   // 递归循环处理子项目，直到全部处理完
            }
        }

        return table;
    }

    /* 对给定的路由数据进行简化，只保留需要的信息 */ 
    Route.clear = function(route) {

    }

    /* 尝试匹配给定URL的路由信息 */
    Route.prototype.fire = function(url) {
    	url = url == undefined ? location.hash : url;      // 修正参数
    	url = url.replace(/^#/, "").replace(/\/$/, "");	   // 替换开头 # 和结尾 /

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
        	
        /* 参数修正，如果只有一个项时，直接返回这个项目 */
        result = result.length > 1 ? result : result[0];

    	return url.length == 0 && result ? result : null;
    }


    /* 全局绑定时间，监控页面前进后退等操作 */
    Route.prototype.bind = function() {
        var $main = window, that = this, opt = that.options, match, url;

        change = window.ontouchstart ? "touchend" : "mouseup";

        $main.addEventListener("popstate", function(e) {
            match = that.fire();    // 获取当前匹配到的页面
            url   = that.geturl();
            
            console.log(e)
            console.log(url)
            console.log(match)
            console.log(that)

            /* 匹配失败会先尝试跳到notfound页面，无则调回首页 */
            if (!match /* 匹配失败 */) {
                
            } else {

            }
        });
    }

    /* 跳到指定的页面，但不会出发 change 时间 */
    Route.prototype.go = function(url, replace, state) {
        var that = this, opt = that.options, call, eve;

        if (opt.html5mode) {
            url = url.replace(/^[#,\/]*/g, "/");
        } else {
            url = url.replace(/^[#,\/]*/g, "#");
        }

        call = replace ? "replaceState" : "pushState";
        history[call](state||{}, state && state.title || "", url);

        /* 手动触发 popstate 事件 */
        eve = document.createEvent('PopStateEvent');
        eve.initEvent("popstate", true, true);
        window.dispatchEvent(eve);

        return that;
    };

    /* 获取当前URL信息 */
    Route.prototype.geturl = function() {
        var that = this, opt = that.options, ret = "";

        if (opt.html5mode) {
            ret = location.pathname;
        } else {
            ret = location.hash;
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