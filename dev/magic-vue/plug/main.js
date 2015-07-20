/* 硬件调用分装方法 */

// 加载相关方法文件
function loadRequire() {
    require("./file");          // 文件操作
    require("./camera");        // 图像操作
}

if (window.cordova /* cordova环境 */) {
    $$.plug = {
        platform : cordova.platformId,
        osversion: cordova.platformVersion
    }
    $(document).on("deviceready", loadRequire);
}
