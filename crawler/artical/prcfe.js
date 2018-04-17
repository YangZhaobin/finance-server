
const cheerio = require('cheerio');
const server = require('../curl');
const Helpers = require('../../utils/helpers/index');
const config = require('../../const/web_const');

const from = config.prcfe.cn;

function analyzeArtical($) {
    let title = Helpers.unescapeText($('.main h1.h1 .fl').eq(0).html());
    let content = Helpers.unescapeText($('.main-left-article').eq(0).html());
    let published_at = Helpers.unescapeText($('.main .Timeing').eq(0).next().html());

    let f = Helpers.unescapeText($('.sources').eq(0).children('em').eq(0).html()) + ' / ' + from; 

    return {
        title,
        content,
        published_at,
        from: f
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url, 'utf-8');

    let $ = cheerio.load(data);
            
    let artical = await analyzeArtical($);

    return artical;
};