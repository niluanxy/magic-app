module.exports = (function() {
    Vue.component("mg-tabs", {
        template: "<content></content>",
        inherit: true,
        ready: function() {
            var $el = $(this.$el), tabs, $item, hash, 
                match, $child, toggle;

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

                if ($child.length && $child.attr("toggle") !== null) {
                    var cls = {}, item, key, val;
                    toggle = $child.attr("toggle").split(",");

                    for(var j=0; j<toggle.length; j++) {
                        item = toggle[j];
                        key = item.match(/.*(?=\:)/)[0];
                        key = key.replace(/\s*/, '');
                        cls[key] = item.replace(/^.*\:\s*/, "");
                    }

                    if ($item.hasClass("actived")) {
                        $child.addClass(cls.on);
                        $child.removeClass(cls.off);
                    } else {
                        $child.removeClass(cls.on);
                        $child.addClass(cls.off);
                    }

                    $child.removeAttr("toggle");
                }

                $item.removeAttr("match");
            }

            $el.addClass("tabs");
        }
    })
})();