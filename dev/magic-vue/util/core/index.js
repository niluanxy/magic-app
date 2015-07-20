module.exports = (function() {
    /*=================================================
     *  key 数据持久化相关方法
     *=================================================*/
    $$.__key_null = "__KEY__NULL_v0.3.0";

    $$.key = function(key, val) {
        var fix; // 修复读取值为null自动转为字符串
        if (val !== undefined) {
            fix = val==null?$$.__key_null:val;
            localStorage.setItem(key, fix);
            return val; // 返回设置的值
        } else {
            fix = localStorage.getItem(key);
            return fix==$$.__key_null?null:fix;
        }
    };

    $$.keyRemove = function(key) {
        localStorage.removeItem(key);
    };

    /*=================================================
     *  objParse 复杂数据解析方法
     *=================================================*/
    $$.objParse = function(obj, str) {
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
            return undefined
        } else {
            return Object.defineProperty(new Object, "val", {
                get : function () {
                    return vobj[key];
                },
                set : function (val) {
                    vobj[key] = val;
                }
            });
        }
    }
})();