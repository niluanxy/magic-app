module.exports = (function() {
    $$.component("mg-modal", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el), handle = $el.attr("handle");

            if (this[handle] !== undefined) {
                $el.addClass("modal hideOut");
                this[handle] = $el.modal({
                    align   : $el.attr("align"),
                    autoHide: $el.attr("autoHide")
                });

                this[handle].el.children().addClass("modal_body");
            } else {
                $el.addClass("hide");
            }
        }
    });
})();