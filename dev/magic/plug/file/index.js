/* 文件相关操作 */

module.exports = (function () {
    _file = $plug.file = {}, runtime = $plug.runtime;

    if ($plug.runtime != "cordova") {
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

        };

        _file.apkInstall = function(url, file, successCall, failCall, progressCall) {
            var transfer = new FileTransfer(),
                savepath = "file:///storage/sdcard0/Download/"+file,
                fileopen = cordova.plugins.fileOpener2,
                opentype = "application/vnd.android.package-archive";

            transfer.download(url, savepath, 
            function(entry) {
                if ($.isFun(successCall)) successCall(entry);

                fileopen.open(entry.fullPath, opentype);
            }, function(error) {
                if ($.isFun(failCall)) failCall(error);
            }, true);

            if ($.isFun(progressCall)) {
                transfer.onprogress = $.delayCall(function(progressEvent) {
                    progressCall(progressEvent);
                }, 100);
            }
        }
    }
})();