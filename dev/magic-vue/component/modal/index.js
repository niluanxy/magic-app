module.exports = (function() {
    $$.component("mg-modal", {
        template: "<slot></slot>",
        ready: function() {
            var that = this, $el = $(this.$el),
                scope, handle, page, clen, ctrl;

            ctrl  = $el.attr("handle");
            scope = $$._getPage(that);

            if (scope[ctrl] !== undefined) {
                page = $el.find("mg-content").length || $el.attr("page");
                clen = $el.children.length;

                if (!page && clen > 1) {
                    $el.wrapAll("<div class='modal_body'></div>");
                }

                scope[ctrl] = handle =
                $el.addClass("modal hideOut").modal({
                    page    : page,
                    align   : $el.attr("align"),
                    autoHide: $el.attr("autoHide")
                });

                if (page && page != "true") {
                    var _name = $$.__makeViewName(page),
                        _view = $$.__renderView(_name, "_loadModal"),
                        _bind = $el.attr("view");

                    _view.$appendTo($el[0]).__MODAL = handle;

                    _view.$once("childPageReady", function() {
                        console.log("has recive child")
                        var _child = _view.$children[0];

                        if (scope[_bind] !== undefined) {
                            scope[_bind] = _child;
                        }

                        _child.__MODAL_PARENT = scope;
                    })
                }

                if (!page && clen == 1) {
                    $el.children().addClass("modal_body");
                }
            } else {
                $el.addClass("hide");
            }
        }
    });
})();