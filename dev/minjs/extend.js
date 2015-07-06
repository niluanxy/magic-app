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
 * Array findBy 工具函数，通过给定的key和值反向查找数据
 */

Array.prototype.findBy = function(key, val, index) {
    for(var i in this) {
        if (this[i][key] == val) {
            return index?i:this[i];
        }
    }

    return undefined;
}