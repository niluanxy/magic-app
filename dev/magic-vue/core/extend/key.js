module.exports = (function() {
    var $$ = window.mvue;

    /*=================================================
     *  key 数据持久化相关方法
     *=================================================*/
    $$.__key_null   = "__KEY__NULL_v0.3.0";
    $$.__key_prefix = "";

    $$.key = (function() {
        if (window.MgNative && MgNative.core) {
            var keyCall = MgNative.core.key,
                valFix = /(\"_\#b_|_b\#_\"|\"_\#i_|_i\#_\"|\"_\#o_|_o\#_\")/g;

            return function(key, val) {
                var args = {key: key}, ret;

                if (val !== undefined) {
                    ret = val;  // 储存返回数据

                    // 保存是转换数据格式为字符串
                    switch(typeof val) {
                        case "number":
                            val = '_#i_'+val+'_i#_';
                            break;
                        case "boolean":
                            val = '_#b_'+val+'_b#_';
                            break;
                        case "undefined":
                            val = '_#o_'+val+'_o#_';
                            break;
                        default: 
                            if (val == null) {
                                val = '_#o_'+val+'_o#_';
                            }
                    }

                    args.val = JSON.stringify(val); keyCall(args);
                } else {
                    ret = keyCall(args);

                    // 读取时逆向还原数据
                    ret = ret.replace(valFix, '');
                    ret = ret.replace(/\'/g, '"');
                    ret = ret.replace(/\"\{/g, '{');
                    ret = ret.replace(/\}\"/g, '}');

                    ret = JSON.parse(ret);
                }

                return ret;
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

    $$.keyRemove = (function(key) {
        if (window.MgNative && MgNative.core) {
            var keyCall = MgNative.core.keyRemove;

            return function(key) {
                keyCall({key: key});
            }
        } else {
            return function(key) {
                var key_fix = $$.__key_prefix + key;
                localStorage.removeItem(key_fix);
            }
        }
    })();

    $$.keyClear = (function() {
        if (window.MgNative && MgNative.core) {
            var keyCall = MgNative.core.keyClear;

            return function() {
                keyCall();
            }
        } else {
            return function() {
                localStorage.clear();
            }
        }
    })();
})();
