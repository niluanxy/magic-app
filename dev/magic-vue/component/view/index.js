require("./style.scss");

module.exports = (function() {
    $$.component("mg-view", {
        inherit: false,
        ready: function() {
            var $el = $(this.$el);
            $el.addClass("mg-view");

            if ($.platform == "ios") {
                switch ($.runtime) {
                    case "cordova":
                        $el.css("top", "20px");
                        $("body").addClass("run-ios");
                        break;
                    case "mgnative" :
                        $el.css("top", "1px");
                        break;
                }
            }
        }
    });
})();