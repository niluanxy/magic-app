;(function(w, doc) {
    var ua              = navigator.userAgent,
        isIOSDevice     = /iP(hone|od|ad)/g.test(ua),
        isAndroidDevice = /Android/g.test(ua),

        JSBRIDGE_URL_SCHEME  = 'jsbridgeurlscheme',
        JSBRIDGE_URL_MESSAGE = '__JSB_URL_MESSAGE__',
        JSBRIDGE_URL_EVENT   = '__JSB_URL_EVENT__',
        JSBRIDGE_URL_API     = '__JSB_URL_API__',

        apiDataSave          = null,
        BIND                 = "addEventListener",
        TOUCH                = {};

    // 判断是否为 MgNative 环境，并做相关处理
    if (isIOSDevice && w.__MgNative__HASH__ !== undefined) {
        w.JSBridge = {
            version: "1.0.0",

            _getAPIData: _getAPIData.bind(this),
        }

        location.hash = w.__MgNative__HASH__ || "";
    } else if (isAndroidDevice && w.JSBridge) {
        w.JSBridge.version = "1.0.0";
    } else {
        return w.$J = undefined;     // 两个条件都判断失败，则非 MgNative 环境
    }

    function _getIFrameSrc(param) {
        return JSBRIDGE_URL_SCHEME + '://' + JSBRIDGE_URL_MESSAGE + '/'+ param;
    }

    // IOS端底层回掉方法
    function _getAPIData() {
        return JSON.stringify(apiDataSave);
    }

    function fixCallReturn(ret) {
        if (!ret) return undefined;

        ret = ret.replace(/(\'_\#b_|_b\#_\'|\'_\#i_|_i\#_\'|\'_\#o_|_o\#_\')/g, '');

        if (isIOSDevice) {
            ret = ret.replace(/\'/g, '"');
            ret = ret.replace(/\"\{/g, '{');
            ret = ret.replace(/\}\"/g, '}');
        }
        
        ret = ret.replace(/\,\"data\"\:undefined/, '');
    
        return JSON.parse(ret).data;
    }

    function iosCallAPI(name, data) {
        var iframe  = doc.createElement("IFRAME"), ret;
        
        apiDataSave = {api: name};
        if(data) apiDataSave["data"] = data;

        iframe.setAttribute("src", _getIFrameSrc(JSBRIDGE_URL_API));
        doc.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;

        ret = JSBridge.nativeReturnValue;
        JSBridge.nativeReturnValue = undefined;
        if(ret) return decodeURIComponent(ret);
    }

    function callAPI(name, data) {
        data = data !== undefined ? data : {};

        try {
            if(data) {
                for(var key in data) {
                    var obj = data[key],
                        opt = typeof obj;

                    switch(opt) {
                        case "number":
                            data[key] = '_#i_'+obj+'_i#_';
                            break;
                        case "boolean":
                            data[key] = '_#b_'+obj+'_b#_';
                            break;
                        case "undefined":
                            data[key] = '_#o_'+obj+'_o#_';
                            break;
                        default: 
                            if (obj == null) {
                                data[key] = '_#o_'+obj+'_o#_';
                            }
                    }
                }

                try{data = JSON.stringify(data);}catch(e){}
            }

            if(isIOSDevice) {
                if(data) name += ":";
                var ret = iosCallAPI(name,data);

                return fixCallReturn(ret);
            } else if (isAndroidDevice) {
                var ret = JSBridge.call(name,data);

                return fixCallReturn(ret);
            }
        } catch(e) {
            if (typeof console != 'undefined') {
                console.error(e,"Invalid API:"+name);
            }
        }
    }

    // 检测是否包含跳转链接
    function checkHref(e) {
        var target = e.target, tag, href;

        while(target && target.tagName) {
            tag  = target.tagName.toUpperCase();
            href = target.getAttribute("href");

            if (tag == "A" && href)  {
                return target;
            }

            target = target.parentNode;
        };

        return false;
    }

    // 修复HTML跳转URL格式
    function fixUrl(url) {
        return url.replace(/^\#/g, '');
    }

    if (w.JSBridge) {
        // 拦截浏览器默认跳转动作
        doc[BIND]("touchstart", function(e) {
            var touchs = e.changedTouches;
            if (touchs && touchs.length > 1 || !checkHref(e)) {
                TOUCH.startTime = null;
                TOUCH.block     = false;
            } else {
                TOUCH.block     = true;
                TOUCH.startTime = (new Date).getTime();
            }
        }, true);

        doc[BIND]("click", function(e) {
            var item = checkHref(e), href,
                now  = (new Date).getTime();

            if (item && TOUCH.block && (now - TOUCH.startTime < 400)) {
                e.preventDefault();
                href = item.getAttribute("href");
                
                TOUCH.block = false;

                // URL不同时跳转到新页面
                if (href !== location.hash) {
                    $J.router.go(fixUrl(href)); 
                }
            }
        }, true);

        w.$J = {
            version  : JSBridge.version,
            platform : isIOSDevice ? "IOS" : "ANDROID",

            call : callAPI,

            router : {
                back : function() {
                    callAPI("Router.back");
                },

                go : function(url, params) {
                    callAPI("Router.go", obj = {
                        target: "html://"+fixUrl(url),
                        params: params || ""
                    });
                },

                goNative : function(url, params) {
                    callAPI("Router.go", {
                        target: "native://"+url,
                        params: params || ""
                    });
                },

                replace : function(url, params) {
                    callAPI("Router.replace", {
                        target: "html://"+fixUrl(url),
                        params: params || ""
                    })
                },

                replaceNative: function(url, params) {
                    callAPI("Router.replace", {
                        target: "native://"+url,
                        params: params || ""
                    })
                },
            },

            loginRepath: function(url, params) {
                callAPI("Router.loginRepath", {
                    target: "html://"+fixUrl(url),
                    params: params || ""
                })
            },

            loginRepathNative: function(url, params) {
                callAPI("Router.loginRepath", {
                    target: "native://"+url,
                    params: params || ""
                })
            },
        }
    }
})(window, document);