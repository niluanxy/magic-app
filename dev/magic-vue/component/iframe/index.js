require("./style.scss");

module.exports = (function() {
    // 检测是否是 iFrame ，依赖于全局 runid
    window.isFrame = function(dom) {
        return dom.parent.document != dom.document;    // 不同则是 iFrame
    }

    Vue.component("mg-iframe", {
        template: "<slot></slot>",
        ready: function() {
            var $el    = $(this.$el),
                src    = $el.attr("src"),
                handle = $el.attr("handle"),
                rcall  = $el.attr("call"),
                scope, ihandle, pid, iframe, $iframe, name, pcall, load;

            if (src === undefined) return;
            scope = $$._getPage(this);
            $el.removeAttr("src");      // 移除无用src

            pid   = $.getRandom();      // 生成独立的ID
            name  = "iframe"+pid;       // 设置iframe标示
            pcall = "_parent_"+pid;     // 父类回调方法名

            $el.addClass("mg-iframe");
            $el.append("<iframe id='"+name+"' name='"+name+"'></iframe>");

            load    = $el.attr("load");
            iframe  = window.frames[name];
            $iframe = $el.find("#"+name);
            ihandle = $el.attr('iframe');

            // 给子类添加一个全局方法，用于子类通过这个触发父类回调
            if ((scope[src] || src) && src.match(/^http[s]?:\/\//) === null) {
                // 给父类添加一个回调的方法
                window[pcall] = function(data) {
                    var runcall = scope[rcall];
                    if (runcall && typeof runcall == "function") {
                        // 运行回调方法
                        runcall.call(scope, data);
                    }
                }

                $iframe.on("load", function() {
                    if (iframe.document.body.innerHTML != '') {
                        iframe.window.iframeFinsh = function(data) {
                            if (typeof window[pcall] == "function") {
                                window[pcall](data);    // iframe触发父回调
                            }
                        }
                    }
                })
            }
                
            if (scope[ihandle] !== undefined) {
                scope[ihandle] = iframe;
            }

            if (scope[src] !== undefined) {
                scope.$watch(src, function(newVal) {
                    $iframe.attr("src", newVal);
                })
            } else {
                // 如果父类无此值，直接尝试赋值
                $iframe.attr("src", src || "");
            }

            if (scope[handle] !== undefined) {
                scope[handle] = $el.modal();
                $el.addClass("modal hideOut");
                scope[handle].refresh = function() {
                    $iframe.attr("src", src);
                }
            }

            if (scope[load] !== undefined) {
                $iframe.on("load", function() {
                    scope[load]();
                })
            }
        }
    })
})();