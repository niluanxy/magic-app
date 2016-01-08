module.exports = (function() {
    $$.component("mg-modal", {
        template: "<slot></slot>",
        ready: function() {
            var that = this, $el = $(this.$el),
                scope, handle, page, clen, ctrl, bind;

            ctrl  = $el.attr("handle");
            bind  = $el.attr("view");
            scope = $$._getPage(that);

            if (scope[ctrl] !== undefined || scope[bind] !== undefined) {
                page = $el.find("mg-content").length || $el.attr("page");
                clen = $el.children.length;

                if (!page && clen > 1) {
                    $el.wrapAll("<div class='modal_body'></div>");
                }

                handle = $el.addClass("modal hideOut").modal({
                    page    : page,
                    align   : $el.attr("align"),
                    autoHide: $el.attr("autoHide")
                });

                if (scope[ctrl] !== undefined) {
                    scope[ctrl] = handle;
                }

                if (page && page != "true") {
                    var _name = $$.__makeViewName(page),
                        _view = $$.__renderView(_name, "_loadModal");

                    _view.$appendTo($el[0]).__MODAL = handle;

                    _view.$once("childPageReady", function() {
                        var _child = _view.$children[0];

                        if (scope[bind] !== undefined) {
                            scope[bind] = _child;
                        }

                        _child.__MODAL_PARENT = scope;
                        handle.view = _child;
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