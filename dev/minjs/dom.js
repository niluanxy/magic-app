/* 常见的dom操作类库 */

module.exports = (function() {
    var _dom = {}; // 定义返回的对象

    /**
     * 检测字符串是否可以创建为 dom 元素 
     */
    _dom.check = function(text) {
        if (typeof text === "string" &&
             text[0] === "<" && 
             text[ text.length - 1 ] === ">" &&
             text.length >= 3) {

            return true;
        }

        return false;
    }

    /**
     * 尝试将 text 转为 dom 对象
     *
     * @param       {String}    text - 要转换的DOM字符串
     * @return      {Element}   包含转换好的DOM的一个Body对象
     * @author      mufeng  <smufeng@gmail.com>
     * @version     0.1     <2015-05-30>
     */
    _dom.make = function(text, context) {
        var ret, i, div, tmp, cont, node = [], fragment; // 最终返回的 dom 对象

        if (_dom.check(text)) {
            // 修复执行的上下文
            context = context && context.nodeType ? context.ownerDocument || context : document;
            fragment = context.createDocumentFragment();
            
            // 创建一个临时的div对象并插入字符串
            div = fragment.appendChild( context.createElement("div") );
            div.innerHTML = text;

            for(i=0; tmp = div.childNodes[i]; i++) node[i] = tmp;

            // 清除 fragment 的内容
            fragment.textContent = "";
            for(i=0; tmp=node[i]; i++) fragment.appendChild(tmp);

            ret = fragment; // 设置返回对象
        } else if (text instanceof Element) {
            ret = text;     // 如果是DOM元素直接返回
        }

        return ret;    // 返回DOM对象
    };


    /**
     * 返回元素的父节点
     */
    _dom.parent = function(el) {
        return el && el.parentNode;
    }

    /**
     * 移除元素
     */
    _dom.remove = function(el) {
        var parent;

        if (el && (parent = el.parentNode) &&
            parent != document) {
            parent.removeChild(el);
        }

        return el;
    }   

    /** 指定元素的前后插入新对象,默认后方 */
    _dom._addIn = function(el, html, before) {
        var parent, dom;

        if ( el && (parent = el.parentNode) && 
            (dom = _dom.make(html)) ) {
            return parent.insertBefore(dom, before ? el : el.nextSibling);
        }

        return;
    }

    /* 选择元素的前方插入对象 */
    _dom.before = function(el, html) {
        return _dom._addIn(el, html, true)
    }

    _dom.after = function(el, html) {
        return _dom._addIn(el, html);
    }

    /* 选择元素的开头插入对象 */
    _dom.prepend = function(el, html) {
        var dom;

        if ( el && el.nodeType === 1 && 
            (dom = _dom.make(html)) ) {
            el.insertBefore(dom, el.firstChild);
        }

        return el;
    }

    /* 选择元素的末尾插入对象 */
    _dom.append = function(el, html) {
        if ( el && el.appendChild &&
            (insert = _dom.make(html)) ) {
            el.appendChild(insert)
        }

        return el;  // 返回处理后的对象
    }

    /* 选择元素的外围包裹一层dom代码 */
    _dom.wrap = function(el, html) {
        var wrap, parent;
        if ( el && (parent = el.parentNode)
             && (wrap = _dom.make(html)) ) {
            
            wrap = wrap.firstChild;
            wrap = parent.insertBefore(wrap, el);
            _dom.append(wrap, el);
        }

        return el;
    }

    /* 给定元素的所有子元素外包裹一层dom代码 */
    _dom.wrapAll = function(el, html) {
        var wrap, first, items;

        if ( el && el.nodeType === 1 &&
             (wrap = _dom.make(html)) ) {

            wrap  = wrap.firstChild;
            first = el.firstChild;
            el.insertBefore(wrap, first);

            if (first /* 尝试移动子元素 */) {
                items = el.childNodes;
                for(var i=1; i<items.length; i=1) {
                    wrap.appendChild(items[i])
                }
            }
        }

        return el;
    }

    return _dom;
})();