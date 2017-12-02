/**
 * Array utils
 * 
 * @author yangzb0922@163.com
 * @version 1.0.0
 * @date 2017/11/29
 */

'use strict';

exports.isArray = (obj) => {
    if (obj instanceof Array)
        return true;
    return Object.prototype.toString.call(obj) === '[object Array]';
};
