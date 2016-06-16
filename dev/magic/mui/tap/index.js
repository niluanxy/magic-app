/**
 * 为常用的 button 组件添加点击效果，同时全局增加 tap 事件
 *
 * @author      mufeng  <smufeng@gmail.com>
 * @version     0.2     <2016-01-19>
 */

$(function() {
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
            $target.removeClass("active");
        }
    }
    $._ui_clearActive = clearActive;

    tap = {
        delay  : 200,
        animate: 240,

        /**
         * checkMove 点击移动判断容错率
         *
         * checkMoveBad 是针对移动设备
         *
         * 提高容错率可以提高点击的成功率，但
         * 同时也可能会导致误点几率变大
         * 国产山寨设备建议设置为 30以上
         */
        checkMove: 4,
        checkMoveBad: 30,

        doubleTime: 300,
        delayClass: 80,

        /* 为true会在移动后，清除元素class */
        moveClear: true,
        hasClear : false,

        input: null,
        target: null,
        lastType: "",
        disClick: false,
        delayStart: null,
        tapIsStart: false,

        startX: 0,
        startY: 0,
        startTime: null,

        _focus: function(e) {
            this.input = e.target;
        },

        _isMove: function(e, move) {
            var mv = move ? move : this.checkMove,
                touch = e.changedTouches, cx, cy;

            // 如果不是精确点击事件，采用加大的值
            if (!move && !e.type.match(/^mouse|pinter/)) {
                mv = this.checkMoveBad;
            }

            touch = touch && touch[0] ? touch[0] : e;
            cx = Math.abs(touch.pageX - this.startX);
            cy = Math.abs(touch.pageY - this.startY);

            return !!(cx >= mv || cy >= mv);
        },

        _isOne: function(now, old) {
            var reg = /^mouse|touch|pointer/;

            old = old.match(reg);
            now = now.match(reg);

            return old && now && old[0] == now[0];
        },

        _addActive: function(e) {
            var path = fixPath(e);

            for (var i = 0; i<path.length; i++) {
                var $item = $(path[i]);

                if (checkClass($item)) {
                    $item.addClass("active");
                }
            }
        },

        _clearActive: function(e) {
            var path = fixPath(e);

            for(var i = 0; i<path.length; i++) {
                clearActive($(path[i]));
            }
        },

        _start: function(e) {
            var touch = e.touches ? e.touches[0] : e, ct,
                tagName, path = fixPath(e), ltype = this.lastType;

            /* 修复移动端input点击焦点不更新的问题 */
            if (e.target != this.input) {
                this.input && this.input.blur();        // 刷新焦点
                this.input = null;
            }

            ct = $.getTime() - this.startTime;

            if ((e.touches && e.touches.length > 1) ||
                (!this._isOne(e.type, ltype) && ct < 600) ) {
                this.startX = null;      this.startY = null;

                return true;
            }

            this.lastType = e.type;
            tagName = e.target.tagName;
            $(e.target).trigger("tapstart", e);

            /* 记录此次点击事件的相关信息，用于方法判断 */
            this.startX = touch.pageX;
            this.startY = touch.pageY;
            this.startTime = $.getTime();
            this.target    = e.target;
            this.hasClear  = false;

            // 修复 BUTTON元素 出现点击两次的问题
            for (var i = 0; i<path.length; i++) {
                var $item = $(path[i]), type;
                tagName = $item[0].tagName.toUpperCase();
                type    = ($item.attr("type") || "").toUpperCase();

                if (tagName == "BUTTON" || (tagName == "INPUT" &&
                    "RADIO CHECKBOX".split(" ").indexOf(type) >= 0) ) {
                    e.preventDefault();
                    break;
                }
            }

            if (this.moveClear) {
                this.delayStart = setTimeout(function() {
                    /* 给按钮类的组件添加点击样式 */
                    tap._addActive(e);
                }, this.delayClass);
            } else {
                tap._addActive(e);
            }
        },

        _move: function(e) {
            e.preventDefault(); // 修复微信下拉显示网页地址

            // 创建 tapmove 事件
            if (this.startX != null) {
                $(e.target).trigger("tapmove", e);
            }

            if (this.moveClear && !this.hasClear && this._isMove(e)) {
                // 清除 tap 自定义相关操作
                clearTimeout(this.delayStart);

                // 清除事件中相关的元素的激活类
                tap._clearActive(e);
                this.hasClear = true;
            }
        },

        _end: function(e) {
            var ct, $target = $(e.target);

            ct = $.getTime() - this.startTime;

            if (this.startX != null) {
                $target.trigger("tapend", e);
            }

            if (!this._isMove(e) && ct < this.delay) {
                this.disClick = false;
                $target.trigger("click");
                $target.trigger("tap");
            }

            setTimeout(function() {
                tap._clearActive(e);
            }, this.delayClass*1.2);
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

        doc[bind]("touchstart", tap);
        doc[bind]("touchmove", tap);
        doc[bind]("touchend", tap);
        doc[bind]("touchcancel", tap);

        doc[bind]("mousedown", tap);
        doc[bind]("mousemove", tap);
        doc[bind]("mouseup", tap);
        doc[bind]("mousecancel", tap);

        doc[bind]("pointerdown", tap);
        doc[bind]("pointermove", tap);
        doc[bind]("pointerup", tap);
        doc[bind]("pointercancel", tap);

        doc[bind]("MSPointerDown", tap);
        doc[bind]("MSPointerMove", tap);
        doc[bind]("MSPointerUp", tap);
        doc[bind]("MSPointerCancel", tap);

        $document.on("click", function(e) {
            if (!tap.disClick &&
                (e.timeStamp - tap.startTime) < 300) {

                // checkbox radio 元素，点击后value值修复
                var tar = e.target, $tar = $(tar), type;

                if (tar.tagName == "INPUT") {
                    type = tar.type.toUpperCase();

                    if (["RADIO", "CHECKBOX"].findIn(type)) {
                        if (tar.checked === true) {
                            $tar.val(false);
                            $tar.removeClass("checked");
                        } else if (type === "CHECKBOX") {
                            $tar.val(true);
                            $tar.addClass("checked");
                        }
                    }
                }

                tap.disClick = true;
            } else {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);
    })(window, tap);
});
