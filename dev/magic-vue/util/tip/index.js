module.exports = $(function() {
    var $tip = $.tip();

    $$.tip = function() {
        if (!arguments[0]) return;
        $tip.show.apply($tip, arguments);
    };

    $$.error = function(text, option) {
        if (!text) return;
        $tip.show(text, $.extend({show: 2000}, option));
    }

    $$.tipHide = function() {
        $tip.hide.apply($tip, arguments);
    };

    Vue.prototype.$tip = function() {
        var that = this, $tip;

        $tip = that._VUI_TIP_;
        if (!$tip) {
            $tip = $.tip("", {insertTo: that.$el});
            that._VUI_TIP_ = $tip;
        }

        $tip.show.apply($tip, arguments);
    }

    Vue.prototype.$tipHide = function() {
        var $tip = this._VUI_TIP_;

        if ($tip) $tip.hide.apply($tip, arguments);
    }
});
