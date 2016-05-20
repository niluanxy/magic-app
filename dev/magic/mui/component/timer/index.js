module.exports = (function() {
    var Timer = function(option) {
        this.value = "";                // 存放当前时间的date对象
        this.el    = null;              // 当前DOM控制句柄
        this.modal = null;              // 控制整体弹框
        this.page  = [];                // 页面信息
        this.scroll= {};                // 滚动条信息
        this.input = null;              // 绑定的input，可为空
        this.options = $.extend({}, Timer.DEFAULT, option, true);
    };

    /**
     * 默认初始化参数
     * show: YMD-hm  其中 - 表示分页符，YMDhm 为具体要显示的组件
     * text: YYYY-MM-DD hh:mm 生成的数据格式为 2016-03-05 23:44
     */
    Timer.DEFAULT = {
        type  : "mobile",               // 显示模式，移动/桌面
        show  : "YMD",                  // 需要显示的UI模块
        text  : "YYYY-MM-DD",           // 选择框中提示文字的模板
        format: "YYYY-MM-DD",           // 最终输出的内容的模板
        filter: "",                     // 数据项过滤器，负数反选，正数正选，~区间

        /* values: { Y: [], M: []...}   // 自动追加的参数，存放每个字段的具体可选值 */

        min   : '',                     // 最小选择时间，默认为现在前五年
        max   : '',                     // 最大选择时间，默认为现在后五年

        /**
         * 每次滚动后回调，传递三个参数
         * type  : 当前滚动的类型  year month ...
         * val   : 当前类型的值
         * handle: 组件句柄
         */
        onScroll  : null,
        /**
         * 单击 确定或者取消 按钮后的回调，传递三个参数
         * val   : stirng 类型的当前时间值
         * value : date   类型的当前时间值
         * handle: 组件句柄
         */
        onConfirm : null,                 // 点击确定按钮后的回掉
        onCancel  : null                  // 点击取消按钮后的回掉
    }

    /* 判断是否为闰年 */
    Timer.isLeap = function(year) {
        if (isNaN(year)) return false;

        year = parseInt(year);  // 转为数字，方便处理

        return (year%4==0 && year%100!=0)||(year%100==0 && year%400==0);
    }

    /* 返回给定事件加上某天后的新的时间对象 */
    Timer.dateAdd = function(date, days) {
        if (typeof date == "number") {
            date = new Date(date);
        }

        var time = date.getTime(), fix;
        fix = days * 24 * 60 * 60 * 1000;

        return new Date(time+fix);
    }

    /* 获取给定时间所在的周的第一天，从周一开始算 */
    Timer.getWeek = function(date, all) {
        if (typeof date == "number") {
            date = new Date(date);
        }

        /* 强制设置小时为中午，避免 00:00 会记为前一天 */
        date = $.time.format(date, "YYYY-MM-DD");
        date = $.time.format(date + " 12:00");

        var week = (6+date.getUTCDay())%7,
            rets = [], start = Timer.dateAdd(date, -week);

        if (all === true) {
            for (var i=0; i<7; i++) {
                rets.push(Timer.dateAdd(start, i));
            }
        } else {
            rets.push(start);
        }

        return all === true ? rets : rets[0];
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
        for(var i = 0; i < cal.length; i++) {
            save.push(cal[i]);
        }

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

        return save[save.length-1];    // 返回最后的值
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
            fil = fil ? fil.split(',') : [];

            for(var i=0; i<fil.length; i++) {
                num = Timer.operat(num, fil[i], vals);
            }
        }

        return vals;    // 返回最终的可选值数组
    }

    /* 时间格式化方法，传入字符串时则生成一个新时间对象 */
    Timer.format = function(time, format) {
        if (typeof time == "number") {
            time = new Date(time);
        }
        format = format || "YYYY-MM-DD hh:mm:ss";

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

    /**
     * 转会类型值为简写值
     * @param  {String} type [要转换的类型值]
     * @return {String}      [转写后的类型简值]
     *
     * Y -> Y  year -> Y  month -> M  minute -> m
     */
    function transType(type) {
        var simple = "YMDhm", maps = {
                year: "Y", month: "M",  day: "D",
                hour: "h", minute: "m"
            }, ret = null;

        if (simple.search(type) > -1) {
            ret = type;
        } else if(maps[type]) {
            ret = maps[type];
        }

        return ret;
    }

    /**
     * 返回指定类型的全名
     * @param  {String} type [要转换的类型值]
     * @return {String}      [转写后的类型全名]
     *
     * Y -> year  month -> month
     */
    function transTypeName(type) {
        var simple = "yearmonthdayhourminute",
            maps = {
                Y: "year", M: "month", D: "day",
                h: "hour", m: "minute"
            }, ret = null;

        if (simple.search(type) > -1) {
            ret = type;
        } else if(maps[type]) {
            ret = maps[type];
        }

        return ret;
    }

    /* TODO: min,max功能测试
     * TODO: 过滤器功能测试
     * TODO: 时间和日期同时出现时显示切换，以及提示时间显示
     * TODO: step分钟过滤器功能添加
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

            html = "<div class='time-item' type='" + transTypeName(tmp)
                   + "'><div class='list'>";

            scroll[tmp] = $(html+Timer.makeHtml(tmp, vals)+"</div></div>")
                          .scroll({
                              snap: true,
                              refresh: true,
                              scrollbars: false
                          });

            that.page[dir].append(scroll[tmp].wrapper);
        }

        /* 定义滚动结束的回调方法 */
        function scrollEnd() {
            var handle = this, $now, $el, type;

            $el  = $(handle.wrapper);
            type = $el.attr("type");
            $now = that.typeDom(type);

            that.refreshItem(type);          // 刷新时间数据

            if ($.isFun(opt.onScroll)) {
                /* 执行时间选择完毕的回调 */
                opt.onScroll(type, that.typeVal(type), that);
            }
        };

        for(var key in that.scroll) {
            that.scroll[key].on("scrollEnd", scrollEnd);
        }

        /* 创建底部控制按钮 */
        html  = "<div class='bottom'><a class='cancel button button-clear'>取消</a>";
        html += (show.length>3)?"<a class='toggle button button-clear'>下一项</a>":"";
        html += "<a class='ok button button-clear'>确认</a></div>";

        that.el.append(html).appendTo("body");  // 插入到页面中
        that.modal = $.modal(that.el);

        that.el.on("tap", ".button", function(e) {
            e.stopPropagation();

            var $target = $(e.target), ret, val = "";

            if ($target.hasClass("cancel")) {
                if ($.isFun(opt.onCancel)) {
                    ret = opt.onCancel(that.val(), that.value, that);
                }
            } else if ($target.hasClass("ok")) {
                that.value = that.showValue();  // 更新当前时间

                if ($.isFun(opt.onConfirm)) {
                    ret = opt.onConfirm(that.val(), that.value, that);
                }
            } else if ($target.hasClass("toggle")) {
                var page = that.page;

                for(var i=0; i<page.length; i++) {
                    page[i].toggleClass("hideOut");
                }

                if (page[0].hasClass("hideOut")) {
                    $target.text("上一页");
                } else {
                    $target.text("下一页");
                }

                that.refreshItem();

                ret = false;
            }

            if (ret !== false) that.hide();
        })

        return this;
    };

    /**
     * 返回 给定类型 当前 值
     * @param  {String}  type [查找的类型]
     * @return {String}       [返回值 或 null]
     *
     * type: Y, year, Month, day ...
     */
    Timer.prototype.typeVal = function(type) {
        type = transType(type); // 转换为简值
        var $dom = this.typeDom(type), val = null;

        if ($dom /* 有值时才操作 */) {
            val = $dom.attr("val") || null;
            if (type == "M" && val) {
                val = parseInt(val)+1;
            }
        }

        return val;         // 返回选定的值
    }

    /**
     * 返回 给定类型 当前 DOM对象
     * @param  {String}  type [查找的类型]
     * @return {Element}      [返回DOM 或 null]
     *
     * type: Y - year  M - month D - day 以此类推
     */
    Timer.prototype.typeDom = function(type) {
        type = transType(type); // 转换为简值
        var handle = this.scroll[type], pos, dom = null;

        if (handle /* 给定类型有DOM对象 */ ) {
            pos = handle.currentPage.pageY+1 || 1;
            dom = $(handle.scroller).find(".item:nth-child("+pos+")");
        }

        return dom && dom.length ? dom : null;
    }

    /**
     * 返回 给定类型 给定值 的 DOM 序号
     * @param  {String} type [查找的类型]
     * @param  {Number} val  [查找的值]
     * @return {Number}      [查到的 DMO 的 序号]
     */
    Timer.prototype.typePos = function(type, val) {
        type = transType(type); // 转换为简值
        var handle = this.scroll[type], pos = null, childs;

        if (handle /* 给定类型有DOM对象 */ ) {
            childs = handle.scroller.children;

            for(var i=0; i<childs.length; i++) {
                if ($(childs[i]).attr("val") == val) {
                    pos = i; break;
                }
            }
        }

        return pos;
    }

    /* 手动更新某个时间值 */
    Timer.prototype.update = function(type, val) {
        type = transType(type); // 转换为简值
        var call, handle = this.scroll[type], pos,
            fun = {
                Y: "setFullYear", M: "setMonth", D: "setDate",
                h: "setHours",    m: "setMinutes"
            };

        val = type == "M" ? val-1 : val;

        if (handle && (call = fun[type]) && val) {
            pos = this.typePos(type, val) || 0;
            // 防止当前不在显示的scroll报错
            if (handle.pages.length) {
                handle.goToPage(0, pos, 0);
            }
            val = this.typeDom(type).attr("val");

            /* 修复当前日期大于该月最大日期时，月份更改失败问题 */
            if (type == "M") {
                var now = this.value,
                    max = Timer.getDays(now.getFullYear(), val);

                if (max < now.getDate()) now.setDate(max);
            }

            this.value[call](parseInt(val));
            this.refreshItem();
        }

        return this.value;  // 返回修改后的值
    }

    /* 获得当前组件显示的 时间值 */
    Timer.prototype.showValue = function() {
        var val = "", opt = this.options,
            find = opt.show.replace("-", '').split('');

        for(var i=0; i<find.length; i++) {
            val += this.typeVal(find[i]) + " ";
        }

        return Timer.format(val);
    }

    /* 刷新时间对象的可选值列表 */
    Timer.prototype.refreshItem = function(type, date) {
        type = transType(type); // 转换为简值
        var filter, pos, now, $el, vals,
            ext, tmp, html, opt = this.options;

        filter = "YMDhm".split("");    // 获取过滤器数据
        pos = filter.indexOf(type);
        pos = pos == -1 ? 0: pos;
        now = date instanceof Date ? date : this.value;

        for (var i=pos+1; i<filter.length; i++) {
            tmp = filter[i];    // 获取当前时间对象类型
            ext = tmp=="D"?this.typeVal("M")-1:null;
            $el = this.el.find(".time-item[type='"
                  + transTypeName(tmp)+"']>.list");

            if ($el[0] /* 当前是否有此对象 */) {
                vals = Timer.initVals(tmp, filter[tmp], ext);
                vals = Timer.fixVals(tmp, vals, now, opt.min, opt.max);

                html = Timer.makeHtml(tmp, vals);

                $el.html(html);   /* 更新事件数据，同时刷新滚动条 */
                this.scroll[tmp] && this.scroll[tmp].refresh();
            }
        }

        return this;
    };

    Timer.prototype.show = function() {
        this.modal.show();  // 先显示DOM对象

        var keys = this.options.show.replace("-", '').split(''),
            time = this.val("YYYY-M-D-h-m").split("-"), vals;

        vals = {
            Y: time[0], M: time[1], D: time[2],
            h: time[3], m: time[4]
        };

        for(var i=0; i<keys.length; i++) {
            var type = keys[i], val = vals[type];

            this.update(type, val);
        }

        return this;
    };

    Timer.prototype.hide = function() {
        this.modal.hide();

        return this;
    };

    /* 返回当前时间对应格式的字符串 */
    Timer.prototype.val = function(format) {
        var fmt = format || this.options.format;

        return Timer.format(this.value, fmt);
    }

    Timer.prototype.destroy = function() {
        this.modal.destroy();   // modal删除
    };

    /* 尝试绑定方法到 magic 框架的全局对象上 */
    if ($ && !$.timer) {
        $.extend({timer: function(option) {
            return new Timer(option).init();
        }});
    };

    if ($ && $.fn && !$.fn.timer) {
        $.fn.extend({timer: function(option) {
            return new Timer(option).init();
        }});
    };

    $.time = {
        isLeap   : Timer.isLeap,                // 判断是否闰年
        getDays  : Timer.getDays,               // 根据传入的年和月，返回天数
        operat   : Timer.operat,                // 通过运算符生产结果值
        initVals : Timer.initVals,              // 通过过滤器生成指定的值
        format   : Timer.format,                // 格式化时间为指定文本格式
        prefix   : Timer.prefix,                // 获取时间的事件前缀
        fixVals  : Timer.fixVals,               // 通过给定的最小最大值，筛选值列表
        dateAdd  : Timer.dateAdd,               // 给定时间增加指定天数后的新时间
        getWeek  : Timer.getWeek,               // 返回给定时间所在周的第一天或者全部

        operat   : Timer.operat,                // 通过表达式计算结果
    }
})();
