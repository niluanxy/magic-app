module.exports = (function() {
    var $el = $($$.__VIEW__), $tip = $.tip();

    $$.tip = function(text, option) {
        $tip.show(text, option);
    };

    $$.tipHide = function() {
        $tip.hide();
    }
})();