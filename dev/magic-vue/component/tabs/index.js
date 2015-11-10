module.exports = (function() {
    $$.component("mg-tabs", {
        template: "<content></content>",
        ready: function() {
            $(this.$el).addClass("tabs");
        }
    })
})();