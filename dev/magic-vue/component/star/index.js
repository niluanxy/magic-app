require("./style.scss");

module.exports = (function() {
    /* star 星级组件 */
    $$.component("mg-star", {
        template: "<slot></slot>",
        ready: function() {
            var $el = $(this.$el), val, full, half,
                blank, tfull, thalf, tblank, html = "";
                
            tfull  = "<i class='ion-android-star'></i>";
            thalf  = "<i class='ion-android-star-half'></i>";
            tblank = "<i class='ion-android-star-outline'></i>"
            val = $el.attr("val");
            val = isNaN(val) ? 0 : parseFloat(val);

            full  = parseInt(val);
            half  = parseInt((val-full)/0.5);
            blank = (5 - parseInt(val+0.5));

            for(var i=0; i<full; i++) {
                html += tfull;
            }
            for(var i=0; i<half; i++) {
                html += thalf;
            }
            for(var i=0; i<blank; i++) {
                html += tblank;
            }

            // 渲染到页面上
            $el.html(html).addClass("star");     
        }
    })
})();