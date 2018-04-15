/*
 * config logger and return it.
 *
 * @Author: yangzhaobin 
 * @Date: 2018-04-02 13:37:35 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-04-02 13:38:27
 */
 

'use strict';

const log4js = require('log4js');
const CONFIG = require('./config/log4js');

module.exports = (_module) => {
    log4js.configure(CONFIG[_module]);
    const logger = log4js.getLogger(_module);

    return logger;
};
