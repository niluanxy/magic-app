module.exports = (function() {
    $$.component("mg-modal", {
        template: "<slot></slot>",
        ready: function() {
            var that = this, $el = $(this.$el),
                scope, view, clen, ctrl, show, handle;

            ctrl  = $el.attr("ctrl");
            show  = $el.attr("show");
            scope = $$.getVm(that);

            if (scope[ctrl] !== undefined || scope[show] !== undefined) {
                view = $el.attr("view");
                clen = $el.children.length;

                that._handle = handle = $(scope.$el).modal($el, {
                    align     : $el.attr("align"),
                    autoHide  : false,
                    background: true,
                });

                $el.removeAttr(["ctrl", "show", "align"]);

                if (scope[ctrl] !== undefined) {
                    scope[ctrl] = handle;
                }

                if (view && view != "true" && view !== true) {
                    var _name = $$.__makeViewName(view), _child,
                        _view = $$.__renderView(_name, "_loadModal");

                    _view.$appendTo($el[0]).__MODAL = handle;
                    _child = _view.$children;

                    // 如果
                    if (_child[0] && scope[bind] !== undefined) {
                        scope[bind] = _child[0];
                        handle.view = _child[0];
                    } else {
                        _view.$on("childPageReady", function() {
                            _child[0].__MODAL_PARENT = scope;

                            if (scope[bind] !== undefined) {
                                scope[bind] = _child[0];
                            }

                            handle.view = _child[0];
                        })
                    }
                }

                if (!view && clen == 1) {
                    $el.children().addClass("modal_body");
                }
            } else {
                $el.addClass("hide");
            }
        }
    });
})();