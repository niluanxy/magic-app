/**
 * Created by niluanxy on 15/9/30.
 */

module.exports = (function() {
    var Lefter = function(el, options) {
        this.el      = $(el);
        this.handle  = null;

        /* 参数为数字的时候，修正传入参数 */
        if (!isNaN(options)) options = { endtime: options };

        this.options = $.extend({}, Lefter.DEFAULT, options, true);
    };

    Lefter.DEFAULT = {
        show   : "<span class='day'>{{D}}</span>天<span class='hour'>{{h}}</span>时"+
                 "<span class='minute'>{{m}}</span>分<span class='second'>{{s}}</span>秒",
        endshow: "",                    // 活动结束后的提示
        endtime: 0,                     // 距离结束的剩余时间
        space  : 1000,                  // 定时器的间隔时间
        before : null,                  // 倒计时前的回调方法
        finish : null,                  // 倒计时结束的回调方法
    };

    /* 通过给定参数，计算并返回剩余的时间，参数为时间戳 */
    Lefter.operat = function(nowtime, endtime) {
        var time  = new Date(), data;
        time.setTime(nowtime);

        /* 获取当前剩余时间 */
        data = {
            D : Lefter.timelen(endtime, true)+"",
            h : time.getHours(),
            m : time.getMinutes(),
            s : time.getSeconds(),
            ms: time.getMilliseconds()
        };

        if (data.h < 10) data.h = '0'+data.h;
        if (data.m < 10) data.m = '0'+data.m;
        if (data.s < 10) data.s = '0'+data.s;
        data.ms = parseInt(data.ms/100);

        return data;
    }

    /* 计算当前时间到给定时时间的差值，day为真时返回天数 */
    Lefter.timelen = function(endtime, day) {
        var now = new Date(),
            len = endtime - now.getTime()

        return day ? parseInt(len/(60*60*24*1000)) : len;
    }


    /* 倒计时初始化 */
    Lefter.prototype.init = function(time) {
        var that = this, opt = that.options, prefix = new Date();

        if (!isNaN(time)) opt.endtime = time;

        // 标准时间戳转为JS的时间戳
        opt.endtime = opt.endtime * 1000;
        prefix.setTime(opt.endtime);
        prefix.setHours(0, 0, 0, 0);
        prefix = prefix.getTime();

        clearInterval(that.handle);
        /* 运行计时器开始回调 */
        typeof opt.before == "function" && opt.before();
        /* 开始倒计时任务 */
        that.check(prefix);       // 初始化时执行一次，防止闪烁
        that.handle = setInterval(function() {
            that.check(prefix);
        }, opt.space)

        return this;
    };

    /* 检测当前倒计时状态，同时更新提示文本
     * prefix 为 时分秒为空的时间戳 */
    Lefter.prototype.check = function(prefix) {
        var data, opt = this.options,
            len = Lefter.timelen(opt.endtime);

        if (len > 0) {
            data = Lefter.operat(prefix+len, opt.endtime);
            this.el.tpl(opt.show, data);
        } else {
            // 执行倒计时结束回调
            this.el.tpl(opt.endshow);
            typeof opt.finish == "function" && opt.finish();
            clearInterval(this.handle);
        }

        return len > 0;
    }

    /* 倒计时初始化 */
    Lefter.prototype.destroy = function() {
        clearInterval(this.handle);
        this.el.remove();
        this.options = null;
    }

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.lefter) {
        $.extend({lefter: function(el, options) {
            return new Lefter(el, options).init();
        }});
    };

    if ($ && $.fn && !$.fn.lefter) {
        $.fn.extend({lefter: function(options) {
            return new Lefter(this[0], options).init();
        }});
    };
})();