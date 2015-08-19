/* 文件相关操作 */

module.exports = (function () {
    _file = $plug.file = {}, runtime = $plug.runtime;

    if ($plug.runtime != "phonegap") {
        _file.uploadImg = _file.uploadFile =
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
        _file.uploadImg = function (url, img, opt, successCall, failCall) {
            var options = new FileUploadOptions();

            options.mimeType = "image/jpeg";
            options.headers  = { Connection: "close" };
            options.params   = { file: "", path: "" };

            // 合并参数，会忽略掉无效的项目
            $.extend(options.params, opt, true);

            // 如果输入的文件头不正常，尝试修复
            if (img.substr(0, 10) != "data:image") {
                img = "data:image/jpeg;base64,"+img;
            }

            var ft = new FileTransfer();
            ft.upload(img, encodeURI(url), successCall, failCall, options);
        }

        _file.uploadFile = function () {

        }
    }
})();