exports.module = (function(doc, undefined) {
	var OFFSET = {
		'top'    : 0,
		'left'   : 0,
		'center' : 0.5,
		'right'  : 1,
		'bottom' : 1
	};

	var Place = function (el, relative, top, left, zindex) {
		if (!el || !relative || !top || !left) return;

		zindex = zindex || Place.zindex || 100;
		relative = $(relative)[0];

		var parent, offset, $el = $(el), style, place = [], topfix, leftfix,
			ele = Place.outerRect(el, relative), rel = Place.outerRect(relative);

		parent = Place.relRoot(relative, true);
		offset = Place.relOffset(relative);

		place[0] = top.split(" ");
		place[1] = left.split(" ");

		offset.top  += OFFSET[place[0][0]] * rel.height;
		offset.left += OFFSET[place[1][0]] * rel.width;
		
		topfix  = parseFloat(place[0][1]) || 0;
		leftfix = parseFloat(place[1][1]) || 0;

		offset.top  += ele.height * topfix;
		offset.left += ele.width  * leftfix;

		style = "top:"+offset.top+"px;left:"+offset.left+"px;"
				+"z-index:"+zindex+";position:absolute;";
		$el.attr("style", style);
		$el.appendTo(parent);
	};

	Place.outerRect = function(el, relative) {
		relative = relative || document.body;

		var rect, copy = {}, clone, fix,
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
			}
			
			if (!rect.width && !rect.height) {
				render = $(render).appendTo(relative);

				fix = $(clone).appendTo(render)[0]
						.getBoundingClientRect();

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

	Place.relOffset = function(el) {
		var style = getComputedStyle(el);

		return {top: parseFloat(style.top), left: parseFloat(style.left)};
	}

	/* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.modal) {
        $.extend({place: Place});
    };

    if ($ && $.fn && !$.fn.modal) {
        $.fn.extend({place: function(el, top, left, zindex) {
            Place(el, this, top, left, zindex);

			return this;
        }});
    };
})(document);