module.exports = (function() {
    $$.component("mg-footer", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el);
            $el.addClass("bar bar-footer")
        }
    });
})();