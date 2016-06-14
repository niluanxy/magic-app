module.exports = (function() {
    /*=================================================
     *  key 数据持久化相关方法
     *=================================================*/
    $$.__key_null   = "__KEY__NULL_v0.3.0";
    $$.__key_prefix = "";

    $$.key = (function() {
        if (window.$J && $J.call) {
            var _FUN = "MgNative.key";

            return function(key, val) {
                var args = {key: key};

                if (val !== undefined) {
                    args.val = val;

                    $J.call(_FUN, args);
                    return val;
                } else {
                    return $J.call(_FUN, args);
                }
            }
        } else {
            return function(key, val) {
                var val_fix, key_fix; // 修复读取值为null自动转为字符串

                key_fix = $$.__key_prefix + key;

                if (val !== undefined) {
                    val = JSON.stringify(val);
                    val_fix = val==null?$$.__key_null:val;

                    localStorage.setItem(key_fix, val_fix);
                    return val; // 返回设置的值
                } else {
                    val_fix = localStorage.getItem(key_fix);
                    val_fix = JSON.parse(val_fix);

                    return val_fix==$$.__key_null?null:val_fix;
                }
            };
        }
    })();

    $$.keyRemove = function(key) {
        var key_fix = $$.__key_prefix + key;

        localStorage.removeItem(key_fix);
    };

    /*=================================================
     *  objParse 复杂数据解析方法
     *=================================================*/
    $$.objParse = function(obj, str, exobj) {
        if (!obj || !str) return undefined;

        var key, len, arr, vobj = obj;
        arr = str.split(".");
        len = arr.length - 1;

        for(var i=0; i<len; i++) {
            key = arr[i];
            if (key && vobj[key] !== undefined) {
                vobj = vobj[key];
            } else {
                break;
            }
        }

        key = arr[len];     // 校验对象是否合法
        if (!vobj || vobj[key] === undefined) {
            return undefined;
        } else {
            var set = exobj || new Object,
                val = exobj ? arr[len] : "val";

            return Object.defineProperty(set, val, {
                get : function () {
                    return vobj[key];
                },
                set : function (val) {
                    vobj[key] = val;
                }
            });
        }
    };

    $$.objBind = function(obj, key, bind, bkey) {
        if (!obj || !key || !bind) return;

        bkey = bkey || key;

        Object.defineProperty(bind, bkey, {
            get: function() {
                return obj[key];
            },

            set: function(val) {
                var calls = bind.$calls;
                obj[key] = val;

                if (calls && calls.findBy) {
                    var watch = calls.findBy("name", bkey);
                    watch && watch.call && watch.call.call(bind, val);
                }
            }
        });

        if (!$.isFun(bind.$watch)) {
            var $calls = bind.$calls = [];
            bind.$watch = function(value, fun) {
                $calls.push({ name: value, call: fun });
            }
        }

        return bind;
    }

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
