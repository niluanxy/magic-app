module.exports = (function() {
    $$.component("mg-header", {
        template: "<content></content>",
        ready: function() {
            var $el = $(this.$el), title, child;

            $el.addClass("bar bar-header");
            
            title = $el.query(".title");
            child = this.$el.childNodes;

            /* title不为空尝试删除前面的元素 */
            if (title) {
                for(var i=0; i<child.length; i++) {
                    if (child[i] !== title) {
                        break;  // 找到title后，中止循环
                    } else {
                        $(child[i]).remove();
                    }
                }
            }
        }
    });
})();