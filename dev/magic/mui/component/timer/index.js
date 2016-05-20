module.exports = (function() {
    var Timer = function(option) {
        this.value = "";                // 存放当前时间的date对象
        this.el    = null;              // 当前DOM控制句柄
        this.modal = null;              // 控制整体弹框
        this.reset = false;             // 每次启动，只执行一次reset操作
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

    /* 通过传入年份和月份，返回该月的天数
     * Tips: 月份从 0 开始 */
    Timer.getDays = function(year, month) {
        if (isNaN(year) || isNaN(month)) return false;

        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        month = month > 12 ? 11 : (month < 0 ? 0 : month);  // 修正月份
        days[1] += Timer.isLeap(year) ? 1 : 0;                // 修正二月的天数

        return days[month];     // 返回对应的月的天数
    }

    /* 通过过滤器生成具体的选择值 */
    Timer.initVals = function(type, filter, ext, eyear) {
        /* Y 年    M 月    D 日    h 时    m 分    s 秒 */

        type = transType(type);
        var vals = [], year, fil, num;

        year = ext || (new Date).getFullYear();
        if (type === 'Y') {
            vals.push(year);
        } else if (type === "M") {
            vals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        } else if (["D", "h", "m", "s"].indexOf(type) != -1) {
            var max; // 存放循环初始化的边界

            switch (type) {
                case "D":
                    max = Timer.getDays(eyear || year, ext);
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
        if (filter && type == "Y") {
            fil = filter.replace(/[\[|\]|\s]/g, '');
            fil = fil ? fil.split(',') : [];

            for(var i=0; i<fil.length; i++) {
                var max, min, tmp;

                if (fil[i].length > 1) {
                    max = vals[vals.length - 1];
                    min = max+parseInt(fil[i]);

                    if (min > max /* 大小排序 */) {
                        tmp = max; max = min; min = tmp;
                    }

                    for(var j=min; j<max; j++) {
                        vals.push(j);
                    }

                    vals.sort();    // 从小到大排序
                }
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
        var simple = "YMDhms", maps = {
                year: "Y", month: "M",  day: "D",
                hour: "h", minute: "m", second: "s",
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
        var simple = "yearmonthdayhourminutesecond",
            maps = {
                Y: "year", M: "month",  D: "day",
                h: "hour", m: "minute", s: "second",
            }, ret = null;

        if (type.length > 1 && simple.search(type) > -1) {
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
     */
    Timer.prototype.init = function() {
        var that = this, opt = that.options, tmp,
            dir = 0, show, scroll = that.scroll, $toggle;

        that.el = $("<div class='timer'></div>");
        show = opt.show.match(/[Y|M|D|\-|h|m|s]/g);

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
                var fval = tmp[i].replace(/[\{|\[|\]|\s|\}]/g, ""),
                    fkey = fval[0];

                opt.filter[fkey] = "["+fval.slice(2)+"]";
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

            html = "<div class='time-item' type='" + transTypeName(tmp)
                   + "'><div class='list'>";

            scroll[tmp] = $(html+Timer.makeHtml(tmp, vals)+"</div></div>")
                          .scroll({
                              snap: true,
                              scrollbars: false
                          });

            that.page[dir].append(scroll[tmp].wrapper);
        }

        /* 定义滚动结束的回调方法 */
        function scrollEnd() {
            var handle = this, $now, $el, type;

            type = $(handle.wrapper).attr("type");
            type = transType(type);
            if (type == "M") {
                that.updateDays(that.typeVal("Y"), that.typeVal("M")-1);
            }

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
        $toggle = that.el.find(".bottom .toggle");

        (function() {
            var oldHide = that.modal.hide;

            that.modal.hide = function() {
                oldHide.call(that.modal);
                that.togglePage(true);
            }
        })();

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
                that.togglePage(); ret = false;
            }

            if (ret !== false) that.hide();
        })

        return this;
    };

    Timer.prototype.togglePage = function(start) {
        var $toggle = this.el.find(".bottom .toggle"),
            text, sel, start, end, show = this.options.show;

        for(var i=0; i<this.page.length; i++) {
            if (start == true) {
                this.page[i].toggleClass("hideOut", i==1);
            } else {
                this.page[i].toggleClass("hideOut");
            }
        }

        sel  = this.page[0].hasClass("hideOut") ? 1 : 0;
        text = sel == 1 ? "上一项" : "下一项";
        $toggle.length && $toggle.text(text);

        if (this.reset == true) {
            text = show.split("-");
            if (text && text.length > 1) {
                text  = text[sel];
                start = text[0];
                end   = text[text.length-1];
                this.resetScroll(start, end);
            }
            this.reset = false;
        }


        return this;
    }

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

    /**
     * 根据当前 value 值，重新设置 scroll 位置
     * type : 起始设定的对象，无则为从 Y 开始
     * end  : 终止设定的对象，无则默认设置到 s
     */
    Timer.prototype.resetScroll = function(stype, etype) {
        stype = transType(stype);
        var start, end, types = "Y-M-D-h-m-s".split("-"),
            vals  = this.val("YYYY-M-D-h-m-s").split("-");

        start = types.indexOf(stype);
        start = start == -1 ? 0 : start;
        end   = types.indexOf(etype);
        end   = end == -1 ? types.length : end+1;

        for(var i=start; i<end; i++) {
            var type = types[i], val = vals[i], pos;

            val = type == "M" ? vals[i]-1: vals[i];
            pos = this.typePos(type, val);

            // 如果scroll句柄不存在，退出
            if (!this.scroll[type]) break;
            this.scroll[type].goToPage(0, pos, 0);

            if (type == "M") this.updateDays();
        }

        return this;
    }

    /**
     * 根据给定的 year month 参数，刷新 day 数据
     * 注意，month 从0开始的
     */
    Timer.prototype.updateDays = function(year, month) {
        var html, data, $days,
            vals = this.val("YYYY-M").split("-");

        year  = year != null ? year : vals[0];
        month = month != null ? month : vals[1]-1;

        data  = Timer.initVals("D", null, month, year);
        html  = Timer.makeHtml("D", data);
        $days = this.el.find(".time-item[type='"
                    + transTypeName("D")+"']>.list");

        if ($days.length && this.scroll.D) {
            $days.html(html); this.scroll.D.refresh();
        }
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

    Timer.prototype.show = function() {
        this.reset = true;
        this.modal.show();  // 先显示DOM对象
        this.resetScroll();

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
        initVals : Timer.initVals,              // 通过过滤器生成指定的值
        format   : Timer.format,                // 格式化时间为指定文本格式
    }
})();
