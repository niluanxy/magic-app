/* GPS相关操作 */

module.exports = (function () {
    var $m = $plug, _gps = $m.gps = {mode: "INIT"}, _CITY,
        locat, Geolocation, defer = $.defer(), PlaceSearch,
        CitySearch, Mbind;

    /* 如果有高德的API，直接调用高德的API来获取GPS */
    if ($m.config.amap) {
        /* 插件初始化好以后返回回掉 */
        $.checkRun("AMap", function() {
            if (window.AMap && window.AMap.plugin) {
                AMap.plugin("AMap.Geolocation", function() {
                    Geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,   // 是否使用高精度定位
                        timeout: 2000,              // 超过2秒后停止定位
                        maximumAge: 0,              // 定位结果缓存0毫秒
                    });
                });

                AMap.plugin("AMap.PlaceSearch", function() {
                    PlaceSearch = new AMap.PlaceSearch({
                        extensions: "all",          // 返回详细信息
                    })
                })

                AMap.plugin("AMap.CitySearch", function() {
                    CitySearch = new AMap.CitySearch();
                })
            }

            defer.done();
        }, window, 5000);
    } else {
        defer.done();
    }

    /**======================================================
     * 初始化失败错误提示
     =======================================================*/
    function errorCall() {
        var call, argv = arguments;

        for(var i=0; i<argv.length; i++) {
            if ($.isFun(argv[i])) {
                argv[i]({code: -1, message: "当前服务不可用"});
                return;
            }
        }
    }


    /**======================================================
     * 获取当前GPS信息
     =======================================================*/
    _gps.getPosition = $.callDefer("getPosition", _gps, defer, 
    function(success, error) {
        function posErrorCall(rdata, type, errCall) {
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

            Mbind = AMap.event.addListenerOnce;

            _gps.getPosition = function(success, error) {
                Mbind(Geolocation, 'complete', function(position) {
                    var coords = position.position || {}, ret = {};

                    ret.latitude  = coords.lat;             // 纬度
                    ret.longitude = coords.lng;             // 经度
                    ret.accuracy  = position.accuracy;      // 精确度

                    if ($.isFun(success)) success(ret);
                });

                Mbind(Geolocation, 'error', function(rdata) {
                    posErrorCall(rdata, "AMAP", error);
                });

                Geolocation.getCurrentPosition();
            }

            _gps.mode = "AMAP";     // 设置当前模式
        } else if (navigator.geolocation) {
            /* 尝试调用原生的定位函数 */

            var locat = navigator.geolocation;

            _gps.getPosition = function(success, error) {
                locat.getCurrentPosition(function(position) {
                    var coords = position.coords || {}, ret = {}, len = 6;

                    ret.latitude  = coords.latitude;    // 纬度
                    ret.longitude = coords.longitude;   // 经度
                    ret.accuracy  = coords.accuracy;    // 精确度

                    if ($.isFun(success)) success(ret);   // 执行代码回掉
                }, function(rdata) {
                    posErrorCall(rdata, "HTML5", error);
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
    }); _gps.getPosition();     // 初始化执行一次，加快后续执行

    

    /**======================================================
     * 创建地图组件，拖放选点等
     =======================================================*/
    _gps.createMap = $.callDefer("createMap", _gps, defer,
    function(dom, option) {
        if (AMap && AMap.Map) {
            _gps.createMap = function(dom, option) {
                var $el = $(dom), key = "_amap_" + $.getTime(), map;

                if ($el.length <= 0) {
                    return {code: -2, message: "绑定DOM对象失败"};
                } else {
                    $el.addClass("amap").attr("id", key)

                    map = new AMap.Map(key, {
                        resizeEnable: true,
                        zoom:11,
                    });

                    return map;
                }
            }
        } else {
            _gps.createMap = function(dom, option) {
                return {code: -1, message: "当前环境无法创建地图组件"};
            }
        }

        return _gps.createMap(dom, option);   // 修复调用
    });



    /**======================================================
     * 地址与坐标相互转换方法
     * 底层调用高德地图API
     =======================================================*/
    var getGeocoder = (function() {
        var Geocoder = null;

        return function(call) {
            if (Geocoder) {
                call(Geocoder);
            } else {
                AMap.service(['AMap.Geocoder'], function() {
                    Geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    })

                    call(Geocoder);
                });
            }
        }
    })();

    _gps.getCity = $.callDefer("getCity", _gps, defer,
    function(call) {
        if (AMap && AMap.Map && CitySearch) {
            _gps.getCity = function(call) {
                CitySearch.getLocalCity(function(status, result) {
                    var ret = {code: 1, message: "服务调用成功", result: null};

                    if (status == "error") {
                        ret.code = -1;
                        ret.message = result;
                    } else {
                        ret.result = {
                            city  : result.city,
                            bounds: result.bounds 
                        };
                    }

                    if ($.isFun(call)) call(ret);
                });
            }
        } else {
            _gps.getCity = errorCall;
        }

        return _gps.getCity(call);
    })

    _gps.searchPlace = $.callDefer("searchPlace", _gps, defer,
    function(str, city, call) {
        if (AMap && AMap.Map && PlaceSearch) {
            _gps.searchPlace = function(str, city, call) {
                var defer = $.defer(), now, ret, hascity = false;

                if ($.isFun(city)) {
                    call = city;
                } else {
                    hascity = true;
                }

                if (!hascity && !_CITY) {
                    _gps.getCity(function(ret) {
                        if (ret.code > 0) {
                            _CITY = ret.result.city;
                            defer.resolve(_CITY);
                        } else {
                            defer.resolve("中国");
                        }                        
                    })
                } else {
                    defer.resolve(hascity ? city : _CITY);
                }

                defer.then(function(city) {
                    PlaceSearch.setCity(city);
                    PlaceSearch.search(str, function(status, result) {
                        var ret = {code: 1, message: "服务调用成功", result: null};

                        if (status == "error") {
                            ret.code = -1;
                            ret.message = result;
                        } else {
                            ret.result = result.poiList;
                        }

                        if ($.isFun(call)) call(ret);
                    })
                })
            }
        } else {
            _gps.searchPlace = errorCall;
        }

        return _gps.searchPlace(str, city, call);
    })

    // 坐标转地址
    _gps.getAddress = $.callDefer("getAddress", _gps, defer,
    function(lng, lat, call) {
        if (AMap && AMap.Map) {
            _gps.getAddress = function(lng, lat, call) {
                getGeocoder(function(geo) {
                    geo.getAddress(new AMap.LngLat(lng, lat),
                    function(status, result) {
                        var ret = {code: 1, message: ""};

                        if (status == 'error') {
                            ret.code    = -1;
                            ret.message = "服务调用失败";
                        } else {
                            ret.code    = 1;
                            ret.message = "服务调用成功";
                            ret.result  = result.regeocode;
                        }

                        if ($.isFun(call)) call(ret);
                    });
                })
            }
        } else {
            _gps.getAddress = errorCall;
        }

        return _gps.getAddress(lng, lat, call);   // 修复调用
    });

    // 地址转坐标
    _gps.getLocation = $.callDefer("getLocation", _gps, defer,
    function(address, call) {
        if (AMap && AMap.Map) {
            _gps.getLocation = function(address, call) {
                getGeocoder(function(geo) {
                    geo.getLocation(address, function(status, result) {
                        var ret = {code: 1, message: ""};

                        if (status == 'error') {
                            ret.code    = -1;
                            ret.message = "服务调用失败";
                        } else {
                            ret.code    = 1;
                            ret.message = "服务调用成功";
                            ret.result  = result.geocodes || [];
                        }

                        if ($.isFun(call)) call(ret);
                    });
                })
            }
        } else {
            _gps.getLocation = errorCall;
        }

        return _gps.getLocation(address, call);   // 修复调用
    })
})();