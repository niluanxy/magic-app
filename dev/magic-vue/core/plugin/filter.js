module.exports = (function() {
    var $$ = window.mvue;

    /**
     * filter 指令注册器，注册后会自动生成命名空间
     */
    $$.filter = function(name, fun) {
        Vue.filter(name, fun);
        $$.filter[name] = fun;

        return $$.filter;
    };
})();
