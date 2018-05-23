/*
 * Spider middleware
 *  
 * @Author: yangzhaobin 
 * @Date: 2018-04-02 13:52:57 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-05-04 16:17:23
 */
const Spider = require('../lib/spider');

module.exports = (ctx) => {
    ctx.spider = ctx.spider || new Spider(ctx.appName);
    ctx.spider.init().start();
};
