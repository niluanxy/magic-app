;(function(root, factory) {
    if (typeof module !== 'undefined' && module.exports) {// CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {// AMD / RequireJS
        define(factory);
    } else {
        root.Promise = factory.call(root);
    }
}(this, function() {
    function isfun(call) {
        return typeof call == "function";
    }

    function Promise() {
        this.status = 'pending';

        this.args   = null;
        this.next   = null;
        this.calls  = [];
    }

    /**
     * 合并模式，必须所有的 defer 都成功才返回
     *
     * @param  {...defer}   [需要合并的 defer 对象]
     * @return {Promise}    [合并后的总 defer 对象]
     */
    Promise.all = function() {
        var sum, len, arr,
            def = new Promise();

        if (arguments[0] instanceof Array) {
            arr = arguments[0];
        } else {
            arr = arguments;
        }

        sum = len = arr.length;

        for(var i=0; i<len; i++) {
            arr[i].then(function() {
                if (--sum == 0) def.resolve.apply(def, arguments);
            }, function() {
                def.reject.apply(def, arguments);
            })
        }

        return def;     // 返回一个合并后的 defer
    }

    /**
     * 竞争模式，如果有那个 defer 先返回 resolve，则
     * 立刻返回，同时终止其他defer
     *
     * 如果所有的 defer 都返回 失败，则才最终返回一个
     * 失败的 reject
     *
     * @param  {...defer}   [竞争的 defer 列表]
     * @return {Promise}    [最终响应的 defer 对象]
     */
    Promise.when = function() {
        var arr, resolve = false, rej,
            defer = new Promise();

        if (arguments[0] instanceof Array) {
            arr = arguments[0];
        } else {
            arr = arguments;
        }

        rej = arr.length;

        for(var i=0; i<arr.length; i++) {
            arr[i].then(function() {
                if (defer.status == "pending") {
                    defer.resolve.apply(defer, arguments)
                }
            }, function error() {
                if (--rej == 0 && defer.status == "pending") {
                    defer.reject.apply(defer, arguments)
                }
            })
        }

        return defer;
    }

    /**
     * 队列模式，里面的所有的 defer 都执行完，才会返回
     * 最后的 resolve 方法
     *
     * @param  {...defer}   [竞争的 defer 列表]
     * @return {Promise}    [最终响应的 defer 对象]
     */
    function Queue() {
        this.list  = [];
        this.run   = null;
        this.pos   = 0;
        this.defer = new Promise();

        return this;
    }

    // 队列轮询执行方法
    function _queue_next() {
        var that = this;

        if (that.run == null ||
            that.run.status == "resolved") {

            var list = that.list, tmp,
                run  = list[that.pos];

            if (isfun(run) && (tmp = run()) && tmp.then) {
                that.run = tmp;

                tmp.then(function() {
                    that.pos++; // 执行成功，前进队列

                    var defer = that.defer, args = arguments;

                    if (that.pos == list.length) {
                        defer.resolve.apply(defer, args);
                    } else {
                        _queue_next.call(that);
                    }
                }, function() {
                    var defer = that.defer;

                    defer.reject.apply(defer, arguments);
                })
            }
        }
    }

    Queue.prototype.push = function(call) {
        this.list.push(call);
        _queue_next.call(this);

        return this;
    }

    Queue.prototype.then = function() {
        var defer = this.defer;

        defer.then.apply(defer, arguments);
    }

    Promise.queue = function() {
        return new Queue();
    }

    /**
     * Promise 核心方法定义
     */

    // defer 回调函数添加方法
    function _defer_add(resolve, reject, done) {
        var status = this.status, args = this.args, fin, fcall = [],
            dnext  = this.next || (this.next = new Promise());

        if ("pending" == status) {
            isfun(resolve) && this.calls .push({type: "res", call: resolve});
            isfun(reject) && this.calls .push({type: "rej", call: reject});
            isfun(done) && this.calls .push({type: "don", call: done});
        } else {
            fin = "resolved" == status ? "resolve" : "reject";

            if ("resolved" == status) {
                isfun(resolve) && fcall.push(resolve);
            } else {
                isfun(reject) && fcall.push(reject);
            }

            isfun(done) && fcall.push(done);

            for(var i=0; i<fcall.length; i++) {
                fcall[i].apply(this, args);
            }

            dnext[fin](args);
        }

        return dnext;
    }

    // defer 方法激活函数
    function _defer_fire(args) {
        var stat, ncall, calls = this.calls;

        stat = "resolved" ==  this.status ? "res" : "rej";

        for(var i=0; i<calls.length; i++) {
            var now = calls[i], type = now.type;

            if (type == stat || type == "don") {
                now.call.apply(this, args);
            }
        }

        ncall = "resolved" == this.status ? "resolve" : "reject";
        this.next && this.next[ncall](args);
    }

    Promise.prototype.then = function(resolve, reject) {
        return _defer_add.call(this, resolve, reject);
    }

    Promise.prototype.done = function(done) {
        return _defer_add.call(this, null, null, done);
    }

    Promise.prototype.resolve = function() {
        this.args   = arguments;
        this.status = "resolved";

        _defer_fire.call(this, arguments);
    }

    Promise.prototype.reject = function() {
        this.args   = arguments;
        this.status = "rejected";

        _defer_fire.call(this, arguments);
    }

    return Promise;
}));
