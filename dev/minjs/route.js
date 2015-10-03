/**
 * spa应用程序路由库
 */
module.exports = (function() {
    var Route = function(table, options) {
    	this.table   = table;			// 路由表信息
    	this.state   = [];				// 状态信息
    	this.match	 = [];				// 当前匹配到的路由
  		this.options = {};				// 路由设置信息

  		this.config(options, true);		// 初始化路由设置信息
    };

    /**
     * table 参数说明
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
    	index    : "home",				// 默认首页
    	repath   : "",					// 页面未找到时候重置到的页面，为空则跳到首页
    	notfound : null,				// 页面未找到时候的回调方法
    	before   : null,				// 页面跳转前的回调方法
    	after    : null,				// 页面跳转后的回调方法
    	recursive: false,				// URL匹配时的方式，默认精确匹配，
    									// "forward"正向，"backward"反向
    }


    /* 设置当前路由的参数信息，init 为 true 时，初始化模式 */
    Route.prototype.config = function(options, init) {
    	if (options) return false;

  		var def = Route.DEFAULT, opt = this.options;

  		for(var key in options) {
  			if (init && def[key] !== undefined) {
  				var item = options[key];	// 当前项的值

  				opt[key] = (item !== undefined ? item : def[key]);
  			} else if (options[key] !== undefined) {
  				opt[key] = options[key];
  			}
  		}
    }

    /* 路由初始化方法 */
    Route.prototype.init = function() {
        var that = this, opt = that.options;

        /* 初始化项目的路由匹配规则 */
        that.table = Route.prefix(that.table);


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

    /* 尝试匹配给定URL的路由信息 */
    Route.prototype.match = function(url) {
    	url = url == undefined ? location.hash : url;		// 修正参数
    	url.replace(/^#/, "").replace(/\/$/, "");	// 替换开头 # 和结尾 /

    	var match = url.split("/"), table = this.table, opt = this.options,
    		result = [], pos = 0, find = this.table, val, key;

    	/* 修复 URL 匹配数据的前缀 */
    	for (var i=0; i<match.length; i++) {
    		match[i].replace(/^\/*/, "/");
    	}

    	/* 循环匹配路由项目 */
    	for (var key in table) {
            if (key.search("/") === 0) {
                
            }
        }

    	return this.match = (pos == match.length ? [] : result);
    }

    /* 添加一个路由信息 */
    Route.prototype.on = function(url, option) {

    }

    /* 移除一个路由信息 */
    Route.prototype.off = function(url, call) {

    }

    return window.Route = Route;
})();