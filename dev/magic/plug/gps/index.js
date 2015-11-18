/* GPS相关操作 */

module.exports = (function () {
    var _gps = $plug.gps = {}, runtime = $plug.runtime, locat;

    if (navigator.geolocation) {
        locat = navigator.geolocation;

        _gps.getPosition = function(success, error) {
            locat.getCurrentPosition(function(position) {
                var coords = position.coords || {}, ret = {};

                ret.latitude  = coords.latitude;    // 纬度
                ret.longitude = coords.longitude;   // 经度
                ret.altitude  = coords.altitude;    // 海拔，可能空
                ret.accuracy  = coords.accuracy;    // 精确度
                ret.timeStamp = position.timestamp

                if ($.isFun(success)) {
                    success(ret);   // 执行代码回掉
                }
            }, error, {
                // 指示浏览器获取高精度的位置，默认为false
                enableHighAcuracy: true,
                // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                timeout: 3000,
                // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                maximumAge: 1000
            });
        }

        _gps.getPosition(); // 初始化获取GPS一次，保证以后调用的时候可以很快
    } else {
        _gps.getPosition = function(success, error) {
            $$.error("当前环境无法获取GPS信息！");
            if ($.isFun(error)) {
                error({code: -1, tip: "当前环境无法获取GPS信息！"});
            }
        }
    }
})();