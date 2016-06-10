module.exports = (function() {
    var dom = {}, _UTIL = require("util"), _DOM = require("dom");

    /* 将自身从父元素中删除，如果可以的话 */
    dom.remove = function() {
        return _DOM.remove(this[0]);
    };

    /* 获取当前元素在父类中的位置 */
    dom.index = function() {
        var parent = this.parent(), items;

        if (parent) {
            parent = parent[0];
            items  = parent.children;

            for(var i=0; i<items.length; i++) {
                if (items[i] == this[0]) {
                    return i;
                }
            }
        }

        return -1;  // 默认返回 -1
    };

    /* 设置或读取元素的内联HTML内容 */
    dom.html = function(html) {
        if (!this[0]) return this;

        if (html != undefined /* 有值时设置值并返回自身 */) {
            this[0].innerHTML = html;
            return this;
        } else {
            return this[0].innerHTML;
        }
    };

    dom.text = function(text) {
        if (!this[0]) return this;

        if (text /* 有值时设置值并返回自身 */) {
            this[0].innerText = text;
            return this;
        } else {
            return this[0].innerText;
        }
    };

    /* 返回当前元素的克隆元素 */
    dom.clone = function() {
        return this[0] ? $(_DOM.clone(this[0])) : null;
    };

    /* 为对象添加HTML对象或者字符串 */
    dom.append = function(text) {
        if (text instanceof Magic) {
            text = text[0];
        }
        this[0] = _DOM.append(this[0], text);
        return this;
    };

    dom.appendTo = function(select) {
        var $to = Magic(select);
        $to && $to.append(this);

        return this;
    };

    dom.insertBefore = function(text) {
        if (text instanceof Magic) {
            text = text[0];
        }
        this[0] = _DOM.prepend(this[0], text);
        return this;
    };

    /* 元素前插入对象操作的方法 */
    dom.before = function(html) {
        if (text instanceof Magic) {
            text = text[0];
        }
        _DOM.before(this[0], html);

        return this;
    };

    /* 元素后插入对象操作的方法 */
    dom.after = function(html) {
        if (html instanceof Magic) {
            html = html[0];
        }
        _DOM.after(this[0], html);

        return this;
    };

    /* 元素外包裹元素 */
    dom.wrap = function(html) {
        if (html instanceof Magic) {
            html = html[0];
        }
        _DOM.wrap(this[0], html);

        return this;
    };

    /* 选择元素的所有子元素外包裹dom */
    dom.wrapAll = function(html) {
        if (html instanceof Magic) {
            html = html[0];
        }
        _DOM.wrapAll(this[0], html);

        return this;
    };

    /* 对象的父元素和子元素操作方法 */
    dom.parent = function() {
        var parent = _DOM.parent(this[0]);

        if (parent) return Magic(parent);
    };

    dom.children = function(cls) {
        var childs = null, tmp;  // 存放子类元素
        if (this[0] /* 有对象时执行 */) {
            childs = this[0].children;

            if (typeof cls == "string") {
                tmp = [];   // 临时存放结果

                for(var i=0; i<childs.length; i++) {
                    if (_UTIL.hasClass(childs[i], cls)) {
                        tmp.push(childs[i]);
                    }
                }

                childs = tmp;
            }
        }

        if (childs) {
            return Magic(childs[0])
        } else {
            return null;
        }
    };

    // 绑定到对象上
    Magic.fn.extend(dom);
})();
