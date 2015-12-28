module.exports = (function() {
    $$.component("mg-slider", {
        template: "<slot></slot>",
        ready: function() {
            var $el = $(this.$el), handle, $slider;

            $slider = $el.addClass("slider").slider({
                time     : $el.attr("time"),
                autoPlay : $el.attr("autoPlay"),
                describe : $el.attr("describe"),
                indicator: $el.attr("indicator"),
                scale    : $el.attr("scale"),
                enter    : this[$el.attr("enter")],
                leave    : this[$el.attr("leave")]
            });

            handle = $el.attr("handle");
            if (handle && this[handle] !== undefined) {
                this[handle] = $slider;
            }
        }
    })
})();