module.exports = (function() {
    $$.component("mg-slider", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el), handle, $slider;

            $slider = $el.addClass("slider").slider({
                time     : $el.attr("time"),
                autoPlay : $el.attr("autoPlay"),
                describe : $el.attr("describe"),
                indicator: $el.attr("indicator"),
                scale    : $el.attr("scale"),
                call     : this[$el.attr("call")]
            });

            handle = $el.attr("handle");
            if (handle && this[handle] !== undefined) {
                this[handle] = $slider;
            }
        }
    })
})();