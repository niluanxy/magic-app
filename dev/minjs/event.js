module.exports = (function() {
    var Event = {}, events = [], uuid = 1;

    /**
     * 对指定对象绑定事件
     * @param ele       要绑定的对象
     * @param types     事件名，可为多个，支持自定义
     * @param call      事件回掉
     * @param capture   是否在监控状态执行
     */
    Event.on = function (ele, types, call, capture) {
        var handle, events;

        if (ele.nodeType === 3 || ele.nodeType === 8 || !types || !call) {
            return false;   // 参数不齐全直接退出后续执行
        }

        if (!ele.$_event /* 第一次绑定时初始化对象 */) {
            ele.$_event = {
                data: null,     /* 存放方法执行时传的参数 */
                event: {}
            }
        }

        handle = ele.$_event.event;       // 获得事件操作句柄
        events = types.split(" ");  // 尝试分割事件列表

        for (var i = 0; i < events.length; i++) {
            var name = events[i];

            if (!handle[name] /* 第一次添加 */) {
                handle[name] = [];
            }

            handle[name].push(call);
        }
    }


    /**
     * 移除对象的指定事件
     * @param ele       要操作的对象
     * @param types     要移除的事件名
     */
    Event.off = function (ele, types) {

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

