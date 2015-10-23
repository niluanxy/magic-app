module.exports = (function() {
    var eveData = [], eveUUID = 1, EventObj, Event = {}, fixpara;

    fixpara = ("target type pageX pageY clientX clientY keyCode keyChar "+
    "offsetX offsetY path timeStamp screenX screenY changedTouches targetTouches").split(" ");

    EventObj = function (src, porp) {
        this.originalEvent = src;
        this.originalData  = src.originalData || [];

        /* 从原事件对象复制属性 */
        for (var i=0; i<fixpara.length; i++) {
            var key = fixpara[i];

            if (src[key] !== undefined) {
                this[key] = src[key];
            }
        }

        /* 尝试使用修正对象修正属性 */
        for (var key in porp) {
            this[key] = porp[key];
        }

        this.isDefaultPrevented = false;
        this.isPropagationStopped = false;
        this.isImmediatePropagationStopped = false;

        return this;
    }

    EventObj.prototype.preventDefault = function () {
        var e = this.originalEvent;
        if (e) e.preventDefault();

        this.isDefaultPrevented = true;

        return this;
    }

    EventObj.prototype.stopPropagation = function () {
        var e = this.originalEvent;
        if (e) e.stopPropagation();

        this.isPropagationStopped = true;

        return this;
    }

    EventObj.prototype.stopImmediatePropagation = function () {
        var e = this.originalEvent;
        if (e) e.stopImmediatePropagation();

        this.isPropagationStopped = true;
        this.isImmediatePropagationStopped = true;

        return this;
    }


    /* 返回命名空间的指定位置 */
    function getfix(name, last) {
        var left, right;

        right = name.match(/\.+.*$/);
        right = right?right[0]:"";
        left  = name.replace(right, "");

        return last?right.replace(".", ""):left;
    }

    /* 检测指定元素是符合查询条件，相对其父元素 */
    function checkIn(ele, find) {
        if (find === "") return true;

        var ret = false, items;

        items = ele.parentNode;
        items = items ? items : document;
        items = items.querySelectorAll(find);

        for(var i=0; i<items.length; i++) {
            if (items[i] === ele) {
                ret = true; break;
            }
        }

        return ret;     // 返回检测结果
    }

    /* 手动执行绑定的回掉事件 */
    function triggerCall(ele, calls, event, porp) {
        if (!ele || !calls || !event) return false;

        event = event instanceof EventObj ? event :
            new EventObj(event, porp);
        if (!event.target) event.target = ele;

        /* 复制执行数组，修复once事件导致length异常问题 */
        var data = event.originalData || [],
            clone = calls.slice(0);

        if (!(data[0] instanceof EventObj)) {
            data.unshift(event);   // 修正执行参数数组
        }

        for(var i = 0; i < clone.length; i++) {
            var item = clone[i];     // 当前事件对象

            if (item.name.search(event.type) === 0 &&
                checkIn(event.target, item.select)) {

                data[0].originalType = item.name; 
                item.call.apply(ele, data);
            }

            if (event.isImmediatePropagationStopped) break;
        }
    }

    /**
     * 对指定对象绑定事件
     * @param ele       要绑定的对象
     * @param types     事件名，可为多个，支持自定义
     * @param select    过滤器参数
     * @param call      绑定的要执行的回调函数
     * @param capture   是否绑定到传播阶段
     */
    Event.bind = function (ele, types, select, call, capture) {
        var handle, events, eveName, evePre;

        if (ele.nodeType === 3 || ele.nodeType === 8 || arguments.length < 3) {
            return false;   // 参数不齐全直接退出后续执行
        }

        /* 省略过滤器的时候，自动修复参数 call */
        if (typeof select == "function") {
            capture = call;
            call    = select;
            select  = "";
        }

        if (!ele.$_uuid /* 第一次绑定时初始化对象 */) {
            ele.$_uuid = eveUUID++;
            eveData[ele.$_uuid] = {};
        }

        handle = eveData[ele.$_uuid];       // 获得事件操作句柄
        events = types.split(" ");          // 尝试分割事件列表

        for (var i = 0; i < events.length; i++) {
            eveName = events[i]; evePre = getfix(eveName);

            var handleNow = handle[evePre];

            if (!handle[evePre] /* 第一次添加 */) {
                handleNow = handle[evePre] = {
                    handle : null,          // 事件句柄
                    calls  : []             // 事件回掉数组
                };

                handleNow.handle = (function (ele, call) {
                    /* 使用事件触发方法触发绑定的函数 */
                    return function(e) {
                        triggerCall(ele, call, e);
                    }
                })(ele, handleNow.calls);

                ele.addEventListener(evePre, handleNow.handle, !!capture);
            }

            handleNow.calls.push({
                name  : eveName,                // 事件全名
                call  : call,                   // 回调事件
                select: select || ''            // 过滤器
            });
        }
    }


    /**
     * 移除对象的指定事件
     * @param ele       要操作的对象
     * @param types     要移除的事件名
     */
    Event.unbind = function (ele, types, capture) {
        var handle, events, eveName, evePre, typeRun;

        if (!ele || !ele.$_uuid || !types ||
            !(handle = eveData[ele.$_uuid])) return false;

        events = types.split(" ");

        for (var i = 0; i < events.length; i++) {
            eveName = events[i]; evePre = getfix(eveName);

            /* 如果事件不存在，直接跳过 */
            if (!handle || !handle[evePre]) continue;

            typeRun = handle[evePre].calls;

            for(var i=0; i<typeRun.length; i++) {
                if (typeRun[i].name.search(eveName) === 0) {
                    typeRun.splice(i--, 1);
                }
            }

            if (typeRun.length === 0) {
                ele.removeEventListener(evePre, handle[evePre].handle, !!capture);
                delete handle[evePre];      // 删除对应的事件
            }
        }
    }


    /**
     * 手动触发对象的指定时间
     * @param ele       要操作的对象
     * @param types     要触发的事件名
     * @param data      触发时传递的参数,可多个
     */
    Event.trigger = function (ele, types /* data... */) {
        var handle, events, eveName, evePre, creEvent, data = [];

        if (!ele || ele.nodeType === 3 || ele.nodeType === 8 || !types) {
            return false;   // 参数不正确则直接退出后续执行
        }

        events = types.split(" ");
        handle = eveData[ele.$_uuid];

        /* 创建传递的参数列表 */
        for(var i=2; i<arguments.length; i++) {
            data.push(arguments[i]);
        }


        for (var i = 0; i < events.length; i++) {
            eveName = events[i];  evePre = getfix(eveName);

            creEvent = document.createEvent('Event');
            creEvent.initEvent(evePre, true, true);
            creEvent.originalData = data;

            /* 如果当前元素绑定了句柄，且有事件空间，则手动冒泡 */
            if (handle && handle[evePre] && eveName.indexOf(".") > 0) {
                var runEle   = ele, handleNow,
                    newEvent = new EventObj(creEvent, {type: eveName});

                /* 带命名空间的事件手动执行和模拟冒泡 */
                while (runEle !== document) {
                    handleNow = eveData[runEle.$_uuid];
                    handleNow = handleNow ? handleNow[evePre] : {};
                    triggerCall(runEle, handleNow.calls, newEvent)

                    if (newEvent.isPropagationStopped) break;

                    runEle = runEle.parentNode; // 递归到父类
                }
            } else {
                ele.dispatchEvent(creEvent);
            }
        }
    }


    /**
     * 给对象绑定只执行一次的方法
     * @param ele       要绑定的对象
     * @param types     事件名，可为多个，支持自定义
     * @param call      绑定的要执行的回调函数
     * @param select    过滤器参数
     *
     */

    Event.once = function (ele, types, call, select) {
        if (!ele || !types || !call) return false;

        var key = ".once_"+(''+Math.random()).replace(/\D/g, ''),
            match = types.split(" "), ftypes ;

        /* 添加once标记后缀，用于后面自移除 */
        for(var i=0; i<match.length; i++) {
            match[i] += key;
        }

        ftypes = match.join(" ");

        Event.bind(ele, ftypes, function() {
            var argv = arguments,
                type = argv[0].originalType;

            call.apply(this, argv);
            Event.unbind(ele, type);
        }, select);
    }

    return Event;
})();