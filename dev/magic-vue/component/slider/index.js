module.exports = (function() {
    Vue.component("mg-slider", {
        template: "<content></content>",
        replace: false,
        inherit: true,
        ready: function() {
            var $el = $(this.$el), handle, $slider;

            $slider = $el.addClass("slider").slider({
                time     : $el.attr("time"),
                autoPlay : $el.attr("autoPlay"),
                describe : $el.attr("describe"),
                indicator: $el.attr("indicator"),
                scale    : $el.attr("scale")
            });

            handle = $el.attr("handle");
            if (handle && this[handle]) {
                this[handle] = $slider;
            }
        }
    })
})();