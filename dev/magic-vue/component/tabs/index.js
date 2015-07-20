module.exports = (function() {
    function fixMatch(str) {
        return str?str.replace(/^\#*[\\|\/]*/, ""):'';
    }

    function checkMatch($item, check) {
        if ($item && check) {
            var match = $item.attr("match"), href;
            if ( check.match($item.attr("match")) ) {
                return true;
            } else if ( check.match(fixMatch(
                            $item.attr("href"))) ) {
                return true;
            }
        }

        return false;
    }

    $$.component("mg-tabs", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el), tabs, 
                $item, hash, $child;

            tabs = $el.query(".tab-item");
            hash = fixMatch(location.hash);

            for(var i=0; i<tabs.length; i++) {
                $item  = $(tabs[i]);
                $child = $item.find(".icon");

                if (checkMatch($item, hash)) {
                    $item.addClass("actived");
                }

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