/**
 * 为常用的 button 组件添加点击效果，同时全局增加 tap 事件
 * 
 * @author      mufeng  <smufeng@gmail.com>
 * @version     0.1     <2015-06-02>
 */

$.ready(function() {
    var $document = $(document), tap = {}, delay = 300, fastmove;


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

    // 清除激活类
    function clearActive($target) {
        if (checkClass($target)) {

            clearTimeout($target.data("_active_handle"));
            $target.removeClass("active");
        }
    }

    /* 事件初始化监听 */
    function faststart(e) {
        var touchs = e.changedTouches;
        if (touchs && touchs.length > 1) return true;

        var $target = $(e.target), handle, tagName,
            path = e.path, inputs;

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
        for (var i = 0; i<path.length; i++) {
            if (checkClass($target)) {
                handle = setTimeout((function($actobj) {
                    return function() {
                        $actobj.addClass("active");
                    }
                })($target), 24);
                $target.data("_active_handle", handle);
            }
        }
    }

    /* 节流move事件，节省资源 */
    fastmove = $.delayCall(function(e) {
        e.preventDefault(); // 修复微信下拉显示网页地址

        for(var i = 0; i<e.path.length; i++) {
            clearActive($(e.target));
        }
    }, 16);

    /* 点击结束事件 */
    function fastend(e) {
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
    }

    /* 事件检测初始化 */
    $document.on("touchstart.itap mousedown.itap", function(e) {
        var touch = e.type.search("touch") > -1, kt = touch?0:1,
            ename = touch ? "touch" : "mouse", start, move, end,
            map = { s: ["start", "down"], e : ["end", "up"] };

        start = ename + map.s[kt];
        move  = ename + "move";
        end   = ename + map.e[kt];

        /* 移除初始化事件 */
        $document.off("touchstart.itap mousedown.itap");

        /* 重新添加对应事件 */
        $document.on(start, faststart);
        $document.on(move,  fastmove);
        $document.on(end,   fastend);

        faststart(e);   // 修复触发start事件
    });
});