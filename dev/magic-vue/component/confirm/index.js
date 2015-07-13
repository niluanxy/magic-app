module.exports = (function() {
    Vue.component("mg-confirm", {
        template: "<div class='confirm modal_body'><content></content></div>",
        replace: false,
        inherit: true,
        ready: function() {
            var $el = $(this.$el), handle, show, $confirm; 

            handle = $el.attr("handle");
            show   = $el.attr("show");

            if ((handle !== undefined && this[handle] !== undefined) ||
                (show !== undefined && this[show] !== undefined)) {

                $confirm = $el.confirm({
                    confirm    : $el.attr("confirm"),
                    confirmHide: $el.attr("confirmHide"),
                    cancel     : $el.attr("cancel"),
                    cancelHide : $el.attr("cancelHide")
                });
                $el.removeClass("hide").addClass("modal");

                // 如果存在绑定的对象，传出句柄
                if (this[handle] !== undefined) {
                    this[handle] = $confirm;
                }

                // 另一种方式用 show 属性控制隐藏显示
                if (show !== undefined && this[show] !== undefined) {
                    this.$watch(show, function(newVal) {
                        if (newVal === true) {
                            $confirm.show();
                        } else {
                            $confirm.hide();
                        }
                    })
                }
            } else {
                $el.addClass("hide");
            }
        }
    });
})();