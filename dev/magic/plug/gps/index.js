/* GPS相关操作 */

module.exports = (function () {
    var $m = $plug, _gps = $m.gps = {mode: "INIT"},
        locat, Geolocation;

    /* 如果有高德的API，直接调用高德的API来获取GPS */
    if ($m.config.amap) {
        var script = $(document.createElement("script")), src;

        src  = 'http://webapi.amap.com/maps?v=1.3&key=';
        src += $m.config.amap;

        script.attr("src", src);
        script.appendTo("body");

        /* 确定SCRIPT加载后才执行 */
        script.on("load", function() {
            AMap.plugin('AMap.Geolocation', function() {
                Geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,   //是否使用高精度定位，默认:true
                    timeout: 3000,              //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,              //定位结果缓存0毫秒，默认：0
                    convert: true,              //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                });
            });
        })
    }

    /* 获取定位信息方法 */
    _gps.getPosition = function(success, error) {
        function errorCall(rdata, type, errCall) {
            var ret = {code: 0, message: ""};

            if (type == "AMAP") {
                switch(rdata.info) {
                    case 'PERMISSION_DENIED':
                        rdata.code  = 1; break;
                    case 'POSITION_UNAVAILBLE':
                        rdata.code  = 2; break;
                    case 'TIMEOUT':
                        rdata.code  = 3; break;
                    default:
                        rdata.code  = 0;
                }
            }

            switch(rdata.code) {
                case 1:
                    ret.message = "没有获取GPS信息权限";
                    break;
                case 2:
                    ret.message = "无法获得当前位置";
                    break;
                case 3:
                    ret.message = "定位超时";
                    break;
                default:
                    ret.message = "未知错误";
            }

            ret.code = rdata.code;

            if ($.isFun(errCall)) errCall(ret);
        }

        if (Geolocation && AMap && AMap.event) {
            /* 尝试调用高德的定位函数 */

            var monce = AMap.event.addListenerOnce;

            _gps.getPosition = function(success, error) {
                monce(Geolocation, 'complete', function(position) {
                    var coords = position.position || {}, ret = {};

                    ret.latitude  = coords.lat;             // 纬度
                    ret.longitude = coords.lng;             // 经度
                    ret.accuracy  = position.accuracy;      // 精确度

                    if ($.isFun(success)) success(ret);
                });

                monce(Geolocation, 'error', function(rdata) {
                    errorCall(rdata, "AMAP", error);
                });

                Geolocation.getCurrentPosition();
            }

            _gps.mode = "AMAP";     // 设置当前模式
        } else if (navigator.geolocation) {
            /* 尝试调用原生的定位函数 */

            var locat = navigator.geolocation;

            _gps.getPosition = function(success, error) {
                locat.getCurrentPosition(function(position) {
                    var coords = position.coords || {}, ret = {};

                    ret.latitude  = coords.latitude;    // 纬度
                    ret.longitude = coords.longitude;   // 经度
                    ret.accuracy  = coords.accuracy;    // 精确度

                    /* 修复数据格式长度 */
                    ret.latitude  = parseFloat(ret.latitude.toFixed(5));
                    ret.longitude = parseFloat(ret.longitude.toFixed(5));

                    if ($.isFun(success)) success(ret);   // 执行代码回掉
                }, function(rdata) {
                    errorCall(rdata, "HTML5", error);
                }, {
                    // 指示浏览器获取高精度的位置，默认为false
                    enableHighAcuracy: true,
                    // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                    timeout: 3000,
                    // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                    maximumAge: 1000
                });
            }

            _gps.mode = "HTML5";     // 设置当前模式
        } else {
            _gps.getPosition = function(success, error) {
                if ($.isFun(error)) {
                    error({code: -1, message: "当前环境无法获取GPS信息"});
                }
            }

            _gps.mode = "NULL";     // 设置当前模式
        }

        return _gps.getPosition(success, error);   // 修复调用
    }
})();