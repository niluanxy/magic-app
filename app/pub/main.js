window.EVENT = (function() {
    var eveData = [], eveUUID = 1, Event;

    Event = function () {
        this.isDefaultPrevented = false;
        this.isPropagationStopped = false;
        this.isImmediatePropagationStopped = false;
    }
    
    Event.prototype.preventDefault = function () {
        
    }

    Event.prototype.stopPropagation = function () {

    }
    
    Event.prototype.stopImmediatePropagation = function () {
        
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
        var parent, ret = false, items;

        items = ele.parentNode;
        items = items?items:document;
        items = items.querySelectAll(find);

        for(var i=0; i<items.length; i++) {
            if (items[i] === ele) {
                ret = true; break;
            }
        }

        return ret;     // 返回检测结果
    }

    /**
     * 对指定对象绑定事件
     * @param ele       要绑定的对象
     * @param types     事件名，可为多个，支持自定义
     * @param                                                                                                                                                                                                                                                                                                 call      事件回掉
     * @param capture   是否在监控状态执行
     */
    Event.bind = function (ele, types, call, capture, select) {
        var handle, events;

        if (ele.nodeType === 3 || ele.nodeType === 8 || !types || !call) {
            return false;   // 参数不齐全直接退出后续执行
        }

        if (!ele.$_uuid /* 第一次绑定时初始化对象 */) {
            ele.$_uuid = Event.uuid++;
            Event.data[ele.$_uuid] = {};
        }

        handle = Event.data[ele.$_uuid];    // 获得事件操作句柄
        events = types.split(" ");          // 尝试分割事件列表

        for (var i = 0; i < events.length; i++) {
            var name = events[i], pre = getfix(name);

            if (!handle[pre] /* 第一次添加 */) {
                handle[pre] = {
                    handle : null,          // 事件句柄
                    runs   : [],            // 事件回掉数组
                    data   : null,          // 执行时额外参数
                    ele    : ele            // 绑定的对象
                };

                handle[pre].handle = function (e) {
                    var runs = handle[pre].runs,
                        ele  = handle[pre].ele,
                        data = handle[pre].data || [],
                        stopImmed  = false, ne = function() {};

                    ne.stopImmediatePropagation = function () {
                        stopImmed = true;
                        e.stopImmediatePropagation();
                    }

                    ne.prototype = e;       // 直接调用原EVENT的大部分参数

                    ne.target = e.target;
                    ne.timeStamp = new Date().getTime();

                    data.unshift(ne);   // 构造执行参数数组

                    console.log("run first always")

                    for(var i=0; i<runs.length; i++) {
                        var item = runs[i];     // 当前事件对象

                        if (checkIn(ne.target, item.select)) {
                            item.call.apply(ne.target, data);
                        }

                        if (stopImmed) break; // 中止后续执行
                    }
                };

                ele.addEventListener(pre, handle[pre].handle, false);
            }

            handle[pre].runs.push({
                name  : getfix(name, true),     // 后缀名
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
    Event.unbind = function (ele, types) {

    }


    /**
     * 手动触发对象的指定时间
     * @param ele       要操作的对象
     * @param types     要触发的事件名
     * @param data      触发时传递的参数
     */
    Event.trigger = function (ele, types, data) {

    }


    /**
     * 给对象绑定只执行一次的方法
     * @param ele       要绑定的对象
     * @param types     要绑定的事件名
     * @param call      事件回掉
     * @param capture   是否在监控状态执行
     */
    Event.once = function (ele, types, call, capture) {

    }

    return Event;
})();

