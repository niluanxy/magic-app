require("./style.scss");

module.exports = (function() {
    $$.component("mg-view", {
        template: "<content></content>",
        inherit: false,
        ready: function() {
            var $el = $(this.$el);
            $el.addClass("mg-view");

            if ($plug.platform == "ios" &&
            	$plug.runtime  == "cordova") {

            	$el.css("top", "20px");
            }

            $("body").addClass("run-ios");
        }
    });
})();