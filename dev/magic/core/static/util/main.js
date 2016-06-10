module.exports = (function() {
    var util = {}, _UTIL = require("util"), _TPL = require("templayed");

    /* 简单的查询方法，返回标准的dom对象 */
    util.query = require("query"),

    /* 简易的模板引擎 */
    util.tpl = function(template, datas) {
        var html = "";

        if (template != undefined) {
            html = _TPL(template)(datas);
        }

        return html;    // 返回渲染后的数据
    },

    util.slice = function(args, start, end) {
        var ret = []; start = start || 0;

        for(var i=start; i<args.length; i++) {
            if (end && i > end) {
                console.log("break")
                break;
            }

            ret.push(args[i]);
        }

        return ret;
    };

    /* 返回一个节流执行的函数 */
    util.delayCall = _UTIL.delayCall;

    /* 返回一个只执行一次的方法 */
    util.onceCall = _UTIL.onceCall;

    /* promise 的支持 */
    util.defer = (function() {
        var promise = require("promise"), ret;

        ret = function() {
            return new promise();
        }

        for(var key in promise) {
            if (_UTIL.isFun(promise[key])) {
                ret[key] = promise[key];
            }
        }

        return ret;     // 返回操作的对象
    })();

    /* 一个简易的转换json的方法 */
    util.parseJSON = function(str) {
        // 去掉首尾括号,方便后续处理
        str = str.replace(/^\{+/, '');
        str = str.replace(/\}+$/, '');

        var arr = str.split(","), item, key, ret = {};

        for(var i=0; i<arr.length; i++) {
            item = arr[i];
            item = item.replace(/\s+/g, ' ');
            item = item.replace(/[\'*|\"*]/g, '');
            key  = item.match(/.*(?=\:)/)[0];
            key  = key.replace(/\s+/g, '');
            ret[key] = item.replace(/^.*\:\s*/g, "");
        }

        return ret;
    };

    Magic.extend(util);
})();
