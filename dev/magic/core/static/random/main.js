module.exports = (function() {
    var random = {}, _UTIL = require("util");

    /* 返回一个随机数字字符串 */
    random.getRandom = _UTIL.getRandom;

    /* 返回当前时间的时间戳 */
    random.getTime = _UTIL.getTime;

    random.getCode = function(prefix, min, max) {
        prefix = prefix || "YYYYMMDD";

        var code = $.time.format(new Date(), prefix);

        code = code + (min && max ? $.getRandom(min, max) : "");

        return code;
    };

    Magic.extend(random);
})();
