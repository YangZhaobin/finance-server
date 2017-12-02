/**
 * Gets MAC address
 * 
 * @author yangzb0922@163.com
 * @date 2017/11/29
 * @version 1.0.0
 */

'use strict';

const os = require('os');

module.exports = () => {
    const infs = os.networkInterfaces();
    for (let k in infs) {
        const matched = infs[k].filter(item => {
            return !item.internal && item.address.match(/^[172|10|168]{2,3}\./);
        });

        if (matched && matched.length > 0) {
            return matched[0].mac;
        }
    }
};
