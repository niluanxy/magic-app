module.exports = (function() {
    var $$ = window.mvue;

    /**
     * 清除 getter 和 setter 方法，输出纯净信息
     * @param  {object} obj [要输出的对象]
     */
    $$.log = function(obj, call) {
        function clear(child) {
            var ret = {}, type, ftype;

            ftype = typeof child;

            if (ftype == "string"  ||
                ftype == "number"  ||
                ftype == "boolean" ||
                child == null || child == NaN) {

                ret = child; // 值对象直接返回
            } else {
                if (child instanceof Array) {
                    ret = [];
                }

                for(var key in child) {
                    type = typeof child[key];

                    if (type == "function") {
                        break;
                    } else if (type == "object") {
                        ret[key] = clear(child[key])
                    } else {
                        ret[key] = child[key];
                    }
                }
            }

            return ret;
        }

        call = call ? call : "log";
        console[call](clear(obj));
    }
})();
