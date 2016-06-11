module.exports = (function() {
    $$.component("mg-modal", {
        template: "<slot></slot>",
        ready: function() {
            var that = this, $el = $(this.$el),
                scope, view, clen, ctrl, show, handle, mroot, option;

            ctrl  = $el.attr("ctrl");
            show  = $el.attr("show");
            scope = $$.getVm(that);
            mroot = $el.attr("root") == "true";

            if (scope[ctrl] !== undefined || scope[show] !== undefined) {
                view = $el.attr("view");
                clen = $el.children.length;

                option = {
                    align     : $el.attr("align"),
                    autoHide  : false,
                    background: true,
                };

                if (mroot /* 为真说明要在根元素上弹框 */) {
                    handle = $($$.__VIEW__).modal($el, option);
                } else {
                    handle = $(scope.$el).modal($el, option);
                }

                that._HANDLE_ = handle;
                $el.removeAttr("ctrl show align");

                if (scope[ctrl] !== undefined) {
                    scope[ctrl] = handle;
                }

                if (view && view != "true" && view !== true) {
                    var _name = $$.__makeViewName(view), _child,
                        _view = $$.__renderView(_name, "_loadModal"),
                        _call = scope[$el.attr("call")], load = $.defer();

                    _view.$appendTo($el[0]);
                    _child = _view.$children;

                    // 页面渲染后，将子页面的 句柄 暴露出来
                    if (_child[0] && scope[ctrl] !== undefined) {
                        load.resolve();
                    } else {
                        _view.$on("PAGE_READY", load.resolve);
                    }

                    load.then(function() {
                        _child[0]._MODAL_PARENT = scope;
                        _child[0].$parent       = scope;
                        _child[0]._MODAL_       = handle;

                        if ($.isFun(_call)) {
                            _child[0]._MODAL_CALL = _call;
                        }

                        handle.view = _child[0];
                    })
                }

                that.$on("PAGE_VIEW_HIDE", function() {
                    handle.hide();
                })
            } else {
                $el.addClass("hide");
            }
        }
    });
})();
