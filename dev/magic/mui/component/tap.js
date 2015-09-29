/**
 * 为常用的 button 组件添加点击效果，同时全局增加 tap 事件
 * 
 * @author      mufeng  <smufeng@gmail.com>
 * @version     0.1     <2015-06-02>
 */

$.ready(function() {
    var $body = $("body"), $document = $(document), tap = {},
        inputs, event = { start: "", move: "", end: ""}, delay = 300;

    if (window.ontouchstart !== undefined) {
        event.start = "touchstart";
        event.move  = "touchmove";
        event.end   = "touchend";
    } else {
        event.start = "mousedown";
        event.move  = "mousemove";
        event.end   = "mouseup";
    }

    $document.on(event.start, function(e) {
        /* 忽略多指手势操作 */
        var touchs = e.targetTouches;

        if (touchs && touchs.length > 1) return true;

        var $target = $(e.target), handle, tagName;

        /* 记录此次点击事件的相关信息，用于方法判断 */
        if (touchs && touchs[0]) {
            tap.startX = touchs[0].pageX;
            tap.startY = touchs[0].pageY;
        } else {
            tap.startX = e.pageX;
            tap.startY = e.pageY;
        }
        tap.startT = $.getTime();

        /* 修复移动端input点击焦点不更新的问题 */
        tagName = e.target.tagName;
        if ("INPUT TEXTAREA".search(tagName) >= 0) {
            inputs = e.target;
        } else {
            inputs && inputs.blur();    // 刷新焦点
        }

        /* 给按钮类的组件添加点击样式 */
        if ($target.hasClass("button")   ||
            $target.hasClass("tab-item") ||
            $target.hasClass("item")) {

            handle = setTimeout((function($actobj) {
                return function() {
                    $actobj.addClass("active");
                }
            })($target), 24);
            $target.data("_active_handle", handle);
        }
    });

    // 清除激活类
    function clearActive($target) {
        if ($target.hasClass("button")   ||
            $target.hasClass("tab-item") ||
            $target.hasClass("item")) {

            clearTimeout($target.data("_active_handle"));
            $target.removeClass("active");
        }
    }

    $document.on(event.move, $.delayCall(function(e) {
        e.preventDefault(); // 修复微信下拉显示网页地址
        clearActive($(e.target));
    }, 16));

    $document.on(event.end, function(e) {
        var cx, cy, ct, $target = $(e.target),
            touch = e.changedTouches ? e.changedTouches[0] : e;

        cx = Math.abs(touch.pageX - tap.startX);
        cy = Math.abs(touch.pageY - tap.startY);
        ct = $.getTime() - tap.startT;

        if (cx<5 && cy < 5 && ct < delay) {
            $target.trigger("tap");
        }

        /* 如果点击时间太短，手动延迟动画移除时间 */
        setTimeout(function() {
            clearActive($target);   // 清除激活类
        }, 220-ct >= 0 ? 220-ct : 0);
    });
});