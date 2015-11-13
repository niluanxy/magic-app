require("./lib/magic.js");

$(function() {
    var mvue, config = {tables: []}, Router = require("./lib/route.js");

    window.$$ = mvue = {
        location  : null,       // 全局ROUTER对象

        __VUE__   : null,       // 全局VUE对象
        __VIEW__  : null,       // 全局MG-VIEW对象
        __PAGE__  : {},         // 当前页面对象
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
            AUTH_HASRUN  : false,       // 记录验证页面是否已调用
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
                mvue.__PAGE__.ROUTER = match;

                if (apage && nowUrl != apage) {
                    var auth;   // 检测页面的Auth值，可继承父类

                    for (var i=match.length-1; i>=0; i--) {
                        if (match[i].item.auth !== undefined) {
                            auth = match[i].item.auth;
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
                mvue.__STATE__.ROUTER_AFTER = true;

                vue.$broadcast("routeChange", nowUrl);
            },

            always: function(lastUrl, nowUrl, match, that) {
                var STAT = mvue.__STATE__,
                    auth = that.options.authPage;

                if (!STAT.AUTH_HASRUN && STAT.AUTH_BEFORE) {
                    STAT.AUTH_HASRUN = true;
                    that.go(auth, true);
                } else if (STAT.AUTH_HASRUN) {
                    STAT.AUTH_BEFORE = "";
                    STAT.AUTH_HASRUN = false;
                }
            },

            authBase  : 1,
            authCheck : 2,
        }, option || {})).init(repath);

        /* 返回到登陆页面的方法 */
        mvue.location.authRepath = function(set, togo) {
            var option   = mvue.location.options,
                location = mvue.location,
                STAT     = mvue.__STATE__;

            if (set !== undefined) {
                set = location.geturl(set);
                STAT.AUTH_BEFORE = set;

                if (togo === true) {
                    location.go(option.authPage, true);
                    STAT.AUTH_HASRUN = true;
                }
            } else {
                STAT.AUTH_BEFORE = "";
                STAT.AUTH_HASRUN = false;
                // location.go(STAT.AUTH_BEFORE || option.home, true);
                location.go(option.home, true);
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

    // 创建正在加载中页面
    function makeView(match, url) {
        var last = match[match.length-1].item, html;

        html = '<mg-page v-transition="push" class="_load_" url="{{url}}"">'+
                    '<div class="bar bar-header">'+
                        '<mg-back></mg-back><h3 class="title">{{title}}</h3>'+
                    '</div>'+
                    '<div class="content has-header"><div class="tip"></div></div>'+
                '</mg-page>';

        html = $.tpl(html, {title: last.title, url: url||''});
        if (last.back === false) {
            html = html.replace("<mg-back></mg-back>", "");
        }
        if (last.head === false) {
            var reg = new RegExp('<div class="bar bar-header">.*</h3></div>')
            html = html.replace(reg, "").replace("has-header", "");
        }

        return html;
    }

    mvue.clearLoad = function(url) {
        var lpage = $(mvue.__VIEW__).query("._load_");

        if (lpage instanceof Element) lpage = [lpage];

        if (lpage && lpage.length) {
            for(var i=0; i<lpage.length; i++) {
                var $item = $(lpage[i]);

                if (url && $item.attr("url") != url) {
                    continue;
                }

                $item.remove();     // 删除元素
            }
        }
    }

    // 加载页面方法
    window.loadView = function(page) {
        var pageData = $.extend({}, page), PAGE = mvue.__PAGE__, load,
            VIEW = mvue.__VIEW__, defer, mixins, params, ltime, nowurl;

        /* 默认页面属性设置 */
        pageData.data = $.extend(true, {}, page.data);
        pageData.replace = true;    // 统一设置属性为 replace

        /* 预先模拟加载中的效果 */
        mvue.clearLoad(); nowurl = mvue.location.geturl();
        load = {template: makeView(PAGE.ROUTER, nowurl), replace: true};
        PAGE.LOAD = new Vue(load).$mount().$appendTo(VIEW);
        ltime = $.getTime();


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

            for (var key in init) {
                pageData.data[key] = init[key];
            }

            if (PAGE.HANDLE) {
                PAGE.HANDLE.$destroy(true);
            }

            mixins = {
                beforeDestroy: function() {
                    $$.__STATE__.PAGE_READY = false;

                    this.$broadcast("pageDestroy");
                    this.$emit("pageDestroyDirect");
                },

                ready: function() {
                    $$.__STATE__.PAGE_READY = true;

                    this.$broadcast("pageReady");
                    this.$emit("pageReadyDirect");
                }
            }

            if (typeof pageData.mixins == "array") {
                pageData.mixins.push(mixins);
            } else {
                pageData.mixins = [mixins];
            }

            PAGE.HANDLE = new Vue(pageData).$mount();

            var fixTime = (ltime+600) - $.getTime();
            setTimeout(function() {
                VIEW && PAGE.HANDLE.$appendTo(VIEW);

                mvue.clearLoad();
            }, fixTime > 0 ? fixTime : 0);
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