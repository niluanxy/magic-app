require("./lib/magic.js");

$(function() {
    var mvue, Router, mroute = {}, mconfig, loadView, spinner;

    // 路由和magic对象初始化
    Router = require("./lib/director.js").Router;
    mvue = {
        __VUE__   : null,       // 全局VUE对象
        __PAGE__  : null,       // 当前MG-PAGE对象
        __VIEW__  : null,       // 全局MG-VIEW对象
        __ROUTER__: null,       // 全局ROUTER对象
    };

    // 创建全局的VUE对象
    mvue.__VUE__ = new Vue({
        el: "body",
        data: {
            cacheView : [],
            pageParams: {},
        },
        ready: function() {
            var $view = $(this.$el).query("mg-view");
            mvue.__VIEW__ = $view;
        }
    })

    // APP初始化方法
    mvue.init = function() {
        $$.key("_magic_runid", $.getRandom());
        mroute.notfound = function() {
            location.hash = "#index";
        }
        this.__ROUTER__ = Router(mroute).init();
        if (!location.href.match(/#/)) {
            location.hash = "#index";
        }
    }

    // APP添加路由方法
    mvue.when = function(url, call) {
        mroute[url] = {
            on: call,
            before: loadBefore(url)
        };
        return this;
    }

    spinner = $.tip("", {type: "loading", delay: "short"});

    // 加载页面方法
    loadView = function(pageData) {
        var tmp = pageData.template, old, fix, defer, mixins;
        fix = old = tmp.match(/\<mg\-page.*\>/i)[0];

        // 尝试使用正则添加 v-transition 属性
        if (old.search("v-transition") == -1) {
            fix = fix.replace("<mg-page", "<mg-page v-transition");
        }

        // 将修改更新到模板字符串上
        pageData.template = pageData.template.replace(old, fix);
        pageData.replace = true;    // 统一设置属性为 replace

        defer = $.defer();          // 决定何时渲染
        if (typeof pageData.resolve == "function") {
            spinner.show();     // 显示加载中动画效果

            var params = $.extend({},mvue.__VUE__.pageParams);

            for (var key in params) {
                if (params[key] == "000") {
                    params[key] = "";
                }
            }

            pageData.data.params = params;
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
                    this.$broadcast("pageDestroy")
                }
            }

            if (typeof pageData.mixins == "array") {
                pageData.mixins.push(mixins);
            } else {
                pageData.mixins = [mixins];
            }

            mvue.__PAGE__ = new Vue(pageData).$mount();
            mvue.__VIEW__ && mvue.__PAGE__.$appendTo(mvue.__VIEW__);
            spinner.hide();     // 隐藏加载中动画效果
        })
    };

    // 页面家在前的方法，用于设置变量名
    function loadBefore(seturl) {
        return function() {
            var old, now = location.href.match(/\#\/?.*$/)[0];
            // 全部转URL为数组，方便后面匹配赋值
            now = now.replace(/\#\/?/, '/').split('/');
            old = seturl.split("/");

            mvue.__VUE__.pageParams = {};  // 设为空值

            if (now /* 匹配到值才继续执行 */) {
                for(var i=0; i<old.length; i++) {
                    if (old[i].indexOf(":") > -1) {
                        var key = old[i].replace(":", '');
                        mvue.__VUE__.pageParams[key] = now[i]
                    }
                }
            }
        }
    }

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

    // 将方法暴漏出来
    window.loadView = loadView;
    window.$$       = mvue;

    require("./util/main.js");      // 加载常用工具方法
    /* 加载默认的核心样式文件和组件 */
    require("./component/main.js");
});