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
        this.value  = null;

        this._resolves = [];
        this._rejects  = [];
    }


    Promise.all = function(arr) {
        var sum = len = arr.length,
            def = new Promise();

        for(var i=0; i<len; i++) {
            arr[i].then(function() {
                if (--sum == 0) def.resolve();
            })
        }

        return def;     // 返回一个合并后的 defer
    }


    Promise.prototype.then = function(resolve, reject) {
        var status = this.status, value = this.value,
            next   = this._next || (this._next = new Promise());

        if ("pending" == status) {
            isfun(resolve) && this._resolves.push(resolve);
            isfun(reject) && this._rejects.push(reject);

            return next;
        }

        if ("resolved" == status) {
            if (isfun(resolve)) {
                resolve.apply(this, this.value);
            }

            next.resolve(value);

            return next;
        }

        if ("rejected" == status) {
            if (isfun(reject)) {
                reject.apply(this, this.value);
            }

            next.reject(value);

            return next;
        }
    }


    Promise.prototype.resolve = function(args) {
        this.value = arguments;
        this.status = "resolved";

        this._fire(arguments);
    }


    Promise.prototype.reject = function(args) {
        this.value = arguments;
        this.status = "rejected";

        this._fire(arguments);
    }


    Promise.prototype._fire = function(value) {
        var status = this.status, calls, ncall;

        calls = "resolved" == status ? this._resolves : this._rejects;

        for(var i=0; i<calls.length; i++) {
            if (isfun(calls[i])) {
                calls[i].apply(this, value);
            }
        }

        ncall = "resolved" == status ? "resolve" : "reject";
        this._next && this._next[ncall](value);
    }

    return Promise;
}));