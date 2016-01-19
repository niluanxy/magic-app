/**
 * 为常用的 button 组件添加点击效果，同时全局增加 tap 事件
 * 
 * @author      mufeng  <smufeng@gmail.com>
 * @version     0.2     <2016-01-19>
 */

$.ready(function() {
    var $document = $(document), tap, fastmove, input;


    /* 修复path对象，无则自己模拟一个出来 */
    function fixPath(e) {
        if (e.path && e.path.length) return e.path;

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
            $target.removeClass("active");
        }
    }
    $._ui_clearActive = clearActive;


    tap = {
        delay  : 200,
        double : 600,
        animate: 240,
        delayClass: 80,

        input: null,
        target: null,
        disClick: false,
        moveClear: false,
        delayStart: null,

        startX: 0,
        startY: 0,
        startTime: 0,

        _focus: function(e) {
            this.input = e.target;
        },

        _start: function(e) {
            if (e.touches && e.touches.length > 1) {
                this.startX = null;      this.startY = null;

                return true;
            }

            var touch = e.touches ? e.touches[0] : e,
                tagName, path = fixPath(e);

            /* 记录此次点击事件的相关信息，用于方法判断 */
            this.startX = touch.pageX;
            this.startY = touch.pageY;
            this.startTime = $.getTime();
            this.target    = e.target;
            this.moveClear = false;

            // 修复 BUTTON元素 出现点击两次的问题
            for (var i = 0; i<path.length; i++) {
                var $item = $(path[i]);
                tagName = $item[0].tagName.toUpperCase();

                if (tagName == "BUTTON") {
                    e.preventDefault();
                    break;
                }
            }

            this.delayStart = setTimeout(function() {
                /* 给按钮类的组件添加点击样式 */
                for (var i = 0; i<path.length; i++) {
                    var $item = $(path[i]);
                    tagName = $item[0].tagName.toUpperCase();

                    if (checkClass($item)) {
                        $item.addClass("active");
                    }
                }
            }, this.delayClass);
        },

        _move: $.delayCall(function(e) {
            e.preventDefault(); // 修复微信下拉显示网页地址

            var touch = e.touches ? e.touches[0] : e;

            if (!this.moveClear &&
                (Math.abs(touch.pageX - this.startX) >= 1 ||
                Math.abs(touch.pageY - this.startY) >= 1) ) {
                
                // 清除 tap 自定义相关操作
                this.moveClear = true;
                clearTimeout(this.delayStart);

                // 清除事件中相关的元素的激活类
                var path = fixPath(e), $item;
                for(var i = 0; i<path.length; i++) {
                    $item = $(path[i]);
                    clearActive($item);
                }
            }
        }, 16),

        _end: function(e) {
            var cx, cy, ct, $target = $(e.target), tagName, lt,
                touch = e.changedTouches ? e.changedTouches[0] : e;

            lt = $.getTime();
            cx = Math.abs(touch.pageX - this.startX);
            cy = Math.abs(touch.pageY - this.startY);
            ct = lt - this.startTime;

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

            setTimeout(function() {
                var path = fixPath(e);
                for(var i = 0; i<path.length; i++) {
                    var $item = $(path[i]);
                    clearActive($item);
                }
            }, this.delayClass); 
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
            doc = document, bind = "addEventListener";

        /* 修复input 焦点问题 */
        doc[bind]("focus", tap._focus, true)

        doc[bind]("mousedown", tap);
        doc[bind]("mousemove", tap);
        doc[bind]("mouseup", tap);
        doc[bind]("mousecancel", tap);

        doc[bind]("touchstart", tap);
        doc[bind]("touchmove", tap);
        doc[bind]("touchend", tap);
        doc[bind]("touchcancel", tap);

        doc[bind]("pointerdown", tap);
        doc[bind]("pointermove", tap);
        doc[bind]("pointerup", tap);
        doc[bind]("pointercancel", tap);

        doc[bind]("MSPointerDown", tap);
        doc[bind]("MSPointerMove", tap);
        doc[bind]("MSPointerUp", tap);
        doc[bind]("MSPointerCancel", tap);

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