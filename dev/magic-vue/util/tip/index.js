module.exports = (function() {
    var $tip = $.tip(), $loading = $.tip('', {type: "loading"});

    $$.tip = function(text, option) {
        if (!text) return;
        $tip.show(text, option);
    };

    $$.error = function(text, option) {
        if (!text) return;
        $tip.show("操作失败，"+text, option);
    }
    
    $$.tipHide = function() { $tip.hide(); };

    $$.loading = function() {
        $loading.show();
    }

    $$.loadingHide = function() {
        $loading.hide();
    }
})();