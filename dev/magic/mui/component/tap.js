/**
 * 为常用的 button 组件添加点击效果，同时全局增加 tap 事件
 * 
 * @author      mufeng  <smufeng@gmail.com>
 * @version     0.1     <2015-06-02>
 */

$.ready(function() {
    var $document = $(document), tap, fastmove, input;


    /* 修复path对象，无则自己模拟一个出来 */
    function fixPath(e) {
        var target = e.target, arr = [];

        while (target && target.parentNode) {
            arr.push(target);   // 当前存下来

            target = target.parentNode;
        }

        return arr;     // 返回创建的对象
    }

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
    $._ui_clearActive = clearActive;


    tap = {
        delay  : 300,
        double : 600,
        animate: 240,

        input: null,
        target: null,
        disClick: false,

        startX: 0,
        startY: 0,
        startTime: 0,

        _focus: function(e) {
            this.input = e.target;
        },

        _start: function(e) {
            if ((e.touches && e.touches.length > 1) || 
                (e.timeStamp - this.startTime < this.double)) {
                this.startX = null;      this.startY = null;

                return true;
            }

            var touch = e.touches ? e.touches[0] : e,
                handle, tagName, path = fixPath(e);

            /* 记录此次点击事件的相关信息，用于方法判断 */
            tap.startX = touch.pageX;
            tap.startY = touch.pageY;
            tap.startTime = $.getTime();
            tap.target    = e.target;

            /* 给按钮类的组件添加点击样式 */
            for (var i = 0; i<path.length; i++) {
                var $item = $(path[i]);
                tagName = $item[0].tagName;

                if (checkClass($item)) {
                    handle = setTimeout((function($actobj) {
                        return function() {
                            $actobj.addClass("active");
                        }
                    })($item), 24);
                    $item.data("_active_handle", handle);
                }
            }
        },

        _move: $.delayCall(function(e) {
            e.preventDefault(); // 修复微信下拉显示网页地址

            var path = fixPath(e);

            for(var i = 0; i<path.length; i++) {
                var $item = $(path[i]);
                clearActive($item);
            }
        }, 16),

        _end: function(e) {
            var cx, cy, ct, $target = $(e.target), tagName,
                touch = e.changedTouches ? e.changedTouches[0] : e;

            cx = Math.abs(touch.pageX - this.startX);
            cy = Math.abs(touch.pageY - this.startY);
            ct = $.getTime() - this.startTime;

            if (cx<5 && cy < 5 && ct < this.delay) {
                $target.trigger("tap");

                /* 修复移动端input点击焦点不更新的问题 */
                tagName = e.target.tagName.toUpperCase();
                if (e.target != this.input) {
                    this.input && this.input.blur();        // 刷新焦点
                }

                if ("INPUT TEXTAREA".split(" ").indexOf(tagName) >= 0) {
                    this.input = e.target;                  // 更新绑定元素

                    var type = $target.attr("type");

                    type = type ? type.toUpperCase() : type;

                    if (type && "RADIO CHECKBOX".split(" ").indexOf(type) >= 0) {
                        if (this.input.checked == true) {
                            $target.removeClass("checked");
                        } else {
                            if (type == "CHECKBOX") {
                                $target.addClass("checked");
                            }
                        }
                    }
                }

                this.disClick = false;
                $target.trigger("click");
            }

            /* 如果点击时间太短，手动延迟动画移除时间 */
            var _animate = this.animate;
            setTimeout(function() {
                var path = fixPath(e);

                for(var i = 0; i<path.length; i++) {
                    var $item = $(path[i]);
                    clearActive($item);
                }
            }, _animate-ct >= 0 ? _animate-ct : 0);
        },

        handleEvent: function (e) {
            switch ( e.type ) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
            }
        }
    };


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
    ;(function() {
        var kt = window.ontouchstart !== undefined ? 0 : 1,
            docbind = document.addEventListener;

        /* 修复input 焦点问题 */
        docbind("focus", tap._focus, true)

        docbind("mousedown", tap);
        docbind("mousemove", tap);
        docbind("mouseup", tap);
        docbind("mousecancel", tap);

        docbind("touchstart", tap);
        docbind("touchmove", tap);
        docbind("touchend", tap);
        docbind("touchcancel", tap);

        docbind("pointerdown", tap);
        docbind("pointermove", tap);
        docbind("pointerup", tap);
        docbind("pointercancel", tap);

        docbind("MSPointerDown", tap);
        docbind("MSPointerMove", tap);
        docbind("MSPointerUp", tap);
        docbind("MSPointerCancel", tap);

        /* 修复鼠标点透问题 */
        if (kt === 0 /* 只有支持 touch 事件时才绑定 */) {
            $document.on("click", function(e) {
                if (!tap.disClick &&
                    (e.timeStamp - tap.startTime) < 300) {

                    /* 临时修复 自定义 click 事件无法触发 input 默认点击效果 BUG */
                    if (e.target.tagName.toUpperCase() == "INPUT") {
                        var tar  = e.target,
                            type = $(tar).attr("type");

                        type = type ? type.toUpperCase() : type;    

                        if (type && "RADIO CHECKBOX".split(" ").indexOf(type) >= 0) {
                            if (tar.checked === false) {
                                tar.checked = true;
                            } else if (type == "CHECKBOX") {
                                tar.checked = false;
                            }
                        }
                    }

                    tap.disClick = true;
                } else {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }, true);
        }
    })(window, tap);
});