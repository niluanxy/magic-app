module.exports = (function() {
    var $$ = window.mvue, $route = $$.location,
        $config = $$.config, AUTH = {before: "", repath: false};

    /**
     * 判断页面是否不需要校验
     * @param  {[type]} nowUrl [description]
     * @param  {[type]} config [description]
     * @param  {[type]} $route [description]
     * @return {[type]}        [description]
     */
    function authPassTest(nowUrl, config, $route) {
        var authPage = config.authPage,
            passList = config.authPass, test;

        if (authPage && nowUrl) {
            authPage = $route.geturl(authPage);
            nowUrl   = $route.geturl(nowUrl);

            if (nowUrl == authPage) return true;

            if (passList && passList.length) {
                for(var i=0; i<passList.length; i++) {
                    test = $route.geturl(passList[i]);

                    if (nowUrl == test) return true;
                }
            }
        }

        return false;
    }

    $$.on("routeBefore.auth", function(lastUrl, nowUrl, match, $route) {
        var config = $config.routeOption, mnow = match[match.length-1],
            atest  = config.authCheck || 1;

        if (!authPassTest(nowUrl, config, $route)) {
            var auth, aret;   // 检测页面的Auth值，可继承父类

            for (var i=match.length-1; i>=0; i--) {
                if (match[i].item.auth !== undefined) {
                    auth = match[i].item.auth;
                    break;  // 跳出后续的检测
                }
            }

            if (auth === undefined) {
                auth = config.authBase || 1;
            }

            if ($.isFun(config.authCall)) {
                aret = config.authCall(nowUrl, auth, atest, lastUrl, $route);
            } else {
                aret = auth <= atest;
            }

            /* false 当前页面未通过验证 */
            if (aret === false) {
                AUTH.before = nowUrl;
                AUTH.repath = false;
                $route.stop();  // 阻止加载页面
            } else {
                AUTH.before = null;
            }
        }
    })

    $$.on("routeAlways.auth", function(lastUrl, nowUrl, match, $route) {
        var authPage = $route.options.authPage;

        if (AUTH.before && !AUTH.repath) {
            AUTH.repath = true;

            // 混合框架中页面内跳转
            if ($route.local) {
                $route.local(authPage, false);
            } else {
                $route.go(authPage, false);
            }
        }
    });

    /**
     * 权限校验完毕，跳回原来的页面
     */
    $$.location.authRepath = function(page, repatch) {
        var config = $config.routeOption,
            before, auth = config.authPage;

        if (page && repatch) {
            AUTH.before = page;

            // 混合框架中页面内跳转
            if ($route.local) {
                $route.local(auth, false, true);
            } else {
                $route.go(auth, false, true);
            }
        } else {
            before = AUTH.before || config.home;

            AUTH.repath = false;
            AUTH.before = ""

            // 混合框架中页面内跳转
            if ($route.local) {
                $route.local(before, true);
            } else {
                $route.go(before, true);
            }
        }
    }
})();
