module.exports = (function() {
    /*=================================================
     *  系统路由方法
     *=================================================*/
    var route  = require("../../lib/director.js").Router,
        MROUTE = {}, NOW = {}, PARAMS = {}, PATHS = {},
        MAP = {
            "onbefore": "before",   // 加载前
            "onload"  : "on",       // 加载中
            "onleave" : "after",    // 离开前
            "once"    : "once"      // 执行一次
        };

    /*=================================================
     *  路由全局方法部分
     *=================================================*/
    
    /**
     * 跳转到某个新URL
     * @param  {String}     url   [目的地址]
     * @param  {Boolean}    clean [跳转后是否清除记录]
     * @param  {Function}   call  [跳转成功回调]
     */
    MROUTE.go = function(url, clean, call) {

    }

    /**
     * 返回到某个或上一个URL
     * @param  {Boolean}    clean [返回时清除当前记录]
     */
    MROUTE.back = function(clean) {

    }

    /**
     * 清除当前URL的记录
     * @param  {Integer}    index [要移除的URL索引]
     * @param  {Function}   call  [清除成功后的回调]
     */
    MROUTE.remove = function(index, call) {

    }

    /**
     * 返回当前URL的参数列表
     * @return {Object}     [当前URL的参数列表]
     */
    MROUTE.params = function() {

    }

    /**
     * 通过传入URL和当前的HASH,返回一个参数列表
     * @param  {String}     url [路由定义时的URL]
     * @return {Object}         [参数列表]
     */
    function bindParams(url) {
        return function() {
            PARAMS = {};    // 设置值为空

            var old, hash = location.hash;
            // 全部转URL为数组，方便后面匹配赋值
            hash = now.replace(/\#\/?/, '/').split('/');
            old  = seturl.split("/");

            if (now /* 匹配到值才继续执行 */) {
                for(var i=0; i<old.length; i++) {
                    if (old[i].indexOf(":") > -1) {
                        var key = old[i].replace(":", '');
                        params[key] = now[i]
                    }
                }
            }
        }
    }

    /**
     * 动态注册一个新路由
     * @param  {String}     url    [匹配URL]
     * @param  {object}     option [参数选项]
     */
    MROUTE.when = function(url, option) {
        if (url && option /* 参数必须完整 */) {
            if (typeof option == "function") {
                PATHS[url] = { on: option };
            } else if (typeof option == "object") {
                var opt = {}, fix, key;

                for(key in MAP /* 修正参数名 */) {
                    if (option[key]) {
                        fix = MAP[key]; // 获取key
                        opt[fix] = option[key];
                    }
                }

                PATHS[url] = opt;
            }
        }  
    }

    /**
     * 启动路由监听
     * @return {MROUTE}     [当前路由操作句柄]
     */
    MROUTE.init = function() {

    }

    /*=================================================
     *  路由全局事件
     *=================================================*/
    
    /**
     * 页面后退时的方法
     * @param  {Function}   call    [返回时的回调]
     */
    MROUTE.onback = function(call) {
        
    }

    /**
     * URL加载前的回调
     * @param  {Function}   call    [URL加载前的回调]
     */
    MROUTE.onbefore = function(call) {

    }

    /**
     * URL加载时的方法
     * @param  {Function}   call    [URL加载时的回调]
     */
    MROUTE.onload = function(call) {

    }

    /**
     * URL注销前的方法
     * @param  {Function}   call    [URL离开时的回调]
     */
    MROUTE.onleave = function(call) {

    }

    /**
     * URL加载时只执行一次的方法
     * @param  {Function}   call    [加载时只执行一次的回调]
     */
    MROUTE.once = function(call) {

    }
})();