/**
 * 为常用的 button 组件添加点击效果，同时全局增加 tap 事件
 * 
 * @author      mufeng  <smufeng@gmail.com>
 * @version     0.1     <2015-06-02>
 */

$.ready(function() {
    var $document = $(document), tap = {canClick: false},
        delay = 300, fastmove, input;


    function checkClass(item, test) {
        var find, cls = item.attr ? item.attr("class") :
                  item.getAttribute || item.getAttribute("class");

        /* 转换为数组，便于后面操作 */
        cls  = (cls || "").split(" ");
        find = (test || "button item tab-item").split(" ");

        for (var i=0; i<find.length; i++) {
            if (cls.indexOf(find[i]) >= 0) return true;
        }

        return false;
    }

    function checkIn(parent, child) {
        do {
            if (child == parent) {
                return true;
            }

            child = child && child.parentNode;
        } while (child && child.parentNode);

        return false;
    }

    // 清除激活类
    function clearActive($target) {
        if (checkClass($target)) {

            clearTimeout($target.data("_active_handle"));
            $target.removeClass("active");
        }
    }
    $._ui_clearActive = clearActive;

    /* 事件初始化监听 */
    function faststart(e) {
        var touchs = e.changedTouches;
        if (touchs && touchs.length > 1) {
            tap.startX = null;      tap.startY = null;
            tap.endX   = null;      tap.endY   = null;

            return true;
        }

        var handle, tagName, path = e.path;

        /* 记录此次点击事件的相关信息，用于方法判断 */
        if (touchs && touchs[0]) {
            tap.startX = touchs[0].pageX;
            tap.startY = touchs[0].pageY;
        } else {
            tap.startX = e.pageX;
            tap.startY = e.pageY;
        }
        tap.startTime = $.getTime();
        tap.target    = e.target;

        /* 给按钮类的组件添加点击样式 */
        for (var i = 0; i<path.length; i++) {
            var $item = $(path[i]);
            tagName = $item[0].tagName;

            /* 修复移动端input点击焦点不更新的问题 */
            if ("INPUT TEXTAREA".search(tagName) >= 0) {
                input = e.target;
            } else {
                input && input.blur();    // 刷新焦点
            }

            if (checkClass($item)) {
                handle = setTimeout((function($actobj) {
                    return function() {
                        $actobj.addClass("active");
                    }
                })($item), 24);
                $item.data("_active_handle", handle);
            }
        }
    }

    /* 节流move事件，节省资源 */
    fastmove = $.delayCall(function(e) {
        e.preventDefault(); // 修复微信下拉显示网页地址

        for(var i = 0; i<e.path.length; i++) {
            var $item = $(e.path[i]);
            clearActive($item);
        }
    }, 16);

    /* 点击结束事件 */
    function fastend(e) {
        var cx, cy, ct, $target = $(e.target),
            touch = e.changedTouches ? e.changedTouches[0] : e;

        tap.endX = touch.pageX;
        tap.endY = touch.pageY;

        cx = Math.abs(touch.pageX - tap.startX);
        cy = Math.abs(touch.pageY - tap.startY);
        ct = $.getTime() - tap.startTime;

        if (cx<5 && cy < 5 && ct < delay) {
            $target.trigger("tap");

            tap.canClick = true;
            $target.trigger("click");
        }

        /* 如果点击时间太短，手动延迟动画移除时间 */
        setTimeout(function() {
            for(var i = 0; i<e.path.length; i++) {
                var $item = $(e.path[i]);
                clearActive($item);
            }
        }, 220-ct >= 0 ? 220-ct : 0);
    }


    /** 
     * 
     * 事件初始化，同时修复移动端 点击穿透问题，原理如下:
     *
     * 移动端的click都是touch之后，才会模拟触发。触发的顺序如下:
     * 
     * touchstart -> touchmove -> touchend ->
     * mousedown  -> mousemove -> mouseenter -> click
     * 
     * 在重叠的区域里，被遮盖的元素绑定click，遮盖的元素绑定touch事件，
     * 且touch后遮盖的元素会隐藏的话，就会造成穿透，因为click是在touch
     * 之后延迟触发的，浏览器会误认为是在遮盖的元素上触发了click。
     * 
     */
    (function() {
        var ename, start, move, end, kt,
            map = { s: ["start", "down"], e : ["end", "up"] };

        kt = window.ontouchstart !== undefined ? 0 : 1;

        ename = kt ? "mouse" : "touch";
        start = ename + map.s[kt];
        move  = ename + "move";
        end   = ename + map.e[kt];

        $document.on(start, faststart);
        $document.on(move,  fastmove);
        $document.on(end,   fastend);

        /* 修复鼠标点透问题 */
        if (kt === 0 /* 只有支持 touch 事件时才绑定 */) {
            $document.on("click", function(e) {
                if (!tap.canClick && e.timeStamp - tap.startTime < 200) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                } else {
                    tap.canClick = false;
                }
            }, true);
        }
    })(window, tap);
});