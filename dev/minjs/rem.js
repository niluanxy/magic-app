;(function(root, factory) {
    if (typeof module !== 'undefined' && module.exports) {// CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {// AMD / RequireJS
        define(factory);
    } else {
        factory()();
    }
}(this, function() {
    return function(font, width) {
        /* 如果未设置 font 和 width 参数，则设置默认值 */
        font = font ? font : 20; width = width ? width : 375;

        var doc = document, win = window, docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth, ratio = win.devicePixelRatio;
                if (!clientWidth) return;

                if (ratio) {
                    docEl.style.fontSize = font * ratio + 'px';
                } else {
                    docEl.style.fontSize = font * (clientWidth / width) + 'px';
                }
            };

        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    }   
}));