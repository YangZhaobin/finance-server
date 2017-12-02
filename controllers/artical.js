const Artical = require('../db/model/artical');
const CrawlerNetease = require('../crawler/artical/netease');
const CrawlerPeople = require('../crawler/artical/people');
const CrawlerSina = require('../crawler/artical/sina');
const CrawlerTencent = require('../crawler/artical/tencent');
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
        artical = await CrawlerPeople.crawlArtical(data.url);
    }
    ctx.body = artical;
}

exports.getAllArticals = async(ctx, next) => {
    let params = ctx.request.query;
    let { limit, offset } = params;
    let data = await Artical.findAllArticals(limit, offset);
    ctx.body = data;
}

exports.getAllArticalsByWeb = async(ctx, next) => {
    let params = ctx.request.query;
    let { site, type = '', limit, offset } = params;
    let data = {};
    data = await Artical.findAllArticalsByWeb(site, type, limit, offset);
    ctx.body = data;
}

exports.getAllArticalsByTitle = async(ctx, next) => {
    let params = ctx.request.query;
    let { title, site = '', type = '', limit, offset } = params;
    let data = {};
    data = await Artical.findArticalsByTitle(title, site, type, limit, offset);
    ctx.body = data;
}