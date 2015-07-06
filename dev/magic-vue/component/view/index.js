require("./style.scss");

module.exports = (function() {
    Vue.component("mg-view", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el);
            $el.addClass("mg-view");
        }
    });
})();