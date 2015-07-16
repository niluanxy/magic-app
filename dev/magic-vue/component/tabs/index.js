module.exports = (function() {
    $$.component("mg-tabs", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el), tabs, $item, hash, 
                match, $child;

            tabs = $el.query(".tab-item");
            hash = location.hash.replace(/^\#[\\|\/]/, "#");

            for(var i=0; i<tabs.length; i++) {
                $item = $(tabs[i]);
                match = $item.attr("match");

                if ((match && hash.match(match)) ||
                    ($item.attr("href") == hash)) {
                    $item.addClass("actived");
                }

                $child = $item.find(".icon");

                if ($child.length && $child.attr("toggle")) {
                    var toggle = $child.attr("toggle"),
                        cls    = $.parseJSON(toggle),
                        active = $item.hasClass("actived");

                    $child.switchClass(cls, active);
                    $child.removeAttr("toggle");
                }

                $item.removeAttr("match");
            }

            $el.addClass("tabs");
        }
    })
})();