module.exports = (function() {
    var check = {}, _UTIL = require("util");

    check.isFun = _UTIL.isFun;
    check.isArray = _UTIL.isArray;
    check.isObject = _UTIL.isObject;

    Magic.extend(check)
})();
