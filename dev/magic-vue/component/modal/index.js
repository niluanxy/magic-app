module.exports = (function() {
    $$.component("mg-modal", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el), handle = $el.attr("handle"), page, clen;

            if (this[handle] !== undefined) {
                page = $el.find("mg-content").length || $el.attr("page");
                clen = this.$el.children.length;

                if (!page && clen > 1) {
                    $el.wrapAll("<div class='modal_body'></div>");
                }

                $el.addClass("modal hideOut");
                this[handle] = $el.modal({
                    page    : page,
                    align   : $el.attr("align"),
                    autoHide: $el.attr("autoHide")
                });

                if (!page && clen == 1) {
                    $el.children().addClass("modal_body");
                }
            } else {
                $el.addClass("hide");
            }
        }
    });
})();