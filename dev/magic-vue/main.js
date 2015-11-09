require("./lib/magic.js");

$(function() {
    var mvue, config = {tables: []}, Router = require("./lib/route.js");

    window.$$ = mvue = {
        location  : null,       // 全局ROUTER对象

        __VUE__   : null,       // 全局VUE对象
        __VIEW__  : null,       // 全局MG-VIEW对象
        __PAGE__  : {},       // 当前页面对象
        __CACHE__ : null,       // 全局页面缓存

        __STATE__ : null,         // 记录当前APP各种状态
    };


    /**
     * init option 参数说明
     * 
     * authBase     全局默认的权限值
     * authPage     不满足权限值的时候跳转验证的页面
     * authCall     用于验证的方法，可以不传
     * authCheck    用于判断是否校验的阀值
     * 
     */


    // APP初始化方法
    mvue.init = function(option, repath) {
        $$.key("__MAGIC_RUNID", $.getRandom());

        var vue   = mvue.__VUE__  = new Vue({ el: "body" }),
            view  = mvue.__VIEW__ = $("body").query("mg-view");
        
        mvue.__STATE__ = {
            AUTH_BEFORE  : "",          // 验证失败的页面，用于回跳

            ROUTER_TYPE  : false,       // 路由事件触发加载方式
            ROUTER_AFTER : false,       // 路由事件执行状态

            PAGE_READY   : false,       // 页面加载状态
        }

        var tables = $.extend.apply({}, config.tables);

        mvue.location = new Router(tables, $.extend({
            /* 页面跳转前的回调方法 */
            before : function(lastUrl, nowUrl, match, that) {
                var mnow  = match[match.length-1],
                    STAT  = mvue.__STATE__, aret,
                    opt   = that.options,
                    apage = opt.authPage,
                    atest = opt.authCheck;

                STAT.ROUTER_AFTER = false;
                STAT.ROUTER_TYPE  = that.evetype;

                mvue.__PAGE__.PARAMS = mnow.para;

                if (apage && nowUrl != apage) {
                    var auth;   // 检测页面的Auth值，可继承父类

                    for (var i=match.length-1; i>=0; i--) {
                        if (match[i].item.auth !== undefined) {
                            auth = match[i].auth;
                            break;  // 跳出后续的检测
                        }
                    }

                    if (auth === undefined) {
                        auth = opt.authBase || 1;
                    }

                    if ($.isFun(opt.authCall)) {
                        aret = opt.authCall(nowUrl, auth, atest, lastUrl, that);
                    } else {
                        aret = auth <= atest;
                    }

                    /* false 当前页面未通过验证 */
                    if (aret === false) {
                        STAT.AUTH_BEFORE = nowUrl;
                        return false;   // 阻止后续程序执行
                    }
                }
            },

            /* 页面跳转成功后的回调方法 */
            after : function(lastUrl, nowUrl, match, that) {
                var STAT = mvue.__STATE__,
                    auth = that.options.authPage;

                STAT.ROUTER_AFTER = true;
            },

            always: function(lastUrl, nowUrl, match, that) {
                var STAT = mvue.__STATE__,
                    auth = that.options.authPage;

                if (STAT.AUTH_BEFORE && auth != nowUrl) {
                    that.go(auth, true);
                }
            },

            authBase  : 1,
            authCheck : 2,
        }, option || {})).init(repath);

        /* 返回到登陆页面的方法 */
        mvue.location.authRepath = function(set) {
            if (set !== undefined) {
                set = mvue.location.geturl(set);
                mvue.__STATE__.AUTH_BEFORE = set;
            } else {
                var before = mvue.__STATE__.AUTH_BEFORE,
                    home   = mvue.location.options.home;

                mvue.__STATE__.AUTH_BEFORE = "";
                mvue.location.go(before || home, true);
            }
        }
    }


    // APP路由初始化方法
    mvue.route = function(table) {
        config.tables.push(table)

        return this;
    }

    // 即时注册路由的方法，只能在 init 方法调用后执行
    mvue.when = function(url, option) {
        mvue.__ROUTER__.on(url, option);
    }

    // 加载页面方法
    window.loadView = function(page) {
        var pageData  = $.extend({}, page);
        pageData.data = $.extend(true, {}, page.data);

        var tmp = pageData.template,
            old, fix, defer, mixins, params;
        fix = old = tmp.match(/\<mg\-page.*\>/i)[0];

        // 尝试使用正则添加 v-transition 属性
        if (old.search("v-transition") == -1) {
            var trans = $$.__STATE__.ROUTER_TYPE == "back" ? "back" : "push";
            fix = fix.replace("<mg-page", "<mg-page v-transition='" + trans + "'");
        }

        // 将修改更新到模板字符串上
        pageData.template = pageData.template.replace(old, fix);
        pageData.replace = true;    // 统一设置属性为 replace

        // 修改对象的参数值，替换 000 为 空字符串
        params = $.extend({}, mvue.__PAGE__.PARAMS);
        for (var key in params) {
            if (params[key] == "000") {
                params[key] = "";
            }
        }
        pageData.data.params = params;

        defer = $.defer();          // 决定何时渲染
        if (typeof pageData.resolve == "function") {

            pageData.resolve(params, defer);
        } else {
            defer.done({});         // 无加载方法直接进入渲染
        }

        defer.then(function(init) {
            var rauth = mvue.__STATE__.AUTH_BEFORE,
                pauth = $$.location.options.authPage;

            if (rauth && $$.location.geturl() != pauth) {
                return false;
            }

            for (var key in init) {
                pageData.data[key] = init[key];
            }

            if (mvue.__PAGE__.HANDLE) {
                mvue.__PAGE__.HANDLE.$destroy(true);
            }

            mixins = {
                beforeDestroy: function() {
                    $$.__STATE__.PAGE_READY = false;


                    this.$broadcast("pageDestroy");
                },

                ready: function() {
                    $$.__STATE__.PAGE_READY = true;


                    this.$broadcast("pageReady");
                }
            }

            if (typeof pageData.mixins == "array") {
                pageData.mixins.push(mixins);
            } else {
                pageData.mixins = [mixins];
            }

            mvue.__PAGE__.HANDLE = new Vue(pageData).$mount();
            mvue.__VIEW__ && mvue.__PAGE__.HANDLE.$appendTo(mvue.__VIEW__);
        })
    };

    mvue.component = function(ids, opt) {
        if (opt /* 参数默认值全局设置 */) {
            if (opt.replace === undefined) {
                opt.replace = false;
            }
            if (opt.inherit === undefined) {
                opt.inherit = true;
            }
        }

        return Vue.component(ids, opt);
    }

    /* 加载常用工具方法 */
    require("./util/main.js");

    /* 加载默认的核心样式文件和组件 */
    require("./component/main.js");
});