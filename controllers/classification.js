/*
 * @Author: yangzhaobin 
 * @Date: 2018-03-09 15:43:29 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-05-13 16:55:51
 */

const Classification = require('../db/model/classification');


exports.getAllTags = async(ctx, next) => {
    let data = await Classification.findAllTags();
    ctx.body = data;
    return next();
}

exports.getAllTagsWithPage = async(ctx, next) => {
    let params = ctx.request.query;
    let { limit = 10, offset = 0} = params;
    let data = await Classification.findAllTagsWithPage(limit, offset);
    ctx.body = data;
    return next();
}

exports.delAllTags = async(ctx, next) => {
    let data = await Classification.deleteAllTags();
    ctx.body = data;
    return next();
}