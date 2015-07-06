/**
 * 为常用的 button 组件添加点击效果，同时全局增加 tap 事件
 * 
 * @author      mufeng  <smufeng@gmail.com>
 * @version     0.1     <2015-06-02>
 */

$.ready(function() {
    var $body = $("body"), $document = $(document), tap = {};

    $document.on("touchstart", function(e) {
        var touch = e.changedTouches[0];
        tap.startX = touch.pageX;
        tap.startY = touch.pageY;
        tap.startT = $.getTime();
    });

    $document.on("touchend", function(e) {
        var touch = e.changedTouches[0], cx, cy, ct;

        cx = Math.abs(touch.pageX - tap.startX);
        cy = Math.abs(touch.pageY - tap.startY);
        ct = $.getTime() - tap.startT;

        if (cx<5 && cy < 5 && ct < 200) {
            e.stopPropagation();    // 终止冒泡

            var ev = new Event('tap'),
                $target = $(e.target);

            ev.pageX  = touch.pageX;
            ev.pageY  = touch.pageY;

            do {
                tagname = $target[0].tagName;
                $target[0].dispatchEvent(ev);   // 触发 Tap 事件

                if (tagname === "A") {
                    e.preventDefault();
                    var tohref = $target.attr("href");
                    // 手动跳转到指定页面
                    if (tohref) location.href = tohref; 
                    return false;           // 终止后续检测
                }

                $target = $target.parent();     // 向上递归检测
            } while($target[0] && $target[0] != this);
        }
    });


    $body.on("touchstart", function(event) {
        var $target = $(event.target),
            $parent = $target.parent();

        if ($parent.hasClass("tab-item")) {
            $target = $parent;
        }

        if ($target.hasClass("button") ||
            $target.hasClass("tab-item")) {

            $target.addClass("active");
        }
    })

    $body.on("touchend", function(event) {
        var $target = $(event.target),
            $parent = $target.parent();

        if ($parent.hasClass("tab-item")) {
            $target = $parent;
        }

        if ($target.hasClass("button") ||
            $target.hasClass("tab-item")) {

            $target.removeClass("active");
        }
    })
});