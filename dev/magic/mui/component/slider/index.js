require("./style.scss");

module.exports = (function() {
    var Slider = function(el, options) {
        this.el         = $(el);
        this.handle     = null;
        this.pageWidth  = 0;
        this.pageHeight = 0;
        this.pageIndex  = 0;
        this.pageLength = 0;
        this.options    = $.extend({}, Slider.DEFAULT, options, true);
        this.timeHandle = null;
        this.__render   = null;
    }

    Slider.DEFAULT = {
        autoPlay: true,
        time: 4000,
        indicator: true,
        describe: false,
        scale: false
    }

    Slider.prototype.init = function() {
        var that = this, opt = that.options, childs, $first, scroll;

        that.el.wrapAll("<div class='slider_scroll'></div>");
        scroll = that.el.children();
        childs = scroll.query(".slider-item");
        $first = $(childs[0]);

        that.__render = $first.render(function() {
            that.pageWidth = $first.width();
            if (opt.scale) {
                scroll.height(that.pageWidth*opt.scale);
            }
            that.pageLength = childs.length;
            scroll.width(that.pageWidth*childs.length);
            for(var i=0; i<childs.length; i++) {
                var style = childs[i].style;
                style.width = that.pageWidth+"px";
            }
            scroll.addClass("hasInit");

            // 初始化组件滚动效果
            that.handle = that.el.scroll({
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: true,
                snapSpeed: 600,
                scrollbars: false
            });
            that.play();
        })

        that.el.on("touchstart", function() {
            clearInterval(that.timeHandle);
        })

        that.el.on("touchend", function() {
            var call = that.options.call;
            that.play();   // 初始化播放

            // 更新当前 slide 停止的页面索引
            var pageX = that.handle.x * -1;
            that.pageIndex = parseInt(pageX/that.pageWidth);

            // 尝试手动触发slider载入后的回掉方法
            if (typeof call == "function") {
                var index = (that.pageIndex+1);
                index = index > that.pageLength ? 1 : index;
                call.call(that, that.el.find(
                    ".slider-item:nth-child("+index+")"
                ), index);
            }
        })

        return this;
    };

    Slider.prototype.play = function(go) {
        if (this.pageWidth > 0) {
            var that = this, opt  = that.options, call = opt.call;

            clearInterval(that.timeHandle);
            if (opt.autoPlay && opt.time) {
                that.timeHandle = setInterval(function() {
                    that.next();    // 自动播放下一个
                }, opt.time)
            }

            /* 直接跳转到制定的地方 */
            if (go && !isNaN(go)) that.go(go);
        }

        return this;
    }

    Slider.prototype.now = function(pos) {
        var index = this.pageIndex+1,
            $item = this.el.find(".slider-item:nth-child("+index+")");

        return pos ? index : $item; // 返回下标或者当前元素
    }

    Slider.prototype.next = function() {
        return this.go(this.pageIndex+1);
    };

    Slider.prototype.prev = function() {
        return this.go(this.pageIndex-1);
    };

    Slider.prototype.pause = function(time) {
        var that = this;

        clearInterval(that.timeHandle);
        if (time && !isNaN(time)) {
            setTimeout(function() {
                that.play();
            }, time)
        }

        return this;
    };

    Slider.prototype.go = function(index) {
        // 只有内容真正载入的时候，才自动播放，以避免报错
        if (this.pageWidth > 0) {
            var len  = this.pageLength- 1,
                call = this.options.call;

            if (index == undefined) {
                index = this.pageIndex + 1;
            };

            index = index < 0 ? len : (index > len ? 0 : index);
            this.handle.goToPage(index, 0);     // 滚动到对应页面
            this.pageIndex = index;             // 更新当前索引

            if (typeof call == "function") {
                index = index+1;    // 更新下标
                call(this.el.find(
                    ".slider-item:nth-child("+index+")"
                ), index);
            }
        }

        return this;
    };

    Slider.prototype.destroy = function() {
        clearInterval(this.__render);
        clearInterval(this.timeHandle);
        this.options = null;
    }


    if ($ && $.fn && !$.fn.slider) {
        $.fn.extend({slider: function(option) {
            return new Slider(this[0], option).init();
        }})
    };
})();