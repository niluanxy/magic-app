module.exports = (function() {
    $$.component("mg-header", {
    	template: "<slot></slot>",
        ready: function() {
            $(this.$el).addClass("bar bar-header");
        }
    });
})();