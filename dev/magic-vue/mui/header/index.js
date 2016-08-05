module.exports = (function() {
    $$.component("mg-header", {
    	template: "<slot></slot>",
        ready: function() {
            if (window.MgNative) {
                $(this.$el).remove();
            } else {
                $(this.$el).addClass("bar bar-header");
            }
        }
    });
})();
