/**
 * 为常用的 button 组件添加点击效果，同时全局增加 tap 事件
 * 
 * @author      mufeng  <smufeng@gmail.com>
 * @version     0.1     <2015-06-02>
 */

$.ready(function() {
    var $body = $("body"), $document = $(document), tap = {};

    $document.on("touchstart", function(e) {
        var touch   = e.changedTouches[0],
            $target = $(e.target), handle;

        tap.startX = touch.pageX;
        tap.startY = touch.pageY;
        tap.startT = $.getTime();

        do {
            if ($target.hasClass("button")   ||
                $target.hasClass("tab-item") ||
                $target.hasClass("item")) {

                handle = setTimeout((function($actobj) {
                    return function() {
                        $actobj.addClass("active");
                    }
                })($target), 60);
                $target.data("_active_handle", handle);
            }

            $target = $target.parent();     // 向上递归检测
        } while($target[0] && $target[0] != this);
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

    $document.on("touchmove", $.delayCall(function(e) {
        e.preventDefault(); // 修复微信下拉显示网页地址
        var $target = $(e.target);

        do {
            clearActive($target);

            $target = $target.parent();     // 向上递归检测
        } while($target[0] && $target[0] != this);
    }, 50));

    $document.on("touchend", function(e) {
        var touch   = e.changedTouches[0], cx, cy, ct,
            $target = $(e.target);

        cx = Math.abs(touch.pageX - tap.startX);
        cy = Math.abs(touch.pageY - tap.startY);
        ct = $.getTime() - tap.startT;

        if (cx<5 && cy < 5 && ct < 200) {
            var ev = document.createEvent('Event');
            ev.initEvent("tap", true, true);
            ev.pageX  = touch.pageX;
            ev.pageY  = touch.pageY;

            e.target.dispatchEvent(ev);
        }

        do {
            clearActive($target);   // 清除激活类

            $target = $target.parent();     // 向上递归检测
        } while($target[0] && $target[0] != this);
    });
});