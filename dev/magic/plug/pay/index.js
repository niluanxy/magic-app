/* 支付相关操作封装 */

module.exports = (function () {
    var _pay = $plug.pay = {}, runtime = $plug.runtime;

    /* 尝试调用微信支付功能 */
    _pay.weixin = runtime == "weixin" ? function (pay, successCall, failCall) {
            wx.chooseWXPay({
                timestamp: pay.timeStamp,
                nonceStr : pay.nonceStr,
                package  : pay.package,
                signType : pay.signType,
                paySign  : pay.paySign,
                success  : successCall,
                fail     : failCall
            })
        } : function () {
            $$.tip("操作失败，微信支付初始化失败！");
        };

    /* 调用支付宝进行支付 */
    _pay.alipay = function (pay, successCall, failCall) {

    }
})();
