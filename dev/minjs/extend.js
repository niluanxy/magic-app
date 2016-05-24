/**
 * String 对象添加 hashCode 功能
 *
 * @author      mufeng  <smufeng@gmail.com>
 * @version     0.1     <2015-04-26>
 * @link        http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }

    return hash;
}

/**
 * String 将首字符大写，其他小写
 */
String.prototype.toUpFirst = function() {
    var str = this.toLowerCase();

    str = str[0].toUpperCase() + str.slice(1);

    return str;     // 返回新的字符串
}

/**
 * String 对象返回真实的字符长度，修正汉字长度不一样
 */
String.prototype.cnLength = function() {
    return this.replace(/[^\x00-\xff]/g,"01").length;
}

/**
 * String 中文字符串截取函数
 * @param  {number} len [截取后的总长度，汉字占 2 字节]
 * @return {string}     [截取后的对象]
 */
String.prototype.cnTrim = function(len, end) {
    var str, reg = /[^\x00-\xff]/g, max = Math.floor(len/2);

    str = this.slice();                         // 复制当前对象
    end = end != undefined ? end : "...";       // 结尾追加的元素

    if(this.replace(reg, "mm").length <= len) {
        return str;
    }

    for(var i = max; i<str.length; i++) {
        var sub = str.substr(0, i).replace(reg, "mm");

        if(sub.length >= len) {
            return str.substr(0, i) + end;
        }
    }

    return str;
}

/**
 * Array findBy 工具函数，通过给定的key和值反向查找数据
 * eg: var test = [
 *     {name: "jack", age: 23, work: true},
 *     {name: "tom",  age: 24, work: false},
 *     {name: "tony", age: 22, work: false},
 *     {name: "kidy", age: 26, work: true},
 * ]
 *     test.findBy("name", "tony")
 * ret:  {name: "tony", age: 22, work: false}
 *     test.findBy("name", "tom", true)
 * ret:  1
 */

Array.prototype.findBy = function(key, val, index) {
    for(var i in this) {
        if (this[i][key] == val) {
            if (index != undefined) {
                if (index === true) {
                    return i;   // true 返回下标
                } else if (typeof index == "string") {
                    // 尝试返回指定的值
                    return this[i][index];
                }
            }

            return this[i]; // 默认返回对象
        }
    }

    return undefined;
}

/* 检测当前数组是否包含某元素 */
Array.prototype.findIn = function(val) {
    for(var i=0; i<this.length; i++) {
        if (this[i] == val) {
            return true;
        }
    }

    return false;
}

/* 删除数组中指定值 */
Array.prototype.delBy = function(val, all) {
    for(var i=0; i<this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            if (!all) break;
        }
    }

    return this;
}

/* 函数去重方法 */
Array.prototype.unique = function() {
    var res = [], hash = {};
    
    for(var i=0, elem; (elem = this[i]) != null; i++)  {
        if (!hash[elem])
        {
            res.push(elem);
            hash[elem] = true;
        }
    }

    return res;
}
