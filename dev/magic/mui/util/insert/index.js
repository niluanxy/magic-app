exports.module = (function(doc, undefined) {
	var OFFSET = {
		'top'    : 0,
		'left'   : 0,
		'center' : 0.5,
		'right'  : 1,
		'bottom' : 1
	};

	var Insert = function (el, relative, top, left, zindex) {
		if (!el || !relative || !top || !left) return;

		zindex = zindex || Insert.zindex || 100;

		var parent, offset, $el = $(el), style, place = [], topfix, leftfix,
			ele = Insert.outerRect(el), rel = Insert.outerRect(relative);

		parent = Insert.relRoot(relative, true);
		offset = Insert.relOffset(relative);

		place[0] = top.split(" ");
		place[1] = left.split(" ");

		offset.top  += OFFSET[place[0][0]] * rel.height;
		offset.left += OFFSET[place[1][0]] * rel.width;
		
		topfix  = parseFloat(place[0][1]) || 0;
		leftfix = parseFloat(place[1][1]) || 0;

		offset.top  += ele.height * topfix;
		offset.left += ele.width  * leftfix;

		style = "top:"+offset.top+"px;left:"+offset.left+"px;"
				+"z-index:"+zindex+";position: absolute;";
		$el.attr("style", style);
		$el.appendTo(parent);
	};

	Insert.outerRect = function(el) {
		var rect, copy = {}, fix, render = '<div style="position: fixed;top: 200%;"></div>';

		if (el == document) {
			var body = document.body,
				width = body.clientWidth,
				height = body.clientHeight;

			rect = {
				top: 0, left: 0, right: width,

				bottom: height, width: width, height: height
			}
		} else {
			rect = el.getBoundingClientRect();

			if (rect.width == 0 && rect.height == 0) {
				render = $(render).appendTo(document.body);

				fix = $(el.cloneNode(true)).appendTo(render)[0]
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

	Insert.relRoot = function(el, out) {
		var relative, node = el;

		do {
			if (out && node == el) continue;

			if (getComputedStyle(node).position != "static") {
				relative = node; break;
			}
		} while(node = el.parentNode);

		return relative || document.body;
	}

	Insert.relOffset = function(el) {
		var style = getComputedStyle(el);

		return {top: parseFloat(style.top), left: parseFloat(style.left)};
	}

	$.placeOf = function(el, relative, top, left, zindex) {
		Insert($(el)[0], $(relative)[0], top, left, zindex);
	};

	$.fn.placeOf = function(relative, top, left, zindex) {
		Insert(this[0], $(relative)[0], top, left, zindex);

		return this;
	}
})(document);