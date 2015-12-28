module.exports = (function() {
    $$.component("mg-tabs", {
        template: "<slot></slot>",
        ready: function() {
            $(this.$el).addClass("tabs");
        }
    })
})();