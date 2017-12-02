

const Website = require('../db/model/website');

exports.getAllWebsites = async (ctx, next) => {
    let data = await Website.findAllWebsite();
    ctx.body = data;
}