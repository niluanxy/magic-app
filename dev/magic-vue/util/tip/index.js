module.exports = (function() {
    var $el = $($$.__VIEW__), $tip = $.tip();

    $$.tip = function(text, option) {
        if (!text) return;
        $tip.show(text, option);
    };

    $$.error = function(text, option) {
        if (!text) return;
        $tip.show("操作失败，"+text, option);
    }
    
    $$.tipHide = function() {
        $tip.hide();
    }
})();