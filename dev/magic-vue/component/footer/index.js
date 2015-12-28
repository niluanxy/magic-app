module.exports = (function() {
    $$.component("mg-footer", {
        template: "<slot></slot>",
        ready: function() {
            var $el = $(this.$el);
            $el.addClass("bar bar-footer")
        }
    });
})();