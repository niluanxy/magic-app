module.exports = (function() {
    var _file  = $$.file = {};

    _file.uploadImg = function(img, url, suc, fail) {
        var options = new FileUploadOptions();
        options.mimeType = "image/jpeg";
        options.headers  = {  Connection: "close" };
        options.params   = { file: "", path: "" };
        
        // 如果输入的文件头不正常，尝试修复
        if (img.substr(0, 10) != "data:image") {
            img = "data:image/jpeg;base64,"+img;
        }

        var ft = new FileTransfer();
        ft.upload(img, encodeURI(url), suc, fail, options);
    }
})();