module.exports = (function() {
    /*=================================================
     *  key 数据持久化相关方法
     *=================================================*/
    $$.key = function(key, val) {
        if (val !== undefined) {
            localStorage.setItem(key, val);
            return val; // 返回设置的值
        } else {
            return localStorage.getItem(key);
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
        if (vobj[key] === undefined) {
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