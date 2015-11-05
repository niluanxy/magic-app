/* 摄像头相关硬件操作封装 */

module.exports = (function() {
    require("./style.css");

    var _camera = $plug.camera = {},
        $load   = $.tip("", {type: "loading"}),
        modal, rview, $html, $view;

    if ($plug.runtime == "phonegap") {
        var camera  = navigator.camera,
        destype = camera.DestinationType,
        picsouce= camera.PictureSourceType,
        platform= $plug.platform;
    }

    if ($plug.runtime != "phonegap" && $plug.runtime != "weixin") {
        _camera.take = _camera.view = _camera.upload = _camera.hide =
            function (successCall, failCall) {
                var showDefaultTip = true;

                if (typeof failCall == "function") {
                    showDefaultTip = failCall();
                }

                if (showDefaultTip) {
                    $u.tip("抱歉，当前环境不支持此操作！");
                }
            }
    } else {
        function makeViewAction(call) {
            return function(res) {
                var resfix = $plug.runtime == "weixin" ?
                                res.localIds[0] :
                                "data:image/jpeg;base64,"+res;

                rview.el.find(".upload").off("tap")
                    .on("tap", function() {
                        if (typeof call == "function") {
                            call(resfix); // 执行回调
                        }
                        // 显示loading动画
                        $load.show();
                    })
                $view.attr("src", resfix);

                /* 尝试隐藏选择框 */
                if (modal && modal.hide) modal.hide();

                rview.show();   // 设置完毕后显示预览的窗口
            }
        }

        $html = $(require("./template.html"));
        modal = $.modal($html.find(".camera_open_modal"));
        rview = $.modal($html.find(".camera_review_modal"));

        modal.el.find(".cancel").on("tap", function () {
            modal.hide();   // 隐藏弹框选择显示
        })
        $view = rview.el.find(".view");
        rview.el.find(".cancel").on("tap", function () {
            rview.hide();   // 隐藏预览窗口显示
        })

        /**
         * 隐藏预览窗口和操作窗口
         * */
        _camera.hide = function () {
            if (modal && modal.hide) modal.hide();
            if (rview && rview.hide) rview.hide();
            if ($load && $load.hide) $load.hide();
        }

        /**
         * 弹出选择框，让用户选择方式
         * */
        _camera.upload = $plug.runtime == "weixin" ?
            function (successCall, failCall) {
                var viewAction = makeViewAction(successCall);

                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: viewAction,
                    cancel: failCall,
                    fail: failCall
                });
            } :
            function (successCall, failCall) {
                modal.el.find(".openTake").off("tap")
                    .on("tap", function() {
                        _camera.take(successCall, failCall);
                    })
                modal.el.find(".openView").off("tap")
                    .on("tap", function() {
                        _camera.view(successCall, failCall);
                    })

                modal.show();   // 回调更新完毕，弹出选择菜单
            };


        /**
         * 直接调用照相方法
         * */
        _camera.take = $plug.runtime == "weixin" ? _camera.upload :
            function(successCall, failCall) {
                var viewAction = makeViewAction(successCall);

                camera.getPicture(viewAction, failCall, {
                    quality: 10,
                    allowEdit: false,
                    destinationType: destype.DATA_URL
                });
            };

        /**
         * 直接调用选择图片方法
         * */
        _camera.view = $plug.runtime == "weixin" ? _camera.upload :
            function (successCall, failCall) {
                var viewAction = makeViewAction(successCall);

                if (platform == 'android'){
                    camera.getPicture(viewAction, failCall, {
                        quality: 50,
                        destinationType: destype.DATA_URL,
                        sourceType: picsouce.SAVEDPHOTOALBUM
                    });
                } else if (platform == 'ios'){
                    camera.getPicture(viewAction, failCall, {
                        quality: 50,
                        destinationType: destype.DATA_URL,
                        sourceType: picsouce.SAVEDPHOTOALBUM
                    });
                }
            };
    }
})();