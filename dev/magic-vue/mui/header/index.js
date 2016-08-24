module.exports = (function() {
    $$.component("mg-header", {
    	template: "<slot></slot>",
        ready: function() {
            var $el = $(this.$el);

            if (window.MgNative) {
                $el.addClass("hide");
            } else {
                $el.addClass("bar bar-header");
            }
        }
    });
})();
