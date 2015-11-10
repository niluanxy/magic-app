module.exports = (function() {
    function fixMatch(str) {
        return str?str.replace(/^\#*[\\|\/]*/, ""):'';
    }

    function checkMatch($item, check) {
        if ($item && check) {
            var match = $item.attr("match");
            if ($item.attr("href") == check) {
                return true;
            } else if (new RegExp(match).test(check)) {
                return true;
            }
        }

        return false;
    }

    $$.component("mg-nav-tabs", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el), tabs, $item, $child;

            tabs = $el.query(".tab-item");

            $el.addClass("tabs tabs-footer");

            this.$on("routeChange", function(url) {
                for(var i=0; i<tabs.length; i++) {
                    $item  = $(tabs[i]);
                    $child = $item.find(".icon");

                    if (checkMatch($item, url)) {
                        $item.addClass("actived");
                    } else {
                        $item.removeClass("actived");
                    }

                    if ($child.length && $child.attr("toggle")) {
                        var toggle = $child.attr("toggle"),
                            cls    = $.parseJSON(toggle),
                            active = $item.hasClass("actived");

                        $child.switchClass(cls, active);
                    }
                }

                if (!$el.find('.actived').length) {
                    $el.addClass("hide");
                } else {
                    $el.removeClass("hide");
                }
            })
        }
    })
})();