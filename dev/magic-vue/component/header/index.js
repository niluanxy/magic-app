module.exports = (function() {
    $$.component("mg-header", {
        template: "<content></content>",
        ready: function() {
            $(this.$el).addClass("bar bar-header");
        }
    });
})();