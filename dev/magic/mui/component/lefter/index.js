/**
 * Created by niluanxy on 15/9/30.
 */

module.exports = (function() {
    var Lefter = function(el, options) {
        this.el      = $(el);
        this.time    = 0;
        this.handle  = null;
        this.options = $.extend({}, Lefter.DEFAULT, options, true);
    };

    Lefter.DEFAULT = {
        show   : "<span class='day'>{{D}}</span><span class='hour'>{{h}}</span>"+
                 "<span class='minute'>{{m}}</span><span class='second'>{{s}}</span>"+
                 "<span class='msecond'>{{ms}}</span>",
        left   : 0,                     // 距离结束的剩余时间
        before : null,                  // 倒计时前的回调方法
        finish : null,                  // 倒计时结束的回调方法
    };

    /* 通过给定参数，计算并返回剩余的时间 */
    Lefter.operat = function(nowtime, endtime) {
        var time  = new Date()

        time.setTime(nowtime)
        var data = {
            'Y' : time.getFullYear(),
            'M' : time.getMonth(),
            'D' : TimeLeft.timeTolen(endtime, 'day'),
            'h' : time.getHours(),
            'm' : time.getMinutes(),
            's' : time.getSeconds(),
            'ms': time.getMilliseconds()
        }

        if (data.D < 10) data.D = '0'+data.D
        if (data.h < 10) data.h = '0'+data.h
        if (data.m < 10) data.m = '0'+data.m
        if (data.s < 10) data.s = '0'+data.s

        data.ms = parseInt(data.ms/100)

        return {D:data.D, h:data.h, m:data.m, s:data.s, ms:data.ms}
    }

    /* 计算当前时间到给定时时间的差值，day为真时返回天数 */
    Lefter.timelen = function(endtime, day) {
        var now = new Date(),
            len = endtime - now.getTime()

        return day ? parseInt(len/(60*60*24*1000)) : len;
    }


    /* 倒计时初始化 */
    Lefter.prototype.init = function() {

    };

    Lefter.prototype.start = function() {

    };

    /* 倒计时初始化 */
    Lefter.prototype.destroy = function() {

    }
})();