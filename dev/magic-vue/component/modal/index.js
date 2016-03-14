module.exports = (function() {
    $$.component("mg-modal", {
        template: "<slot></slot>",
        ready: function() {
            var that = this, $el = $(this.$el),
                scope, isPage, clen, ctrl, bind;

            ctrl  = $el.attr("ctrl");
            bind  = $el.attr("view");
            scope = $$._getPage(that);

            if (scope[ctrl] !== undefined || scope[bind] !== undefined) {
                isPage = $el.find("mg-content").length || $el.attr("page");
                clen   = $el.children.length;

                if (!isPage && clen > 1) {
                    $el.wrapAll("<div class='modal_body'></div>");
                }

                that._handle = handle = $el.addClass("modal hideOut")
                .modal({
                    page    : page,
                    align   : $el.attr("align"),
                    autoHide: $el.attr("autoHide")
                });

                if (scope[ctrl] !== undefined) {
                    scope[ctrl] = handle;
                }

                if (page && page != "true") {
                    var _name = $$.__makeViewName(page), _child,
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

                if (!page && clen == 1) {
                    $el.children().addClass("modal_body");
                }
            } else {
                $el.addClass("hide");
            }
        }
    });
})();