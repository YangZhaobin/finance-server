const Artical = require('../db/model/artical');
const CrawlerNetease = require('../crawler/artical/netease');
const CrawlerPeople = require('../crawler/artical/people');
const CrawlerSina = require('../crawler/artical/sina');
const CrawlerTencent = require('../crawler/artical/tencent');
const CrawlerPrcfe = require('../crawler/artical/prcfe');
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
    } else if (data.website_id === 6) {
        artical = await CrawlerPrcfe.crawlArtical(data.url);
    }
    ctx.body = artical;
}

exports.getAllArticals = async(ctx, next) => {
    let params = ctx.request.query;
    let { limit = 10, offset = 0} = params;
    let data = await Artical.findAllArticals(limit, offset);
    ctx.body = data;
}

exports.getAllArticalsNoPage = async(ctx, next) => {
    let data = await Artical.findAllArticalsNoPage();
    ctx.body = data;
}

exports.getAllArticalsByWeb = async(ctx, next) => {
    let params = ctx.request.query;
    let { site, type = '', limit = 10, offset = 0} = params;
    let data = {};
    let site_id = 1;
    switch(site) {
        case 'sina':
            site_id = 1;
            break;
        case 'tencent':
            site_id = 2;
            break;
        case 'netease':
            site_id = 3;
            break;
        case 'people':
            site_id = 4;
            break;
        case 'wallstreet':
            site_id = 5;
            break;
        case 'prcfe':
            site_id = 6;
            break;
    }

    data = await Artical.findAllArticalsByWeb(site_id, type, limit, offset);
    ctx.body = data;
}

exports.getAllArticalsByTitle = async(ctx, next) => {
    let params = ctx.request.query;
    let { title, site = '', type = '', limit = 10, offset = 0 } = params;
    let data = {};
    data = await Artical.findArticalsByTitle(title, site, type, limit, offset);
    ctx.body = data;
}

exports.getAllArticalsByType = async(ctx, next) => {
    let params = ctx.request.query;
    let { type = '', limit = 10, offset = 0 } = params;
    let data = {};
    data = await Artical.findArticalsByType(type, limit, offset);
    ctx.body = data;
}