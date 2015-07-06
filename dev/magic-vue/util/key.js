module.exports = (function() {
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
})();