module.exports = (function() {
    Vue.component("mg-header", {
        template: "<content></content>",
        replace: false,
        inherit: true,
        ready: function() {
            var $el = $(this.$el);
            $el.addClass("bar bar-header")
        }
    });

    Vue.component("mg-footer", {
        template: "<content></content>",
        replace: false,
        inherit: true,
        ready: function() {
            var $el = $(this.$el);
            $el.addClass("bar bar-footer")
        }
    });
})();