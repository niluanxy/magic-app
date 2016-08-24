module.exports = (function(win, doc) {
    var $$ = win.mvue, _CACHE = $$._CACHE_;

    /**
     * 根据传入的页面名字，返回页面组件别名
     */
    function _makeViewName(name, tag) {
        var ret = "ma-"+name;

        ret = ret.replace(/[\-|\\|\/]/g, "-");

        return tag ? "<"+ret+"></"+ret+">" : ret;
    }

    /**
     * 参数值修正，转换000为空
     */
    function _transParams(params) {
        for (var key in params) {
            if (params[key] == "000") {
                params[key] = "";
            }
        }

        return params;
    }

    /**
     * 如果页面没有 resolve 方法，初始化操作
     */
    function pageDefaultInit(_params) {
        /* 修复当前实例的 $parent 实例链 */
        var $par = this.$el.parentNode, fsope;
        do {
            if ($par.MG_VUE_CTRL) {
                fsope = $par.MG_VUE_CTRL;
                break;
            }

            $par = $par.parentNode;
        } while ($par && $par != doc.body);
        fsope = fsope ? fsope : undefined;
        this.$parent = fsope;

        this.$set('params', _params || {});

        this.$emit("mgViewShow");
        this.$broadcast("mgViewShow");
    }

    /**
     * 如果页面有 resolve 方法，初始化操作
     */
    function pageResolveInit(init, _params) {
        var that = this, _defer = $.defer();

        // 注册 数据更新事件，用于手动触发刷新动作
        that.$on("__refreshData", function(params, defer) {
            var initDefer = _defer;

            // 创建后续的数据刷新回调动作
            if (initDefer.status == "resolved") {
                initDefer = $.defer();
                initDefer.then(function(initData) {
                    that.$emit("__updateData", initData);

                    if (defer && defer.resolve) {
                        defer.resolve(initData);
                    }
                })
            }

            init.call(that, params || _params, initDefer);
        })

        // 注册 数据接受事件，用于手动初始化数据
        that.$on("__updateData", function(initData) {
            if (typeof initData == "object") {
                for(var key in initData) {
                    that.$set(key, initData[key]);
                }
            }
        });

        that.$emit("__refreshData");  // 手动触发一下更新

        // 通过前面注册的事件，将数据更新到对象实例上
        _defer.then(function(initData) {
            that.$emit("__updateData", initData);
        });

        pageDefaultInit.call(that, _params);

        // 绑定数据更新快捷方法
        that.$refresh = function(params, defer) {
            that.$emit("__refreshData", params, defer);
        }
    }

    /**
     * 包装页面对象，添加底层共用的方法，同时执行相关的操作
     *
     * ============================================================
     * 比较重要的几个操作说明：
     *
     * compiled: 页面在此事件中，会尝试插入 页面实例 到容器对像中去，同
     * 时会给 容器对象 添加 MG_CHILDREN 对象，指向的是 页面实例。页面自
     * 身的容器上会添加 MG_PAGE 对象，保存的是页面创建的信息，比如创建时
     * 的 参数、所在容器 等。
     *
     * ready: 页面在此事件中，会触发一个 mgViewShow 的事件，通知页面中
     * 的组件进行渲染，或者重新启动相关UI事件和监听。
     *
     * beforeDestroy: 页面在此事件中，会触发一个 mgViewDestroy 事件，
     * 通知页面的UI组件进行资源释放等操作。
     */
    function commonView(page) {
        var old = page.data, mixins;

        // 采用新的方式，组件的 data 必须为函数
        if (!$.isFun(old)) {
            page.data = function() {
                return $.extend(true, {params: {}}, old);
            }
        }

        page.replace = true;
        page.inherit = true;

        // 底层页面初始化等相关的方法
        mixins = {
            compiled: function() {
                var $parent = this.$parent, mgpage, $wrap;

                // 如果是采用容器插入渲染，执行相关的初始化操作
                if ($parent && $parent.$options.name == "mgRender") {
                    mgpage = $parent.MG_PAGE;
                    $wrap  = mgpage.wrapper;

                    if (this.$el.nodeType === 3) {
                        this.$el = this.$el.nextElementSibling;
                        this._isFragment = false;
                    }

                    this.$appendTo($wrap[0]);

                    $wrap[0].MG_CHILDREN = this;
                    mgpage.mgwrap = this.$parent;
                } else {
                    $wrap = $(this.$el);

                    mgpage = {params: null, wrapper: null};
                    mgpage.wrapper = $wrap;
                    mgpage.params  = {};
                }

                // 给包含容器添加私有的样式类
                if (page && page.style && page.style.page) {
                    mgpage.wrapper.addClass(page.style.page);
                }

                // 绑定对象句柄到 DOM 上
                this.MG_PAGE = mgpage;
                this.$el.MG_VUE_CTRL = this;
            },

            ready: function() {
                var mgpage = this.MG_PAGE,
                    $wrap  = mgpage.wrapper,
                    params = _transParams(mgpage.params);

                if ($.isFun(page.resolve)) {
                    pageResolveInit.call(this, page.resolve, params);
                } else {
                    pageDefaultInit.call(this, params);
                }

                // 尝试通知父渲染容器，当前元素已经渲染完成
                mgpage.mgwrap && mgpage.mgwrap.$emit("mgViewRender", this);
                $$.emit("viewReady", $wrap, this);

                // 如果是混合框架中，通知页面加载完成
                if ($$.emitViewReady) $$.emitViewReady();
            },

            beforeDestroy: function() {
                var $wrap = this.MG_PAGE.wrapper;

                $$.emit("viewDestroy", $wrap, this);
                this.$emit("mgViewDestroy");
            },
        }

        // 添加底层方法到每个具体的page对象上
        if (typeof page.mixins == "array") {
            page.mixins.push(mixins);
        } else {
            page.mixins = [mixins];
        }

        return page;    // 返回修改后的page对象
    }

    /*==========================================================
     * 全局对象暴漏方法，主要是 initView 和 loadView 两个方法
     *==========================================================*/

    $$.renderView = function(view, $wrap, paras) {
        if (!view.match(/^ma-/)) view = _makeViewName(view);

        var tmp = '<'+view+'></'+view+'>', ret;

        ret = new Vue({ template: tmp, name: "mgRender" });

        $wrap[0].MG_PAGE = ret.MG_PAGE = {
            params : paras,
            wrapper: $wrap
        };
        $wrap[0].MG_WRAP = ret;

        return ret.$mount();
    }

    /**
     * 异步组件加载方法，根据 Vue 和 Webpack 的要求
     * 结合两者，具体原理链接如下：
     *
     * http://cn.vuejs.org/guide/components.html#异步组件
     */
    $$.initView = function(resolve) {
        return function(page) {
            // 实例初始化页面组件对象
            resolve(commonView(page));
        }
    }

    /**
     * 页面路由包装方法，转换同步和异步组件逻辑一致，同时
     * 将要渲染的页面直接插入到 MG-VIEW 中
     */
    $$.loadView = function(name, initFix) {
        var cname = _makeViewName(name);

        /**
         * 如果为一个对象，说明为同步加载页面，则先
         * 转换为函数，保证同步和异步加载逻辑一致
         */
        if (typeof initFix == "object") {
            initFix = commonView(initFix);
        }

        $$.component(cname, initFix);

        /**
         * 返回新的一个方法，同时触发 routerOn 事件
         */
        return function(params, lastMatch, nowMatch, $route) {
            var $wrapper, $cache = $$._CACHE_, find = -1,
                $show, $wshow, $hide, $whide, last = -1,
                mitem, offset, eve = $route.evetype;

            if (lastMatch.match) {
                lastMatch = lastMatch.match;
                lastMatch = lastMatch[lastMatch.length-1].item;
            }

            // 尝试获取缓存的 要插入 的页面对象
            mitem = nowMatch[nowMatch.length-1].item;
            for(var i=0; i<$cache.length; i++) {
                if ($cache[i].item == mitem) {
                    find = i;
                }

                if ($cache[i].item == lastMatch) {
                    last = i;
                }
            }

            if (find !== -1) {
                $wshow = $cache[find].$wrap;
                $show  = $wshow[0].MG_CHILDREN;
            } else {
                $wrapper = $('<div class="wrapper"></div>');
                $wrapper.appendTo($("mg-view"));
                $wshow = $wrapper;

                /* 新插入的无实例，无缓存，需修改缓存 */
                var addCache = { item: mitem, $wrap: $wshow };

                if (eve == "pushstate") {
                    var end = $cache.push(addCache), del;

                    if (last !== -1) {
                        for(var i=last+1; i<end-1; i++) {
                            var _item = $cache[i],
                                _wrap = _item.$wrap[0];

                            _wrap.MG_WRAP.$destroy(true);
                            _item.$wrap.remove();
                        }
                        $cache.splice(last+1, end-last-2);
                    }

                    // 剪头剪尾操作，保证数组长度
                    if ($cache.length > 2) {
                        del = $cache.shift().$wrap;
                        del[0].MG_WRAP.$destroy(true);
                        del.remove();
                        last -= 1;  // 修正旧元素坐标
                    };
                } else {
                    $cache.unshift(addCache);
                    $cache.splice(1, last);

                    // 剪头剪尾操作，保证数组长度
                    if ($cache.length > 2) {
                        del = $cache.pop().$wrap;
                        del[0].MG_WRAP.$destroy(true);
                        del.remove();
                        last += 1; // 修正旧元素坐标
                    };
                }
            }

            // 尝试获取缓存的 要隐藏 的页面对象
            $hide  = $cache[last];
            $whide = $hide ? $hide.$wrap : null;

            // 如果已经有插入的实例对象，则为缓存，手动调用相关方法
            if ($show && $show.$emit) {
                if ($$.refreshView) {
                    var fixpara = _transParams(params);
                    $show.$set("params", fixpara);
                    $show.$refresh && $show.$refresh(fixpara);
                    $show.$emit("hook:ready");
                }

                $show.$emit("mgViewShow");
                $show.$broadcast("mgViewShow");
            
                // 如果是混合框架中，通知页面加载完成
                if ($$.emitViewReady) {
                    $whide && $whide.addClass("hide");

                    // 路由变化后才发出页面加载完成通知
                    $$.once("routeAlways", function() {
                        $$.emitViewReady();
                    })
                }
            }

            // 混合框架中，通知页面已运行，不是缓存
            if ($$.ncore && $$.ncore.pageCacheRun) {
                $$.ncore.pageCacheRun = false;
            }

            // 必选先执行 routeOn 回调，保证 loader 插入到页面中
            $$.emit("routeOn", $wshow, $whide, nowMatch, $route);

            // 创建要插入的新对象，并直接渲染
            if (!$show) $$.renderView(cname, $wshow, params);
        }
    }

    $$.on("routeOn.page", function($wshow, $whide) {
        // 切换进入和退出页面的显示状态
        $.rafCall(function() {
            $whide && $whide.addClass("hide");
            $wshow.removeClass("hide");
        }); 
    });
})(window, document);
