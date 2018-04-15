/*
 * @Author: yangzhaobin 
 * @Date: 2018-03-09 15:43:29 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-03-30 14:01:41
 */

const Classification = require('../db/model/classification');


exports.getAllTags = async(ctx, next) => {
    let data = await Classification.findAllTags();

    ctx.body = data;

    return next();
}

exports.delAllTags = async(ctx, next) => {
    let data = await Classification.deleteAllTags();
    ctx.body = data;
    return next();
}