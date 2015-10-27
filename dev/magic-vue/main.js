require("./lib/magic.js");

$(function() {
    var mvue, config = {}, Router = require("./lib/route.js");

    window.$$ = mvue = {
        location  : null,       // 全局ROUTER对象

        __VUE__   : null,       // 全局VUE对象
        __VIEW__  : null,       // 全局MG-VIEW对象
        __PAGE__  : null,       // 当前页面对象
        __CACHE__ : null,       // 全局页面缓存
        __PARAMS__: null,       // 当前URL的参数值

        __STATE__ : null,         // 记录当前APP各种状态
    };

    // APP初始化方法
    mvue.init = function(repath) {
        $$.key("__MAGIC_RUNID", $.getRandom());

        var vue   = mvue.__VUE__  = new Vue({ el: "body" }),
            view  = mvue.__VIEW__ = $("body").query("mg-view");
        
        mvue.__STATE__ = {
            ROUTER_TYPE  : false,       // 路由事件触发加载方式
            ROUTER_AFTER : false,       // 路由事件执行状态

            PAGE_READY   : false,       // 页面加载状态
        }

        config.router = $({}, config)

        mvue.location = new Router(config.tables, $.extend(config.router, {
            /* 页面跳转前的回调方法 */
            before : function(last, now, match, that) {
                var last = match[match.length-1],
                    STAT = mvue.__STATE__;

                STAT.ROUTER_AFTER = false;
                STAT.ROUTER_TYPE  = that.evetype;

                mvue.__PARAMS__ = last.para;
            },

            /* 页面跳转成功后的回调方法 */
            after : function(last, now, match, that) {
                var STAT = mvue.__STATE__;

                STAT.ROUTER_AFTER = true;
            }
        })).init(repath);
    }


    // APP路由初始化方法
    mvue.route = function(tables, option) {
        config.tables = tables;
        config.router = option;

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
        params = $.extend({}, mvue.__PARAMS__);
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
            for (var key in init) {
                pageData.data[key] = init[key];
            }

            if (mvue.__PAGE__) {
                mvue.__PAGE__.$destroy(true);
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

            mvue.__PAGE__ = new Vue(pageData).$mount();
            mvue.__VIEW__ && mvue.__PAGE__.$appendTo(mvue.__VIEW__);
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