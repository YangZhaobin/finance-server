/**
 * Handlebars helpers
 * 
 * @author yangzb0922@163.com
 * @date 2017/11/29
 */

'use strict';

const moment = require('moment');

/**
 * generate element id for components and templates document
 */
exports.generateId = () => {
    const seed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-',
        length = 10;
    let idStr = '';
    for (let i = 0; i < length; i++) {
        const index = Math.ceil(Math.random() * 38),
            char = seed[index];
        if (char === '-') {
            --i;
            continue;
        }
        idStr += char;
    }
    return idStr;
};

/**
 * 
 * @param {any} datetime 
 * @param {string} fmt 
 */
exports.formatDate = (datetime, fmt) => {
    // format rules: https://momentjs.com/docs/#/displaying/format/
    if (!fmt || typeof fmt !== 'string') {
        fmt = 'YYYY-MM-DD HH:mm:ss';
    }
    if (!datetime) {
        datetime = new Date().getTime();
    }
    if (datetime instanceof Date) {
        datetime = datetime.getTime();
    }
    try {
        return moment(datetime).format(fmt);
    } catch(err) {
        return '---'
    }
};

exports.eq = (val1, val2, options) => {
    return val1 === val2;
};
