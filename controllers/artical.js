const config = require('../const/web_const');
const Artical = require('../db/model/artical');
const Collection = require('../db/model/collection');
require('../db/model/collection');
const jwt = require('koa-jwt');
const CrawlerNetease = require('../crawler/artical/netease');
const CrawlerSina = require('../crawler/artical/sina');
const CrawlerTencent = require('../crawler/artical/tencent');
const CrawlerPrcfe = require('../crawler/artical/prcfe');
const CrawlerWallstreet = require('../crawler/artical/wallstreet');
const Crawler10jqka = require('../crawler/artical/10jqka');
const CrawlerCaixin = require('../crawler/artical/caixin');
const CrawlerJrj = require('../crawler/artical/jrj');
// const CrawlerYicai = require('../crawler/artical/yicai');
const CrawlerFt = require('../crawler/artical/ft');
const Website = require('../db/model/website');

exports.getArticalById = async(ctx, next) => {
    let params = ctx.request.query;
    let { id } = ctx.params;
    let data = await Artical.findById(id);

    let artical = {};
    if (data.website_id === 1) {
        artical = await CrawlerSina.crawlArtical(data.url);
    } else if (data.website_id === 2) {
        artical = await CrawlerTencent.crawlArtical(data.url);
    } else if (data.website_id === 3) {
        artical = await CrawlerNetease.crawlArtical(data.url);
    } else if (data.website_id === 4) {
        // artical = await CrawlerPeople.crawlArtical(data.url);
    } else if (data.website_id === 5) {
        artical = await CrawlerWallstreet.crawlArtical(data.url);
    } else if (data.website_id === 6) {
        artical = await CrawlerPrcfe.crawlArtical(data.url);
    } else if (data.website_id === 7) {
        artical = await Crawler10jqka.crawlArtical(data.url);
    } else if (data.website_id === 9) {
        artical = await CrawlerCaixin.crawlArtical(data.url);
    } else if (data.website_id === 10) {
        artical = await CrawlerJrj.crawlArtical(data.url);
    } else if (data.website_id === 11) {
        // artical = await CrawlerYicai.crawlArtical(data.url);
    } else if (data.website_id === 12) {
        artical = await CrawlerFt.crawlArtical(data.url);
    }
    artical.id = id;
    let token = ctx.request.headers['x-csrf-token'] || '';
    if (!token) {
        artical.isCollected = false;
    } else {
        let profile = jwt.verify(token, 'yangzhaobin');
        let collection = await Collection.findCollection(profile.username, id);
        artical.isCollected = !!collection;
    }
    ctx.body = artical;
    return next();
}

exports.getAllArticals = async(ctx, next) => {
    let params = ctx.request.query;
    let { limit = 10, offset = 0} = params;
    let data = await Artical.findAllArticals(limit, offset);
    ctx.body = data;
    return next();
}

exports.getAllArticalsNoPage = async(ctx, next) => {
    let data = await Artical.findAllArticalsNoPage();
    ctx.body = data;
    return next();
}

exports.getAllArticalsByWeb = async(ctx, next) => {
    let params = ctx.request.query;
    let { site, type = '', limit = 10, offset = 0} = params;
    let data = {};
    if (site === '10jqka') {
        site = 'new10jqka';
    }
    let site_id = config[site].id;
    data = await Artical.findAllArticalsByWeb(site_id, type, limit, offset);
    ctx.body = data;
    return next();
}

exports.getAllArticalsByTitle = async(ctx, next) => {
    let params = ctx.request.query;
    let { title, site = '', type = '', limit = 10, offset = 0 } = params;
    let data = {};
    if (site === '10jqka') {
        site = 'new10jqka';
    }
    let site_id;
    site && (site_id = config[site].id);
    data = await Artical.findArticalsByTitle(title, site_id, type, limit, offset);
    ctx.body = data;
    return next();
}

exports.getAllArticalsByType = async(ctx, next) => {
    let params = ctx.request.query;
    let { type = '', limit = 10, offset = 0 } = params;
    let data = {};
    data = await Artical.findArticalsByType(type, limit, offset);
    ctx.body = data;
    return next();
}

exports.getAllWebsitesByType = async(ctx, next) => {
    let params = ctx.request.query;
    let { type = '' } = params;
    let data = {};
    data = await Artical.findWebsitesByType(type);
    ctx.body = data;
    return next();
}