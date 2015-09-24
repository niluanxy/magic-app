require("./style.scss");

module.exports = (function() {
    var Timer = function(option, time) {
        this.value = "";                // 存放当前时间的date对象
        this.el    = null;              // 当前DOM控制句柄
        this.modal = null;              // 控制整体弹框
        this.page  = [];                // 页面信息
        this.scroll= {};                // 滚动条信息
        this.input = null;              // 绑定的input，可为空
        this.options = $.extend({}, Timer.DEFAULT, option, true);
    };

    Timer.DEFAULT = {
        type  : "mobile",               // 现实模式，移动/桌面
        show  : "YMD-hm",               // 需要显示的UI模块
        text  : "YYYY-MM-DD hh:mm",     // 选择框中提示文字的模板
        format: "YYYY-MM-DD hh:mm",     // 最终输出的内容的模板
        filter: "",                     // 数据项过滤器，负数反选，正数正选，~区间

        /* values: { Y: [], M: []...}   // 自动追加的参数，存放每个字段的具体可选值 */

        min   : '',                     // 最小选择时间，默认为现在前五年
        max   : '',                     // 最大选择时间，默认为现在后五年

        call  : null,                   // 选择后回调，传递三个参数 (type, val, handle)
    }

    /* 时间类型的简写和全写互转 */
    Timer.type = function(find) {
        var type = {
            Y: "year", M: "month", D: "day", h: "hour", m: "minute"
        }

        for (var key in type) {
            if (key === find) {
                return type[key];
            } else if (type[key] === find) {
                return key;
            }
        }

        return "";
    }

    /* 判断是否为闰年 */
    Timer.isLeap = function(year) {
        if (isNaN(year)) return false;

        year = parseInt(year);  // 转为数字，方便处理

        return (year%4==0 && year%100!=0)||(year%100==0 && year%400==0);
    }

    /* 通过传入年份和月份，返回该月的天数
     * Tips: 月份从 0 开始 */
    Timer.getDays = function(year, month) {
        if (isNaN(year) || isNaN(month)) return false;

        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        month = month > 12 ? 11 : (month < 0 ? 0 : month);  // 修正月份
        days[1] += Timer.isLeap(year) ? 1 : 0;                // 修正二月的天数

        return days[month];     // 返回对应的月的天数
    }

    /* 运算表达式 */
    Timer.operat = function(num, str, save) {
        if (!str || !num || !save) return 0;

        var ope = [], vals = [num, null], snum,
            pos = 0, chk, dir = 0, cal = [];

        do {
            chk = str[pos]; snum = "";

            if (!isNaN(chk) /* 当前为数字 */) {
                snum += chk;        // 尝试循环查找数字

                for(var i=pos+1; i<str.length; i++) {
                    if (isNaN(str[i])) break;
                    snum += str[i]; pos = i;
                }

                snum = parseInt(snum);      // 存放获得的 数字 值
                chk  = ope[ope.length-1];   // 存放顶层的操作符

                if (["+", "-"].indexOf(chk) > -1) {
                    vals[dir] += (chk=="+"?1:-1)*snum;
                    ope.pop();              // 操作后操作符需要弹出栈
                } else {
                    vals[dir] = snum;
                }
            } else {
                if (chk == "~") {
                    vals[++dir] = num;
                }

                ope.push(chk);
            }
        } while (++pos < str.length);

        do {
            chk = ope.pop();

            if (chk == '~') {
                for(var i=vals[0]; i<=vals[1]; i++) {
                    cal.push(i);   // 压入数据
                }

                vals[0] = vals[1] = null;
            } else if (chk == '!') {
                do {
                    snum = cal.pop();

                    do {
                        pos = save.indexOf(snum);
                        if (pos != -1) {
                            save.splice(pos, 1);
                        }
                    } while (pos != -1);
                } while(snum != undefined);
            }
        } while (chk != undefined);

        /* 计算结果加入到原数组中 */
        vals[0] && save.push(vals[0]);
        vals[1] && save.push(vals[1]);
        save = save.concat(cal);

        /* 先从小到大排序，然后剔除重复元素 */
        save.sort(function(a,b){return a>b?1:-1});
        chk = null; pos = 0; // 用于临时存放数据
        do {
            snum = save[pos];

            if (snum == chk) {
                save.splice(pos, 1);
            } else {
                pos++; chk = snum;
            }
        } while (save.length && pos < save.length);

        return save[save.lengh];    // 返回最后的值
    }

    /* 通过过滤器生成具体的选择值 */
    Timer.initVals = function(type, filter, ext) {
        /* Y 年    M 月    D 日    h 时    m 分    s 秒 */

        var vals = [], now = new Date(), fil, num;

        if (type === 'Y') {
            vals.push(now.getFullYear());
        } else if (type === "M") {
            vals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        } else if (["D", "h", "m"].indexOf(type) != -1) {
            var max; // 存放循环初始化的边界

            switch (type) {
                case "D":
                    max = Timer.getDays(now.getFullYear(), ext);
                    break;
                case "h":
                    max = 24;
                    break;
                default :
                    max = 60;
            }

            /* 有 step 值时，直接生成值列表 */
            if (type === "m" && ext) {
                for (var i=0; i<max; i+=ext) {
                    vals.push(i);   // 存入step分钟
                }
            } else {
                for (var i=0; i<max; i++) {
                    vals.push(i+(type=="D"?1:0));   // 存入循环数值
                }
            }
        }

        /* 有过滤器参数，且无 step 参数才执行 */
        if (filter && !(type == "m" && ext)) {
            num = vals[0];  // 当前操作对象
            fil = filter.replace(/[\[|\]|\s]/g, '');
            fil = fil ? fil.splice(',') : [];

            for(var i=0; i<fil.length; i++) {
                num = Timer.operat(num, fil[i], vals);
            }
        }

        return vals;    // 返回最终的可选值数组
    }

    /* 时间格式化方法，传入字符串时则生成一个新时间对象 */
    Timer.format = function(time, format) {
        if (typeof time == "string") {
            var argv = time.replace(/[\-|\s|:|\/|\\]/g, ",");
            argv = argv.split(",");     // 转为数组格式

            for(var i=0; i<argv.length; i++) {
                argv[i] = parseInt(argv[i]);
            }

            return new Date(argv[0] || 0, (argv[1]-1) || 0, argv[2] || 0,
                            argv[3] || 0, argv[4] || 0, argv[5] || 0);
        } else {
            var old = {
                "M+" : time.getMonth()+1,                 //月份
                "D+" : time.getDate(),                    //日
                "h+" : time.getHours(),                   //小时
                "m+" : time.getMinutes(),                 //分
                "s+" : time.getSeconds(),                 //秒
                "q+" : Math.floor((time.getMonth()+3)/3), //季度
                "S"  : time.getMilliseconds()             //毫秒
            };

            if(/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1,
                    (time.getFullYear()+"").substr(4 - RegExp.$1.length));
            }

            for(var k in old) {
                if(new RegExp("("+ k +")").test(format)) {
                    format = format.replace(RegExp.$1,
                        (RegExp.$1.length == 1) ? (old[k]) :
                            (("00" + old[k]).substr(("" + old[k]).length)));
                }
            }

            return format;
        }
    };

    /* 获得给定时间的指定部分的前缀 */
    Timer.prefix = function(date, type, fix) {
        var array, prefix = "", pos, rule = {
            "Y": 0, "M": 1, "D": 2, "h": 3, "m": 4
        };

        pos   = rule[type] + (fix||0);   // 获取前缀终止位置
        array = Timer.format(date, "YYYY-MM-DD hh:mm");
        array = array.replace(/[\-|\s|:]/g, ",").split(",");

        /* 依次将前缀转为字符串 */
        for (var i=0; i<pos; i++) {
            prefix += array[i];
        }

        return prefix;
    }

    /* 通过给定的最小最大值，来再次修正可选择值列表
    * TIP: 给定的 vals 值数组必须是从小到大排过序 */
    Timer.fixVals = function(type, vals, now, min, max) {
        var select = [], pre, old, tmp,
            start = 0, end = vals.length-1;

        if (!type || !vals || !(now instanceof Date)) return vals;

        if (min instanceof Date) {
            old = parseInt(Timer.prefix(min, type, 1));
            pre = Timer.prefix(now, type);
            for (var i=0; i<vals.length; i++) {
                tmp = vals[i]; tmp = (tmp<10?"0":"")+tmp;
                if (old <= parseInt(pre+tmp)) {
                    start = i; break;   // 正向查最小值
                }
            }
        }

        if (max instanceof Date) {
            old = parseInt(Timer.prefix(max, type, 1));
            for (var i=vals.length-1; i>=0; i--) {
                tmp = vals[i]; tmp = (tmp<10?"0":"")+tmp;
                if (old >= parseInt(pre+tmp)) {
                    end = i; break;     // 反向查最大值
                }
            }
        }

        /* 将筛选结果放入返回数组中 */
        for (var i=start; i<=end; i++) {
            select.push(vals[i]);
        }

        return select;  // 返回最终筛选过的值列表
    };

    /* 根据类型，可选值，返回插入的HTML */
    Timer.makeHtml = function(type, vals) {
        var html = "", fix = type=="M"?1:0;

        for (var i = 0; i < vals.length; i++) {
            html += "<span class='item' val='"+vals[i]+"'>";
            html += (vals[i]+fix<10?'0':'')+(vals[i]+fix)+"</span>";
        }

        return html;    // 返回最终构建的HTML
    }


    /* TODO: min,max功能测试
     * TODO: 过滤器功能测试
     * TODO: 时间和日期同时出现时显示切换，以及提示时间显示
     * TODO: input绑定功能设置，vue组件编写 */
    Timer.prototype.init = function() {
        var that = this, opt = that.options, tmp,
            dir = 0, show, scroll = that.scroll;

        that.el = $("<div class='timer'></div>");
        show = opt.show.match(/[Y|M|D|\-|h|m]/g);


        /* 创建放置滚动条的容器 */
        that.page[0] = $("<div class='screen'></div>")
                                .appendTo(that.el);
        that.page[1] = $("<div class='screen hideOut'></div>")
                                .appendTo(that.el);

        /* 过滤器初始化 */
        if (typeof opt.filter == "string") {
            tmp = opt.filter.split(/\]\s*,/);

            opt.filter = {}; // 转为对象，方便存取过滤器
            for (var i=0; i<tmp.length; i++) {
                tmp[i].replace(/[\[|\]|\s]/g, "");
                vals = tmp[i][1]; // 获取第一个字符

                opt.filter[vals] = "["+tmp[i].replace(/^.*:/, "")+"]";
            }
        }

        that.value = new Date();  // 获取当前时间
        /* 添加每个滚动对象到页面中 */
        for(var i=0; i<show.length; i++) {
            if ((tmp = show[i]) == "-" && dir == 0) {
                dir = 1; continue;  // 跳过添加
            }

            var ext = tmp == "D" ? that.value.getMonth(): null;

            vals = Timer.initVals(tmp, opt.filter[tmp], ext);
            vals = Timer.fixVals(tmp, vals, that.value, opt.min, opt.max);

            html = "<div class='time-item' type='"+Timer.type(tmp)+ "'><div class='list'>";

            scroll[tmp] = $(html+Timer.makeHtml(tmp, vals)+"</div></div>").scroll({
                                scrollbars: false,
                                snap      : true
                            });
            that.page[dir].append(scroll[tmp].wrapper);
        }

        /* 定义滚动结束的回调方法 */
        function scrollEnd() {
            var handle = this, val, $now, $el, type;

            $el  = $(handle.wrapper);
            type = $el.attr("type");
            $now = that.nowItem(Timer.type(type));

            val = $now.attr("val");
            that.update(Timer.type(type), val);     // 更新改变项值
            that.refresh(Timer.type(type));         // 刷新时间数据

            if (typeof opt.call == "function") {
                /* 执行时间选择完毕的回调 */
                opt.call(that.val(), that.value, that);
            }
        };

        for(var key in that.scroll) {
            that.scroll[key].on("scrollEnd", scrollEnd);
        }

        /* 创建底部控制按钮 */
        html  = "<div class='bottom'><a class='cancel button button-clear'>取消</a>";
        html += (show.length>3)?"<a class='toggle button button-clear'>时间</a>":"";
        html += "<a class='ok button button-clear'>确认</a></div>";

        that.el.append(html).appendTo("body");  // 插入到页面中
        that.modal = $.modal(that.el);

        return this;
    };

    /* 返回给定类型的当前选中的值 */
    Timer.prototype.itemVal = function(type) {
        var handle = this.scroll[type], val = 0, $now;

        if (handle /* 有值时才操作 */) {
            $now = this.nowItem(type);
            val  = $now.attr("val") || 0;
        }

        return val;         // 返回选定的值
    }

    /* 返回某个值的当前选中DOM对象 */
    Timer.prototype.nowItem = function(type) {
        var handle = this.scroll[type], pos;

        pos = handle.currentPage.pageY+1 || 1;

        return $(handle.scroller).find(".item:nth-child("+pos+")");
    }

    /* 手动更新某个时间值 */
    Timer.prototype.update = function(type, val) {
        var fun = {
            Y: "setFullYear",
            M: "setMonth",
            D: "setDate",
            h: "setHours",
            m: "setMinutes"
        }

        if (fun[type] && val) {
            /* 修复当前日期大于该月最大日期时，月份更改失败问题 */
            if (type == "M") {
                var now = this.value,
                    max = Timer.getDays(now.getFullYear(), val);

                if (max < now.getDate()) now.setDate(max);
            }

            this.value[fun[type]](parseInt(val));
        }

        return this.value;  // 返回修改后的值
    }

    /* 刷新时间对象的可选值列表 */
    Timer.prototype.refresh = function(type, date) {
        var filter, pos, now, $el, vals, tmp, opt = this.options;

        filter = "YMDhm".split("");    // 获取过滤器数据
        pos = filter.indexOf(type);
        pos = pos == -1 ? 0: pos;
        now = date instanceof Date ? date : this.value;

        for (var i=pos+1; i<filter.length; i++) {
            tmp = filter[i];    // 获取当前时间对象类型
            $el = this.el.find(".time-item[type='"+Timer.type(tmp)+"']>.list");

            if ($el[0] /* 当前是否有此对象 */) {
                vals = Timer.initVals(tmp, filter[tmp], now.getMonth());
                vals = Timer.fixVals(tmp, vals, now, opt.min, opt.max);

                html = Timer.makeHtml(tmp, vals);

                /* 更新事件数据，同时刷新滚动条 */
                $el.html(html); this.scroll[tmp].refresh();
                this.update(tmp, this.itemVal(tmp));
            }
        }

        return this;
    };

    Timer.prototype.show = function() {
        this.modal.show();

        var scroll = this.scroll;
        for(var key in scroll) {
            scroll[key].refresh();
        }

        return this;
    };

    Timer.prototype.hide = function() {
        this.modal.hide();

        return this;
    };

    Timer.prototype.val = function(format) {
        var fmt = format || this.options.format;

        return Timer.format(this.value, fmt);
    }

    Timer.prototype.destroy = function() {
        this.el.remove();   // 删除自身
    };

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.timer) {
        $.extend({timer: function(time, option) {
            return new Timer(time, option).init();
        }});
    };

    if ($ && $.fn && !$.fn.modal) {
        $.fn.extend({timer: function(time, option) {

            return new Timer(time, option).init();
        }});
    };
})();