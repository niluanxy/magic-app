module.exports = (function() {
    var $$ = window.mvue;

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

        if (key.match(/^.+\..+$/)) {
            var arrs = key.split(".");

            for(var i=0; i<arrs.length-1; i++) {
                var key = arrs[i];
                obj = obj[key];
            }

            key = arrs[i];
        } else {
            key = key.replace(".", '');
        }

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
})();
