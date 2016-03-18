module.exports = (function() {
    $$.component("mg-confirm", {
        template: "<div class='confirm modal_body'><slot></slot></div>",
        ready: function() {
            var scope = $$.getVm(this), $el = $(this.$el),
                handle, show, $confirm; 

            handle = $el.attr("handle");

            if (handle !== undefined && scope[handle] !== undefined) {

                $confirm = $el.confirm({
                    confirm    : $el.attr("confirm"),
                    confirmHide: $el.attr("confirmHide"),
                    cancel     : $el.attr("cancel"),
                    cancelHide : $el.attr("cancelHide")
                });
                $el.removeClass("hide").addClass("modal");

                // 如果存在绑定的对象，传出句柄
                if (scope[handle] !== undefined) {
                    scope[handle] = $confirm;
                }
            } else {
                $el.addClass("hide");
            }
        }
    });
})();