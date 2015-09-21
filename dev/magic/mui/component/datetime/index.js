require("./style.scss");

module.exports = (function() {
    var Timer = function(time, option) {
        this.value = "";                // 存放当前选择时间结果
        this.options = $.extend({}, Modal.DEFAULT, option, true);
    };

    Timer.DEFAULT = {
        type  : "mobile",               // 现实模式，移动/桌面
        show  : "MD-hm",                // 需要现实的UI模块
        text  : "Y-M-D h:m",            // 选择框中提示文字的模板
        format: "Y-M-D h:m",            // 最终输出的内容的模板
        filter: "",                     // 数据项过滤器，负数反选，正数正选，~区间

        /* values: { Y: [], M: []...}   // 自动追加的参数，存放每个字段的具体可选值 */

        min   : '',                     // 最小选择时间，默认为现在前五年
        max   : '',                     // 最大选择时间，默认为现在后五年
    }

    /* 判断是否为闰年 */
    Timer.isLeap = function(year) {
        if (isNaN(year)) return false;

        year = parseInt(year);  // 转为数字，方便处理

        return (year%4==0 && year%100!=0)||(year%100==0 && year%400==0);
    }

    /* 通过传入年份和月份，返回该月的天数 */
    Timer.getDays = function(year, month) {
        if (isNaN(year) || isNaN(month)) return false;

        var days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        month = month > 12 ? 11 : (month < 0 ? 0 : month-1);  // 修正月份
        days[1] += Timer.isLeap(year) ? 1 : 0;                // 修正二月的天数

        return days[month];     // 返回对应的月的天数
    }

    /* 运算表达式 */
    Timer.operat = function(num, str, save) {
        if (!str || !num || !save) return 0;

        var ope = [], vals = [num, null], snum, pos = 0, chk, dir = 0;

        do {
            chk = str[pos]; snum = "";

            if (!isNaN(chk) /* 当前为数字 */) {
                snum += chk;        // 尝试循环查找数字

                for(var i=pos; i<str.length; i++) {
                    if (isNaN(str[i])) break;
                    snum += str[i]; pos = i;
                }

                snum = parseInt(snum);      // 存放获得的 数字 值

                if (ope[ope.length] == "+") {
                    vals[dir] += snum;
                } else if (ope[ope.length] == "-") {
                    vals[dir] -= snum;
                }
            } else {
                switch(chk) {
                    case "+" :
                        vals[dir] += num;
                        break;
                    case "-" :
                        vals[dir] -= num;
                        break;
                    case "~" :
                        dir = 1;
                    default :
                        ope.push(chk);
                }
            }
        } while (pos < str.length);

        dir = [];   // 变量复用，存放运算出的可选值
        do {
            chk = ope.pop();

            if (chk == '~') {
                for(var i=vals[0]; i<vals[1]; i++) {
                    dir.push(i);   // 压入数据
                }

                vals[0] = vals[1] = null;
            } else if (chk == '!') {
                for (var i=0; i<dir.length; i++) {
                    pos = save.indexOf(dir[i]);

                    if (pos != -1 /* 原数组有值 */) {
                        save.splice(pos, 1);
                    }
                }
            }
        } while (chk != undefined);

        vals[0] && save.push(vals[0]);
        vals[1] && save.push(vals[1]);

        console.log(save)

        return save[save.lengh];    // 返回最后的值
    }

    /* 通过过滤器生成具体的选择值 */
    Timer.initVals = function(type, filter, min, max, step) {
        /* Y 年    M 月    D 日    h 时    m 分    s 秒 */

        var vals = [], now = new Date(), operat = Timer.operat, fil, num;

        if (type === 'Y') {
            vals.push(now.getFullYear());

            if (filter /* 不为空时才处理 */) {
                num = vals[0];  // 当前操作对象
                fil = filter.replace(/[\[|\]|\s]/g, '');
                fil = fil ? fil.splice(',') : [];


            }
        }
    }

    Timer.prototype.init = function() {

    };

    /* 非公开方法，通过过滤器返回值列表 */
    Timer.prototype._vals = function(type) {

    }

    Timer.prototype.show = function(anim) {
        var scroll = this.el.data("ui_scroll");
        if (scroll) scroll.scrollTo(0, 0);

        this.isHide = false;
        this.el.removeClass("hideOut").addClass("showIn");

        return this;
    };

    Timer.prototype.hide = function(anim) {
        this.isHide = true;
        this.el.removeClass("showIn").addClass("hideOut");

        return this;
    };

    Timer.prototype.set = function() {

    };

    Timer.prototype.get = function() {

    };

    Timer.prototype.destroy = function() {
        this.el.remove();   // 删除自身
    };

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    $.extend({timer: Timer});

    //if ($ && !$.timer) {
    //    $.extend({timer: function(element, option) {
    //        return new Timer(element, option).init();
    //    }});
    //};
    //
    //if ($ && $.fn && !$.fn.modal) {
    //    $.fn.extend({timer: function(option) {
    //        var opt = $.extend({}, option);
    //        if (opt.hasInsert === undefined) {
    //            opt.hasInsert = true;
    //        }
    //        return new Timer(this[0], opt).init();
    //    }});
    //};
})();