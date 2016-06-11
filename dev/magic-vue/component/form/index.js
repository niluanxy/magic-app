module.exports = (function() {
    function toggle($input, state) {
        $input.val(!!state);
        $input.toggleClass("checked", !!state);
    }

    function bindReady() {
        var $el = $(this.$el), scope = $$.getVm(this),
            value, onChange, disabled, input = $el[0];

        value    = $el.attr("value");
        disabled = $el.attr("disabled");
        onChange = scope[$el.attr("onChange")];

        if (scope[value] === undefined) return;

        $el.val(!!scope[value]);

        $el.on("tap", function() {
            var checked = $el.val() == "on";

            scope[value] = checked;
            if ($.isFun(onChange)) {
                onChange(checked);
            }
        })

        if (scope[disabled] !== undefined) {
            scope.$watch(disabled, function(newVal) {
                if (!!newVal == true) {
                    $el.attr("disabled", "true");
                } else {
                    $el.removeAttr("disabled");
                }
            })

            if (!!scope[disabled]) {
                $el.attr("disabled", "true");
            } else {
                $el.removeAttr("disabled");
            }
        }

        if (scope[value] !== undefined) {
            scope.$watch(value, function(newVal) {
                if (($el.val() == "on") != newVal) {
                    toggle($el, newVal);
                }
            })
        }

    }

    $$.component("mg-switch", {
        replace : true,
        template: '<input type="checkbox" class="switch"/>',
        ready: bindReady,
    });

    $$.component("mg-checkbox", {
        replace : true,
        template: '<input type="checkbox" class="checkbox"/>',
        ready: bindReady,
    });
})();
