module.exports = (function() {
    function toggleValue($input, state) {
        $input.val(!!state);
        $input.toggleClass("checked", !!state);
    }

    function toggleDisable($input, state) {
        if (!!state === true) {
            $input.attr("disabled", "true");
        } else {
            $input.removeAttr("disabled");
        }
    }

    function bindReady() {
        var $el = $(this.$el), scope = $$.getVm(this), vmScrope,
            prop = this._props, $bind = {}, onChange, input = $el[0], value, disabled;

        if (!prop.value.raw) return;

        vmScope = this._scope || scope;
        value   = prop.value.raw;
        disabled= prop.disabled.raw;

        $$.objBind(vmScope, value, $bind, "value");
        $$.objBind(vmScope, disabled, $bind, "disabled");

        onChange = scope[$el.attr("onChange")];
        $el.val(!!$bind.value);

        $el.on("tap", function() {
            $bind.value = $el.val() == "on";

            if ($.isFun(onChange)) onChange($bind.value);
        })

        vmScope.$watch(value, function(newVal) {
            if (($el.val() == "on") != newVal) {
                toggleValue($el, newVal);
            }
        })

        if (disabled) {
            vmScope.$watch(disabled, function(newVal) {
                toggleDisable($el, newVal);
            })

            toggleDisable($el, $bind.disabled);
        }
    }

    $$.component("mg-switch", {
        replace : true,
        props: ["value", "disabled"],
        template: '<input type="checkbox" class="switch"/>',
        ready: bindReady,
    });

    $$.component("mg-checkbox", {
        replace : true,
        props: ["value", "disabled"],
        template: '<input type="checkbox" class="checkbox"/>',
        ready: bindReady,
    });
})();
