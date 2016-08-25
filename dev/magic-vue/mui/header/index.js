module.exports = (function() {
    $$.component("mg-header", {
    	template: "<slot></slot>",
        ready: function() {
            var $el = $(this.$el);

            $el.addClass("bar bar-header");
        }
    });
})();
