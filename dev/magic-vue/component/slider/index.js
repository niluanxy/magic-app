module.exports = (function() {
    $$.component("mg-slider", {
        template: "<slot></slot>",
        ready: function() {
            var $el = $(this.$el), handle, $slider, scope;

            scope = $$._getPage(this);

            $slider = $el.addClass("slider").slider({
                time     : $el.attr("time"),
                autoPlay : $el.attr("autoPlay"),
                describe : $el.attr("describe"),
                indicator: $el.attr("indicator"),
                scale    : $el.attr("scale"),
                enter    : scope[$el.attr("enter")],
                leave    : scope[$el.attr("leave")]
            });

            handle = $el.attr("handle");
            if (handle && scope[handle] !== undefined) {
                scope[handle] = $slider;
            }
        }
    })
})();