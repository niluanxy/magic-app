module.exports = (function() {
    Vue.directive("numpad", {
        bind: function() {
            var $el = $(this.el), val = this.raw, scope = this.vm,
                click, handle, board, input, call, cancel, control,
                opt = {}, min, max;

            if (scope[val] !== undefined &&
                $el.tagName() == 'input') {

                board = $el.attr("board");
                call  = $el.attr("call");
                click = $el.attr("click");
                input = $el.attr("input");
                cancel= $el.attr("cancel");
                handle= $el.attr("handle");

                min   = parseInt($el.attr("min"));
                max   = parseInt($el.attr("max"));

                opt.board   = board;
                opt.click   = scope[click];
                opt.cancel  = scope[cancel];
                opt.call    = scope[call];

                /* 同步更新 */
                opt.click = function(newKey, newVal) {
                    newVal = parseInt(newVal);
                    newVal = isNaN(newVal) ? 0 : newVal;

                    if (!isNaN(max) && newVal > max) {
                        newVal = max;  // 最大最小值修正
                    }
                    if (!isNaN(min) && newVal < min) {
                        newVal = min;  // 最大最小值修正
                    }

                    /* 更新视图和数据 */
                    scope[val] = newVal; control.val(newVal);
                }

                control = $el.numpad(opt);
                control.val(scope[val] || '');

                if (scope[handle] !== undefined) {
                    scope[handle] = control;
                }

                $el.on("tap", function() { 
                    if ($el.attr("disabled") != "true") {
                        control.show();
                    }
                }).attr("readonly", "readonly");

                scope.$on("pageRender", function($scoll) {
                    /* 更新设置 content 对象句柄 */
                    control.content = $scoll;
                })
            }
        }
    })
})();