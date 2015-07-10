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

                var $actobj = $target;
                handle = setTimeout(function() {
                    $actobj.addClass("active");
                }, 60);
                $target.data("_active_handle", handle);
            }

            $target = $target.parent();     // 向上递归检测
        } while($target[0] && $target[0] != this);
    });

    $document.on("touchmove", $.delayCall(function(e) {
        var $target = $(e.target);

        do {
            clearTimeout($target.data("_active_handle"));

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
            e.stopPropagation();    // 终止冒泡

            var ev = new Event('tap');

            ev.pageX  = touch.pageX;
            ev.pageY  = touch.pageY;

            do {
                tagname = $target[0].tagName;
                $target[0].dispatchEvent(ev);   // 触发 Tap 事件

                if ($target.hasClass("button")   ||
                    $target.hasClass("tab-item") ||
                    $target.hasClass("item")) {

                    $target.removeClass("active");
                }

                if (tagname === "A") {
                    e.preventDefault();
                    var tohref = $target.attr("href");
                    // 手动跳转到指定页面
                    if (tohref) location.href = tohref; 
                    return false;           // 终止后续检测
                }

                $target = $target.parent();     // 向上递归检测
            } while($target[0] && $target[0] != this);
        } else {
            do {
                if ($target.hasClass("button")   ||
                    $target.hasClass("tab-item") ||
                    $target.hasClass("item")) {

                    $target.removeClass("active");
                }

                $target = $target.parent();     // 向上递归检测
            } while($target[0] && $target[0] != this);
        }
    });
});