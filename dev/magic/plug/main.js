/* 硬件调用分装方法 */

(function() {
    // 加载相关方法文件
    function loadRequire(call) {
        return function () {
            require("./camera");        // 图像操作
            require("./pay");           // 支付操作
            require("./file");          // 文件操作

            if (typeof call == "function") call();
        }
    }

    var $m = window.$plug = {
        runtime  : "web",
        platform : "",
        osversion: ""
    };

    /* 初始化运行环境等信息 */
    if (window.cordova /* cordova环境 */) {
        $m.platform  = cordova.platformId;
        $m.osversion = cordova.platformVersion;
        $m.runtime   = "phonegap";
    } else {
        var agent = window.navigator.userAgent.toLowerCase(), osver;
        if (agent.match(/MicroMessenger/i) /* 微信环境 */) {
            $m.runtime = "weixin";
        }

        if (agent.match(/IPhone/i)) {
            $m.platform = "ios";
            osver = agent.match(/cpu iphone os \S*/i)[0];
            osver = osver.replace(/cpu iphone os /i, "");
            $m.osversion = osver.replace("_", ".");
        } else if (agent.match(/Android/i)) {
            $m.platform = "android";
            osver = agent.match(/android \S*(?=;)/i)[0];
            $m.osversion = osver.replace(/android /i, "");
        }
    }

    /* 组件初始化方法 */
    $m.init = function(weixin, call) {
        if ($m.runtime == "weixin" && weixin) {
            var url = location.href.split('#')[0];
            $.jsonp(weixin, {url:url}).then(function(rdata) {
                wx.config({
                    debug: false,
                    appId: rdata.appId,
                    timestamp: rdata.timestamp,
                    nonceStr: rdata.nonceStr,
                    signature: rdata.signature,
                    jsApiList:  [
                        "onMenuShareTimeline",
                        "onMenuShareAppMessage",
                        "onMenuShareQQ",
                        "onMenuShareWeibo",
                        "onMenuShareQZone",
                        "startRecord",
                        "stopRecord",
                        "onVoiceRecordEnd",
                        "playVoice",
                        "pauseVoice",
                        "stopVoice",
                        "onVoicePlayEnd",
                        "uploadVoice",
                        "downloadVoice",
                        "chooseImage",
                        "previewImage",
                        "uploadImage",
                        "downloadImage",
                        "translateVoice",
                        "getNetworkType",
                        "openLocation",
                        "getLocation",
                        "hideOptionMenu",
                        "showOptionMenu",
                        "hideMenuItems",
                        "showMenuItems",
                        "hideAllNonBaseMenuItem",
                        "showAllNonBaseMenuItem",
                        "closeWindow",
                        "scanQRCode",
                        "chooseWXPay",
                        "openProductSpecificView",
                        "addCard",
                        "chooseCard",
                        "openCard"
                    ]
                });

                wx.error(function (res) {
                    $u.tip("初始化失败，"+res.errMsg, { show: 3000 });
                    $m.runtime = "web"; loadRequire(call)();
                })
            })
        }

        /* 初始化加载相关具体方法和执行回调 */
        if ($m.runtime == "phonegap") {
            $(document).on("deviceready", loadRequire(call));
        } else if ($m.runtime == "weixin" && weixin) {
            wx.ready(loadRequire(call));
        } else {
            loadRequire(call)();    // 直接加载相关文件
        }

        return this;
    }
})();
