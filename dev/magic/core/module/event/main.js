module.exports = (function() {
    var event = {}, _EVENT = require("event");

    /* 对象事件操作的简单方法 */
    event.on = function(type, select, fn, capture) {
        if (this[0] /* 有对象才绑定 */) {
            _EVENT.bind(this[0], type, select, fn, capture);
        }

        return this;
    };

    event.off = function(type, fn, capture) {
        if (this[0] /* 有对象才绑定 */) {
            _EVENT.unbind(this[0], type, fn, capture);
        }

        return this;
    };

    event.once = function(type, select, fn, capture) {
        if (this[0] /* 有对象才绑定 */) {
            _EVENT.once(this[0], type, select, fn, capture);
        }

        return this;
    };

    event.trigger = function(type /* data... */) {
        if (this[0] /* 有对象才绑定 */) {
            var argv = [this[0]]; // 修复参数列表
            for(var i=0; i<arguments.length; i++) {
                argv.push(arguments[i]);
            }

            _EVENT.trigger.apply(null, argv);
        }

        return this;
    };

    Magic.fn.extend(event);
})();
