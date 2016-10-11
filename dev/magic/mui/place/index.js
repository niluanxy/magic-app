exports.module = (function(doc, undefined) {
	var OFFSET = {
		'top'    : 0,
		'left'   : 0,
		'center' : 0.5,
		'right'  : 1,
		'bottom' : 1
	};

    /**
     * 相对某元素执行定位操作
     * @param {Element}     el          [要定位的对象]
     * @param {Element}     relative    [相对定位的元素]
     * @param {String}      top         [上下定位参数及修正]
     * @param {String}      left        [左右定位参数及修正]
     * @param {Number}      zindex      [定位元素的 z-index 值]
     *
     * inner 是否在定位元素外插入对象，默认为元素内插入，如果选择元
     * 素外插入，计算坐标时，会自动加上定位元素的偏移值
     *
     * top : ["top offset",  "center offset", "bottom offset"]
     * left: ["left offset", "center offset", "right offset"]
     *
     * 其中 offset 为元素偏移修正，为要定位元素的倍数，说明如下:
     *
     * "top -1"  表示在垂直方向，对顶布局，同时便宜定位元素自身高度
     * 的 -1 倍，即向上偏移定位元素 1.0倍 的高度距离;
     *
     * "left 0.5"  表示在平衡方向，对最左布局，同时便宜定位元素自身
     * 宽度的 0.5 倍，即向右偏移定位元素 0.5倍 的高度距离;
     *
     */
	var Place = function (el, relative, top, left, outer, zindex) {
		if (!el || !relative || !top || !left) return;

        // 如果是 $ 对象，修复对象
        el = el instanceof Magic ? el[0] : el;
        relative = relative[0] ? relative[0] : relative;

		zindex = zindex || Place.zindex || 100;
		relative = $(relative)[0] || document.body;

		var parent, offset, $el = $(el), style, place = [],
            topfix, leftfix, rel = Place.outerRect(relative);

        if (outer === true) {
            parent = Place.relRoot(relative);
        } else if (outer instanceof Element) {
            parent = outer;
        } else {
            parent = relative;
        }

        ele = Place.outerRect(el, parent);

        if (parent != document.body && $(parent).css("position") == "static") {
            $(parent).css("position", "relative");
        }

		place[0] = top.split(" ");
		place[1] = left.split(" ");

        // 如果实际定位的元素不是元素自身，需要修正坐标值
        if (parent != relative) {
            var tmp = Place.outerRect(parent);
            offset = Place.outerRect(relative);

            offset.top  -= tmp.top;
            offset.left -= tmp.left;

            offset.top  += OFFSET[place[0][0]] * rel.height;
    		offset.left += OFFSET[place[1][0]] * rel.width;
        } else {
            offset = {};

            offset.top  = OFFSET[place[0][0]] * rel.height;
    		offset.left = OFFSET[place[1][0]] * rel.width;
        }

		topfix  = parseFloat(place[0][1]) || 0;
		leftfix = parseFloat(place[1][1]) || 0;

		offset.top  += ele.height * topfix;
		offset.left += ele.width  * leftfix;

		style  = $el.attr("style") || '';
        style += "top:"+offset.top+"px;left:"+offset.left+"px;"
                +"z-index:"+zindex+";position:absolute;";
		$el.attr("style", style);
		$el.appendTo(parent);
	};

    /**
     * 获取元素的 尺寸信息
     * @param  {Object}  el       [要获取的对象信息]
     * @param  {Element} relative [相对定位的对象]
     * @return {Object}           [返回的尺寸信息对象]
     *
     * 如果 el 为字符串，会自动生成一个临时的对象到容器中来
     * 获取对象的尺寸信息，此时必须指定 relative 参数
     *
     * relative 为要插入的容器，因为有时候插入的元素会收到
     * 容器CSS的影响，导致尺寸有变化，为空默认为body元素
     */
	Place.outerRect = function(el, relative) {
		relative = $(relative)[0] || document.body;

		var rect, copy = {}, clone, fix, docElem, win = window,
			render = '<div style="position: absolute; visibility: hidden"></div>';

		if (el == document) {
			var body = document.body,
				width = body.clientWidth,
				height = body.clientHeight;

			rect = {
				top: 0, left: 0, right: width,

				bottom: height, width: width, height: height
			}
		} else {
			if (typeof el == "string") {
				rect  = {top: 0, left: 0, right: 0, bottom: 0};
				clone = el;
			} else if (el.getBoundingClientRect) {
				clone = el.cloneNode(true);
				rect  = el.getBoundingClientRect();
                docElem = el.ownerDocument.documentElement;
			}

			if (!rect.width && !rect.height && relative) {
				render = $(render).appendTo(relative);

                el = $(clone).appendTo(render)[0];
                $(el).css("position: absolute;");
				fix = el.getBoundingClientRect();
                docElem = el.ownerDocument.documentElement;

				render.remove();	// 删除创建的零时节点
			}
		}

		for (var key in rect) {
			copy[key] = rect[key];
		}

		if (fix /* 修复对象为真，则修复高宽 */) {
			copy.width  = fix.width;
			copy.height = fix.height;
		}

        copy.top  = copy.top + win.pageYOffset - docElem.clientTop;
        copy.left = copy.left + win.pageXOffset - docElem.clientLeft;

		return copy;
	}

	Place.relRoot = function(el, out) {
		var relative, node = el;

		do {
			if (out && node == el) continue;

			if (getComputedStyle(node).position != "static") {
				relative = node; break;
			}
		} while(node = el.parentNode);

		return relative || document.body;
	}

	/* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.place) {
        $.extend({place: Place});
        $.extend({outerRect: Place.outerRect});
    };

    if ($ && $.fn && !$.fn.place) {
        $.fn.extend({place: function(el, top, left, zindex) {
            Place(el, this, top, left, zindex);

			return this;
        }});

        $.fn.extend({outerRect: function(relative) {
            return Place.outerRect(this[0], relative);
        }});
    };
})(document);
