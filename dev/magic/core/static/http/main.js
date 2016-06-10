module.exports = (function() {
    var http = {};

    http.jsonp = function(url, data) {
        var jsonp = require("jsonp"), callname, defer;

        defer = this.defer();       // 创建一个defer
        data  = data || {};         // data空是创建空对象

        // 如果传入了后台回调方法，则设置，否则默认
        callname = data.jsonp || "callback";
        data.jsonp && delete data.jsonp;    // 删除属性

        // 参数过滤，剔除空值
        for (var key in data) {
            if (!data[key]) {
                delete data[key];
            }
        }

        jsonp({ url: url, data: data,
            callbackName: callname,
            success: function(data) {
                defer.resolve(data)
            }
        })

        return defer;   // 返回参数
    };

    Magic.extend(http);
})();
