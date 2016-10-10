module.exports = (function() {
    var $$ = window.mvue;

    /*=================================================
     *  key 数据持久化相关方法
     *=================================================*/
    $$.__key_null   = "__KEY__NULL_v0.3.0";
    $$.__key_prefix = "";

    $$.key = (function() {
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
    })();

    $$.keyRemove = (function(key) {
        return function(key) {
            var key_fix = $$.__key_prefix + key;
            localStorage.removeItem(key_fix);
        }
    })();

    $$.keyClear = (function() {
        return function() {
            localStorage.clear();
        }
    })();
})();
